import { sleep } from "@digital-alchemy/core";

import { ANY_ENTITY, ENTITY_STATE } from "../helpers/index.mts";
import { hassTestRunner } from "../mock_assistant/index.mts";

describe("Entity", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  describe("API", () => {
    describe("Updates", () => {
      xit("should debounce updates properly", async () => {
        expect.assertions(1);
        await new Promise<void>(async done => {
          await hassTestRunner.run(({ hass }) => {
            const spy = vi.fn();
            hass.events.onEntityRegistryUpdate(spy);
            hass.socket.onConnect(async () => {
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
              expect(spy).toHaveReturnedTimes(2);
              done();
            });
          });
        });
      });

      it("should emit updates on change", async () => {
        expect.assertions(3);
        await hassTestRunner.run(({ lifecycle, hass, event }) => {
          lifecycle.onReady(() => {
            const old_state = hass.entity.getCurrentState("sensor.magic");
            const new_state = { ...old_state, state: "test" };
            const spy = vi.spyOn(event, "emit");
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
        await hassTestRunner.run(({ lifecycle, hass }) => {
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
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const entity = hass.refBy.unique_id("5622d76001a335e3ea893c4d60d31b3d-next_dawn");
          expect(entity).toBeDefined();
          expect(entity.entity_id).toBe("sensor.sun_next_dawn");
        });
      });
    });

    it("should return unmodified entity state with .raw", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const allData = hass.entity._masterState();
          const single = hass.entity.getCurrentState("sun.sun");
          expect(single).toBe(allData.sun.sun);
        });
      });
    });

    it("should return previous entity state with .previous", async () => {
      expect.assertions(3);
      await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
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
      await hassTestRunner.run(({ lifecycle, hass }) => {
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
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(hass.entity, "refresh").mockImplementation(async () => undefined);

        lifecycle.onPostConfig(function latePostConfig() {
          expect(spy).toHaveBeenCalled();
        }, -1);
        lifecycle.onPostConfig(function earlyPostConfig() {
          expect(spy).not.toHaveBeenCalled();
        }, 0);
      });
    });

    it("should retry on failure", async () => {
      expect.assertions(1);
      await hassTestRunner.configure({ hass: { RETRY_INTERVAL: 0 } }).run(({ lifecycle, hass }) => {
        const responses = [
          { text: "502 Bad Gateway" },
          { text: "502 Bad Gateway" },
          { text: "502 Bad Gateway" },
          [],
          [{ entity_id: "sensor.magic" } as ENTITY_STATE<ANY_ENTITY>],
        ];
        const spy = vi
          .spyOn(hass.fetch, "getAllEntities")
          // @ts-expect-error it happens
          .mockImplementation(async () => responses.shift());

        lifecycle.onBootstrap(() => expect(spy).toHaveBeenCalledTimes(5));
      });
    });
  });
});
