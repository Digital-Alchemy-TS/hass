import dayjs from "dayjs";

import type { ENTITY_STATE } from "../helpers/index.mts";
import { hassTestRunner } from "../mock_assistant/index.mts";
import type { ANY_ENTITY } from "../user.mts";

describe("References", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  describe("loading", function () {
    describe("refBy.id", () => {
      it("can grab references by id", async () => {
        expect.assertions(2);
        await hassTestRunner.run(({ lifecycle, hass, logger, context }) => {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.id("sensor.magic");
            sensor.onStateFor({
              context,
              exec: () => logger.info("HIT"),
              for: "5h",
              matches: new_state => new_state.state === "test",
            });
            expect(sensor).toBeDefined();
            expect(sensor.state).toBe("unavailable");
          });
        });
      });
    });

    describe("domain", () => {
      it("load references by domain", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.domain("sensor");
            expect(sensor.length).toBe(11);
          });
        });
      });
    });

    describe("unique_id", () => {
      it("load references by unique_id", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.unique_id(
              "e1806fdc93296bbd5ab42967003cd38729ff9ba6cfeefc3e15a03ad01ac894fe",
            );
            expect(sensor?.entity_id).toBe("sensor.magic");
          });
        });
      });
    });

    describe("label", () => {
      it("load references by label", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const list = hass.refBy.label("synapse");
            expect(list.length).toBe(7);
          });
        });
      });

      it("load references by label limiting by domain", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const list = hass.refBy.label("synapse", "light");
            expect(list.length).toBe(0);
          });
        });
      });
    });

    describe("area", () => {
      it("load references by area", async () => {
        expect.assertions(2);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const bedroom = hass.refBy.area("bedroom");
            const kitchen = hass.refBy.area("kitchen");
            expect(bedroom.length).toBe(2);
            expect(kitchen.length).toBe(1);
          });
        });
      });

      it("load references by area limiting by domain", async () => {
        expect.assertions(2);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const bedroom = hass.refBy.area("bedroom", "light");
            const kitchen = hass.refBy.area("kitchen", "light");
            expect(bedroom.length).toBe(1);
            expect(kitchen.length).toBe(0);
          });
        });
      });
    });

    describe("device", () => {
      it("load references by device", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.device("308e39cf50a9fc6c30b4110724ed1f2e");
            expect(synapse.length).toBe(9);
          });
        });
      });

      it("load references by device limiting by domain", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.device("308e39cf50a9fc6c30b4110724ed1f2e", "light");
            expect(synapse.length).toBe(0);
          });
        });
      });
    });

    describe("platform", () => {
      it("load references by platform", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.platform("synapse");
            expect(synapse.length).toBe(11);
          });
        });
      });

      it("load references by platform limiting by domain", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.platform("synapse", "light");
            expect(synapse.length).toBe(1);
          });
        });
      });
    });

    describe("floor", () => {
      it("load references by floor", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.floor("downstairs");
            expect(synapse.length).toBe(3);
          });
        });
      });

      it("load references by floor limiting by domain", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.floor("downstairs", "light");
            expect(synapse.length).toBe(0);
          });
        });
      });
    });
  });

  describe("functionality", () => {
    describe("operators", () => {
      it("has", async () => {
        expect.assertions(16);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const entity = hass.refBy.id("switch.bedroom_lamp");
            // always there stuff
            expect("does not exist" in entity).toBe(false);
            [
              "attributes",
              "entity_id",
              "history",
              "last",
              "nextState",
              "once",
              "onStateFor",
              "onUpdate",
              "previous",
              "removeAllListeners",
              "state",
              "waitForState",
            ].forEach(property => expect(property in entity).toBe(true));
            // service calls exist too
            ["toggle", "turn_off", "turn_on"].forEach(method =>
              expect(method in entity).toBe(true),
            );
          });
        });
      });

      it("ownKeys", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const entity = hass.refBy.id("switch.bedroom_lamp");
            const keys = Object.keys(entity);
            // note: each section sorted alphabetically
            expect(keys).toEqual([
              // hard coded
              "entity_id",
              "state",
              "attributes",
              "last_changed",
              "last_reported",
              "last_updated",
              "context",
              "history",
              "last",
              "nextState",
              "once",
              "onStateFor",
              "onUpdate",
              "previous",
              "removeAllListeners",
              "waitForState",
              // services
              "toggle",
              "turn_off",
              "turn_on",
            ]);
          });
        });
      });
      describe("set", () => {
        it("state", () => {
          // stub
        });
        it("attributes", () => {
          // stub
        });
        it("everything else", () => {
          // stub
        });
      });
    });

    describe("get", () => {
      it("references have attributes", async () => {
        expect.assertions(2);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.id("sensor.magic");
            expect("attributes" in sensor).toBe(true);
            expect(sensor.attributes).toEqual(expect.objectContaining({ friendly_name: "magic" }));
          });
        });
      });

      // mental note: legacy test
      // better covered by the ownKeys & has operator tests now
      it("references do not return random attributes", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.id("sensor.magic");
            // @ts-expect-error it's the test
            expect(sensor.foo).toBeUndefined();
          });
        });
      });

      it("references provide last_* as dayjs", async () => {
        expect.assertions(3);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.id("sensor.magic");
            expect(sensor.last_changed instanceof dayjs).toBe(true);
            expect(sensor.last_reported instanceof dayjs).toBe(true);
            expect(sensor.last_updated instanceof dayjs).toBe(true);
          });
        });
      });

      it("passes through history calls", async () => {
        expect.assertions(2);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(async () => {
            const result = [] as ENTITY_STATE<ANY_ENTITY>[];
            const spy = vi
              .spyOn(hass.fetch, "fetchEntityHistory")
              .mockImplementation(async () => result);
            const from = new Date();
            const to = new Date();
            const entity_id = "sensor.magic";

            const entity = hass.refBy.id(entity_id);
            const out = await entity.history(from, to);
            expect(spy).toHaveBeenCalledWith(entity_id, from, to);
            expect(out).toBe(result);
          });
        });
      });

      it("returns undefined for non-string property access", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.id("sensor.magic");
            const symbolProperty = Symbol("test");
            // Accessing with a Symbol should return undefined
            // This tests the proxyGetLogic non-string check
            expect(Reflect.get(sensor, symbolProperty)).toBeUndefined();
          });
        });
      });

      it("nextState returns early when timeout is undefined", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
          lifecycle.onReady(async () => {
            const sensor = hass.refBy.id("sensor.magic");
            // Call nextState without timeout - should wait indefinitely for state change
            const nextStatePromise = sensor.nextState();

            // Emit a state update - promise should resolve with the new state
            await mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "updated",
            });

            const result = await nextStatePromise;
            // Should resolve with the updated state when timeout is undefined
            expect(result?.state).toBe("updated");
          });
        });
      });
    });

    describe("listener management", () => {
      it("addListener registers a remove callback", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const entity = hass.refBy.id("sensor.magic");
            const removeCallback = Object.assign(vi.fn(), { remove: vi.fn() });

            entity.addListener(removeCallback);

            // Call removeAllListeners - should call the registered callback
            entity.removeAllListeners();

            expect(removeCallback).toHaveBeenCalledTimes(1);
          });
        });
      });

      it("removeAllListeners calls all registered callbacks", async () => {
        expect.assertions(3);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          lifecycle.onReady(() => {
            const entity = hass.refBy.id("sensor.magic");
            const removeCallback1 = Object.assign(vi.fn(), { remove: vi.fn() });
            const removeCallback2 = Object.assign(vi.fn(), { remove: vi.fn() });
            const removeCallback3 = Object.assign(vi.fn(), { remove: vi.fn() });

            entity.addListener(removeCallback1);
            entity.addListener(removeCallback2);
            entity.addListener(removeCallback3);

            entity.removeAllListeners();

            expect(removeCallback1).toHaveBeenCalledTimes(1);
            expect(removeCallback2).toHaveBeenCalledTimes(1);
            expect(removeCallback3).toHaveBeenCalledTimes(1);
          });
        });
      });

      it("removeAllListeners cleans up onUpdate listeners", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn();

            entity.onUpdate(callback);

            // Remove all listeners
            entity.removeAllListeners();

            // Emit an update - callback should not be called
            await mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "updated",
            });

            expect(callback).not.toHaveBeenCalled();
          });
        });
      });

      it("removeAllListeners cleans up once listeners", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn();

            entity.once(callback);

            // Remove all listeners
            entity.removeAllListeners();

            // Emit an update - callback should not be called
            await mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "updated",
            });

            expect(callback).not.toHaveBeenCalled();
          });
        });
      });

      it("removeAllListeners cleans up onStateFor listeners", async () => {
        expect.assertions(1);
        vi.useFakeTimers();
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant, context }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn();

            entity.onStateFor({
              context,
              exec: callback,
              for: "0.1s",
              state: "on",
            });

            // Remove all listeners
            entity.removeAllListeners();

            // Change state to match
            const updatePromise = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "on",
            });
            await vi.advanceTimersByTimeAsync(1);
            await updatePromise;
            await vi.advanceTimersByTimeAsync(100);

            expect(callback).not.toHaveBeenCalled();
          });
        });
        vi.useRealTimers();
      });

      it("removeAllListeners cleans up both addListener and built-in listeners", async () => {
        expect.assertions(2);
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const addListenerCallback = Object.assign(vi.fn(), { remove: vi.fn() });
            const onUpdateCallback = vi.fn();

            entity.addListener(addListenerCallback);
            entity.onUpdate(onUpdateCallback);

            // Remove all listeners
            entity.removeAllListeners();

            // Emit an update - callbacks should not be called
            await mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "updated",
            });

            expect(addListenerCallback).toHaveBeenCalledTimes(1);
            expect(onUpdateCallback).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe("once", () => {
      it("calls callback once on next entity update", async () => {
        expect.assertions(2);
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn();

            entity.once(callback);

            // Emit first update - callback should be called
            await mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "first",
            });

            expect(callback).toHaveBeenCalledTimes(1);

            // Emit second update - callback should not be called again
            await mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "second",
            });

            expect(callback).toHaveBeenCalledTimes(1);
          });
        });
      });

      it("passes new_state and old_state to callback", async () => {
        expect.assertions(3);
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn();

            entity.once(callback);

            await mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "updated",
            });

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith(
              expect.objectContaining({ state: "updated" }),
              expect.any(Object),
            );
            expect(callback.mock.calls[0]).toHaveLength(2);
          });
        });
      });

      it("removes listener after callback is called", async () => {
        expect.assertions(2);
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn();

            entity.once(callback);

            // First update - callback should be called
            await mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "first",
            });

            expect(callback).toHaveBeenCalledTimes(1);

            // Second update - callback should not be called (listener removed)
            await mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "second",
            });

            expect(callback).toHaveBeenCalledTimes(1);
          });
        });
      });

      it("remove function prevents callback from being called", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn();

            const remove = entity.once(callback);

            // Remove the listener before update
            remove();

            // Emit update - callback should not be called
            await mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "updated",
            });

            expect(callback).not.toHaveBeenCalled();
          });
        });
      });

      it("handles multiple once listeners independently", async () => {
        expect.assertions(4);
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            entity.once(callback1);
            entity.once(callback2);

            // First update - both callbacks should be called
            await mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "first",
            });

            expect(callback1).toHaveBeenCalledTimes(1);
            expect(callback2).toHaveBeenCalledTimes(1);

            // Second update - neither callback should be called
            await mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "second",
            });

            expect(callback1).toHaveBeenCalledTimes(1);
            expect(callback2).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe("onStateFor", () => {
      it("executes callback when state matches for duration", async () => {
        expect.assertions(1);
        vi.useFakeTimers();
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant, context }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn();

            entity.onStateFor({
              context,
              exec: callback,
              for: "0.1s",
              state: "on",
            });

            // Change state to match
            const updatePromise = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "on",
            });

            // Advance timers to let the sleep(1ms) inside emitEntityUpdate complete
            await vi.advanceTimersByTimeAsync(1);

            // Now await the emitEntityUpdate to complete
            await updatePromise;

            // Advance timers to trigger the callback (0.1s = 100ms)
            await vi.advanceTimersByTimeAsync(100);

            expect(callback).toHaveBeenCalledTimes(1);
          });
        });
        vi.useRealTimers();
      });

      it("does not execute callback if state changes before duration", async () => {
        expect.assertions(1);
        vi.useFakeTimers();
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant, context }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn();

            entity.onStateFor({
              context,
              exec: callback,
              for: "0.1s",
              state: "on",
            });

            // Change state to match
            const updatePromise1 = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "on",
            });
            await vi.advanceTimersByTimeAsync(1);
            await updatePromise1;
            await vi.advanceTimersByTimeAsync(50);

            // Change state away before timer completes
            const updatePromise2 = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "off",
            });
            await vi.advanceTimersByTimeAsync(1);
            await updatePromise2;
            await vi.advanceTimersByTimeAsync(100);

            expect(callback).not.toHaveBeenCalled();
          });
        });
        vi.useRealTimers();
      });

      it("restarts timer when state changes back to matching", async () => {
        expect.assertions(2);
        vi.useFakeTimers();
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant, context }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn();

            entity.onStateFor({
              context,
              exec: callback,
              for: "0.1s",
              state: "on",
            });

            // Change state to match
            const updatePromise1 = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "on",
            });
            await vi.advanceTimersByTimeAsync(1);
            await updatePromise1;
            await vi.advanceTimersByTimeAsync(50);

            // Change state away
            const updatePromise2 = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "off",
            });
            await vi.advanceTimersByTimeAsync(1);
            await updatePromise2;
            await vi.advanceTimersByTimeAsync(50);

            // Change back to matching - should start new timer
            const updatePromise3 = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "on",
            });
            await vi.advanceTimersByTimeAsync(1);
            await updatePromise3;
            await vi.advanceTimersByTimeAsync(50);
            expect(callback).not.toHaveBeenCalled();

            // Complete the timer
            await vi.advanceTimersByTimeAsync(50);
            expect(callback).toHaveBeenCalledTimes(1);
          });
        });
        vi.useRealTimers();
      });

      it("uses custom matches function when provided", async () => {
        expect.assertions(3);
        vi.useFakeTimers();
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant, context }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn();
            const matches = vi.fn((new_state, old_state) => {
              return new_state.state === "target" && old_state.state !== "target";
            });

            entity.onStateFor({
              context,
              exec: callback,
              for: "0.1s",
              matches,
            });

            // Change to non-matching state - matches should return false, so no timer
            const updatePromise1 = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "other",
            });
            await vi.advanceTimersByTimeAsync(1);
            await updatePromise1;
            // Verify matches was called and returned false (no timer should be set)
            expect(matches).toHaveBeenCalled();
            // Advance timers - callback should not be called
            await vi.advanceTimersByTimeAsync(100);
            expect(callback).not.toHaveBeenCalled();

            // Change to matching state (target from different state) - matches should return true
            const updatePromise2 = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "target",
            });
            await vi.advanceTimersByTimeAsync(1);
            await updatePromise2;
            // Advance timers to trigger the callback
            await vi.advanceTimersByTimeAsync(100);
            expect(callback).toHaveBeenCalledTimes(1);
          });
        });
        vi.useRealTimers();
      });

      it("prevents duplicate timers when state matches multiple times", async () => {
        expect.assertions(1);
        vi.useFakeTimers();
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant, context }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn();

            entity.onStateFor({
              context,
              exec: callback,
              for: "0.1s",
              state: "on",
            });

            // Change state to match
            const updatePromise1 = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "on",
            });
            await vi.advanceTimersByTimeAsync(1);
            await updatePromise1;
            await vi.advanceTimersByTimeAsync(50);

            // Change to same matching state again - should not start new timer
            const updatePromise2 = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "on",
            });
            await vi.advanceTimersByTimeAsync(1);
            await updatePromise2;
            await vi.advanceTimersByTimeAsync(50);

            // Complete original timer
            await vi.advanceTimersByTimeAsync(50);

            // Should only be called once
            expect(callback).toHaveBeenCalledTimes(1);
          });
        });
        vi.useRealTimers();
      });

      it("cleans up timer and listener when remove is called", async () => {
        expect.assertions(1);
        vi.useFakeTimers();
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant, context }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn();

            const remove = entity.onStateFor({
              context,
              exec: callback,
              for: "0.1s",
              state: "on",
            });

            // Change state to match
            const updatePromise = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "on",
            });
            await vi.advanceTimersByTimeAsync(1);
            await updatePromise;
            await vi.advanceTimersByTimeAsync(50);

            // Remove the listener
            remove();

            // Advance time past when timer would have fired
            await vi.advanceTimersByTimeAsync(100);

            // Callback should not have been called
            expect(callback).not.toHaveBeenCalled();
          });
        });
        vi.useRealTimers();
      });

      it("handles cleanup when timer is already running", async () => {
        expect.assertions(1);
        vi.useFakeTimers();
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant, context }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn();

            const remove = entity.onStateFor({
              context,
              exec: callback,
              for: "0.1s",
              state: "on",
            });

            // Change state to match - starts timer
            const updatePromise = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "on",
            });
            await vi.advanceTimersByTimeAsync(1);
            await updatePromise;
            await vi.advanceTimersByTimeAsync(50);

            // Remove should clean up the running timer
            remove();

            // Advance time past when timer would have fired
            await vi.advanceTimersByTimeAsync(100);

            expect(callback).not.toHaveBeenCalled();
          });
        });
        vi.useRealTimers();
      });

      it("works with numeric state values", async () => {
        expect.assertions(1);
        vi.useFakeTimers();
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant, context }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn();

            entity.onStateFor({
              context,
              exec: callback,
              for: "0.1s",
              state: "42",
            });

            // Change state to match numeric value
            const updatePromise = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "42",
            });
            await vi.advanceTimersByTimeAsync(1);
            await updatePromise;
            await vi.advanceTimersByTimeAsync(100);

            expect(callback).toHaveBeenCalledTimes(1);
          });
        });
        vi.useRealTimers();
      });

      it("passes proxy to exec callback", async () => {
        expect.assertions(3);
        vi.useFakeTimers();
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant, context }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback = vi.fn(proxy => {
              expect(proxy.entity_id).toBe("sensor.magic");
              expect(proxy.state).toBe("on");
            });

            entity.onStateFor({
              context,
              exec: callback,
              for: "0.1s",
              state: "on",
            });

            const updatePromise = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "on",
            });
            await vi.advanceTimersByTimeAsync(1);
            await updatePromise;
            await vi.advanceTimersByTimeAsync(100);

            expect(callback).toHaveBeenCalledTimes(1);
          });
        });
        vi.useRealTimers();
      });

      it("handles multiple onStateFor listeners on same entity", async () => {
        expect.assertions(2);
        vi.useFakeTimers();
        await hassTestRunner.run(({ lifecycle, hass, mock_assistant, context }) => {
          lifecycle.onReady(async () => {
            const entity = hass.refBy.id("sensor.magic");
            const callback1 = vi.fn();
            const callback2 = vi.fn();

            entity.onStateFor({
              context,
              exec: callback1,
              for: "0.1s",
              state: "on",
            });

            entity.onStateFor({
              context,
              exec: callback2,
              for: ".15s",
              state: "on",
            });

            const updatePromise = mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "on",
            });
            await vi.advanceTimersByTimeAsync(1);
            await updatePromise;
            await vi.advanceTimersByTimeAsync(100);
            expect(callback1).toHaveBeenCalledTimes(1);

            await vi.advanceTimersByTimeAsync(50);
            expect(callback2).toHaveBeenCalledTimes(1);
          });
        });
        vi.useRealTimers();
      });
    });
  });
});
