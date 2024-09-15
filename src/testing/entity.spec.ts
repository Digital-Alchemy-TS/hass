import { LibraryTestRunner, sleep, TestRunner } from "@digital-alchemy/core";

import { LIB_HASS } from "..";
import { ANY_ENTITY, ENTITY_STATE, HassConfig } from "../helpers";
import { LIB_MOCK_ASSISTANT } from "../mock_assistant";

describe("Entity", () => {
  let runner: LibraryTestRunner<typeof LIB_HASS>;

  beforeEach(() => {
    runner = TestRunner({ target: LIB_HASS })
      .appendLibrary(LIB_MOCK_ASSISTANT)
      .appendService(({ hass }) => {
        jest
          .spyOn(hass.fetch, "getConfig")
          .mockImplementation(async () => ({ version: "2024.4.1" }) as HassConfig);
      });
  });

  afterEach(async () => {
    await runner.teardown();
    jest.restoreAllMocks();
  });

  describe("API", () => {
    describe("Updates", () => {
      fit("should debounce updates properly", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass }) => {
          jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
          let counter = 0;
          hass.events.onEntityRegistryUpdate(() => counter++);
          lifecycle.onReady(async () => {
            setImmediate(async () => {
              hass.socket.socketEvents.emit("entity_registry_updated");
              await sleep(5);
              hass.socket.socketEvents.emit("entity_registry_updated");
              await sleep(5);
              hass.socket.socketEvents.emit("entity_registry_updated");
              await sleep(20);
              hass.socket.socketEvents.emit("entity_registry_updated");
            });
            await sleep(50);
            expect(counter).toBe(2);
          });
        });
      });

      it("should emit updates on change", async () => {
        expect.assertions(3);
        await runner.run(({ lifecycle, hass, event }) => {
          lifecycle.onReady(() => {
            const old_state = hass.entity.getCurrentState("sensor.magic");
            const new_state = { ...old_state, state: "test" };
            const spy = jest.spyOn(event, "emit");
            hass.entity._entityUpdateReceiver("sensor.magic", new_state, old_state);
            expect(spy).toHaveReturnedTimes(2);
            expect(spy).toHaveBeenCalledWith("sensor.magic", new_state, old_state);
            expect(spy).toHaveBeenCalledWith(
              "e1806fdc93296bbd5ab42967003cd38729ff9ba6cfeefc3e15a03ad01ac894fe",
              new_state,
              old_state,
            );
          });
        });
      });

      it("returns undefined from nextState when timeout is exceeded", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const old_state = hass.entity.getCurrentState("sensor.magic");

            // Set a timeout of 100ms
            const wait = new Promise<ENTITY_STATE<ANY_ENTITY> | undefined>(async done => {
              done(await entity.nextState(25));
            });

            // Simulate delay longer than the timeout to ensure timeout is exceeded
            setTimeout(() => {
              const new_state = { ...old_state, state: "test" };
              hass.entity._entityUpdateReceiver("sensor.magic", new_state, old_state);
            }, 50); // 200ms delay

            const result = await wait;
            expect(result).toBeUndefined();
          });
        });
      });
    });

    it("should find entities by unique_id", async () => {
      expect.assertions(2);
      await runner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const entity = hass.refBy.unique_id("5622d76001a335e3ea893c4d60d31b3d-next_dawn");
          expect(entity).toBeDefined();
          expect(entity.entity_id).toBe("sensor.sun_next_dawn");
        });
      });
    });

    it("should return unmodified entity state with .raw", async () => {
      expect.assertions(1);
      await runner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const allData = hass.entity._masterState();
          const single = hass.entity.getCurrentState("sun.sun");
          expect(single).toBe(allData.sun.sun);
        });
      });
    });

    it("should return previous entity state with .previous", async () => {
      expect.assertions(3);
      await runner.run(({ lifecycle, hass, mock_assistant }) => {
        const entity_id = "sensor.magic";
        const value = "bar";
        lifecycle.onReady(async () => {
          const start = hass.entity.getCurrentState(entity_id);
          await mock_assistant.events.emitEntityUpdate(entity_id, {
            state: value,
          });
          const updated = hass.entity.getCurrentState(entity_id);
          const previous = hass.entity.previousState(entity_id);
          expect(updated.state).toBe(value);
          expect(start.state).not.toBe(value);
          expect(start).toEqual(previous);
        });
      });
    });

    it("should return undefined for no matches", async () => {
      expect.assertions(1);
      await runner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const entity = hass.refBy.unique_id(
            // @ts-expect-error test
            "5622d76001a335e3ea893c4d60d31b3d-previous_dawn",
          );
          expect(entity).not.toBeDefined();
        });
      });
    });
  });

  describe("Refresh", () => {
    it("should attempt to load entities onBootstrap", async () => {
      expect.assertions(2);
      await runner.run(({ lifecycle, hass }) => {
        const spy = jest.spyOn(hass.entity, "refresh").mockImplementation(async () => undefined);

        lifecycle.onPostConfig(function latePostConfig() {
          expect(spy).toHaveBeenCalled();
        }, -1);
        lifecycle.onPostConfig(function earlyPostConfig() {
          expect(spy).not.toHaveBeenCalled();
        }, 0);
      });
    });

    it("should not attempt to load entities onBootstrap if AUTO_CONNECT_SOCKET is false", async () => {
      expect.assertions(1);
      await runner.run(({ lifecycle, hass }) => {
        const spy = jest.spyOn(hass.entity, "refresh").mockImplementation(async () => undefined);

        lifecycle.onBootstrap(() => {
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });

    it("should retry on failure", async () => {
      expect.assertions(1);
      await runner.run(({ lifecycle, hass }) => {
        const responses = [
          { text: "502 Bad Gateway" },
          { text: "502 Bad Gateway" },
          { text: "502 Bad Gateway" },
          [],
          [{ entity_id: "sensor.magic" } as ENTITY_STATE<ANY_ENTITY>],
        ];
        const spy = jest
          .spyOn(hass.fetch, "getAllEntities")
          // @ts-expect-error it happens
          .mockImplementation(async () => responses.shift());

        lifecycle.onBootstrap(() => expect(spy).toHaveBeenCalledTimes(5));
      });
    });
  });
});
