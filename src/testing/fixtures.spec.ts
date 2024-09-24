import { v4 } from "uuid";

import { createTestRunner } from "../mock_assistant";

describe("Fixtures", () => {
  let runner: ReturnType<typeof createTestRunner>;
  beforeEach(() => {
    runner = createTestRunner();
  });
  afterEach(async () => {
    await runner.teardown();
    jest.restoreAllMocks();
  });

  describe("Entity setup", () => {
    describe("bootLibrariesFirst", () => {
      it("matches state using setup", async () => {
        expect.assertions(1);
        const state = v4();
        await runner
          .bootLibrariesFirst()
          .setup(({ mock_assistant }) => {
            mock_assistant.entity.setupState({
              "switch.porch_light": { state },
            });
          })
          .run(({ hass }) => {
            const entity = hass.refBy.id("switch.porch_light");
            expect(entity.state).toBe(state);
          });
      });

      it("gets mad trying to set state late", async () => {
        expect.assertions(1);
        const state = v4();
        await runner.bootLibrariesFirst().run(({ mock_assistant }) => {
          expect(() => {
            mock_assistant.entity.setupState({
              "switch.porch_light": { state },
            });
          }).toThrow();
        });
      });
    });

    describe("lifecycle", () => {
      it("matches state using setup", async () => {
        expect.assertions(1);
        const state = v4();
        await runner
          .setup(({ mock_assistant }) => {
            mock_assistant.entity.setupState({
              "switch.porch_light": { state },
            });
          })
          .run(({ hass, lifecycle }) => {
            lifecycle.onReady(() => {
              const entity = hass.refBy.id("switch.porch_light");
              expect(entity.state).toBe(state);
            });
          });
      });

      it("gets mad trying to set state late", async () => {
        expect.assertions(1);
        const state = v4();
        await runner.run(({ mock_assistant, lifecycle }) => {
          lifecycle.onReady(() => {
            expect(() => {
              mock_assistant.entity.setupState({
                "switch.porch_light": { state },
              });
            }).toThrow();
          });
        });
      });

      it("gets mad trying to set state late in setup", async () => {
        expect.assertions(1);
        const state = v4();
        await runner
          .setup(({ mock_assistant, lifecycle }) => {
            lifecycle.onReady(() => {
              expect(() => {
                mock_assistant.entity.setupState({
                  "switch.porch_light": { state },
                });
              }).toThrow();
            });
          })
          .run(() => {});
      });
    });
  });

  describe("Change events", () => {
    describe("unhappy path", () => {
      it("throws errors for unknown entities", async () => {
        expect.assertions(1);
        await runner.bootLibrariesFirst().run(async ({ mock_assistant }) => {
          try {
            // @ts-expect-error it's the test
            await mock_assistant.entity.emitChange("switch.fake", {});
          } catch (error) {
            expect(error).toBeDefined();
          }
        });
      });

      it("throws errors for early changes", async () => {
        expect.assertions(1);
        await runner.run(async ({ mock_assistant }) => {
          try {
            await mock_assistant.entity.emitChange("switch.porch_light", {});
          } catch (error) {
            expect(error).toBeDefined();
          }
        });
      });
    });

    it("update events happen on emit", async () => {
      expect.assertions(1);
      await runner
        .bootLibrariesFirst()
        .setup(({ mock_assistant }) => {
          mock_assistant.entity.setupState({
            "switch.porch_light": { state: "on" },
          });
        })
        .run(async ({ hass, mock_assistant }) => {
          const entity = hass.refBy.id("switch.porch_light");
          const spy = jest.fn();
          entity.onUpdate(spy);
          await mock_assistant.entity.emitChange("switch.porch_light", { state: "off" });
          expect(spy).toHaveBeenCalled();
        });
    });

    it("sends events for noop changes", async () => {
      expect.assertions(1);
      await runner
        .bootLibrariesFirst()
        .setup(({ mock_assistant }) => {
          mock_assistant.entity.setupState({
            "switch.porch_light": { state: "on" },
          });
        })
        .run(async ({ hass, mock_assistant }) => {
          const entity = hass.refBy.id("switch.porch_light");
          const spy = jest.fn();
          entity.onUpdate(spy);
          await mock_assistant.entity.emitChange("switch.porch_light", { state: "on" });
          expect(spy).toHaveBeenCalled();
        });
    });
  });
});
