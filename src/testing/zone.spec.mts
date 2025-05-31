import { subscribe } from "node:diagnostics_channel";

import { sleep } from "@digital-alchemy/core";

import { ZONE_REGISTRY_UPDATED, ZoneDetails } from "../helpers/index.mts";
import { hassTestRunner } from "../mock_assistant/index.mts";

describe("Zone", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  const EXAMPLE_ZONE = {
    icon: "mdi:map-marker",
    id: "test",
    latitude: 37.7749,
    longitude: -122.4194,
    name: "Example Zone",
    passive: false,
    radius: 100,
  } as ZoneDetails;

  describe("Lifecycle", () => {
    it("should force values to be available before ready", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi
          .spyOn(hass.socket, "sendMessage")
          .mockImplementation(async () => [EXAMPLE_ZONE]);
        lifecycle.onReady(async () => {
          await hass.zone.list();
          expect(spy).toHaveBeenCalledWith(expect.objectContaining({ type: "zone/list" }));
        });
      });
    });
  });

  describe("API", () => {
    describe("Formatting", () => {
      it("should call list properly", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          const spy = vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => []);
          lifecycle.onReady(async () => {
            await hass.zone.list();
            expect(spy).toHaveBeenCalledWith(expect.objectContaining({ type: "zone/list" }));
          });
        });
      });

      it("should call create properly", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass, event }) => {
          const spy = vi
            .spyOn(hass.socket, "sendMessage")
            .mockImplementation(async () => undefined);
          lifecycle.onReady(async () => {
            setImmediate(() => event.emit(ZONE_REGISTRY_UPDATED));
            await hass.zone.create(EXAMPLE_ZONE);

            expect(spy).toHaveBeenCalledWith({
              type: "zone/create",
              ...EXAMPLE_ZONE,
            });
          });
        });
      });

      it("should publish diagnostics on zone registry update", async () => {
        expect.assertions(1);
        hassTestRunner.configure({ hass: { EMIT_DIAGNOSTICS: true } });
        await hassTestRunner.run(({ lifecycle, hass }) => {
          vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
          const spy = vi.fn();
          subscribe(hass.diagnostics.zone.registry_update.name, spy);
          lifecycle.onReady(async () => {
            setImmediate(async () => {
              hass.socket.socketEvents.emit("zone_registry_updated");
            });
            await sleep(100);
            expect(spy).toHaveBeenCalledWith(
              expect.objectContaining({ ms: expect.any(Number) }),
              hass.diagnostics.zone.registry_update.name,
            );
          });
        });
      });
    });

    describe("Order of operations", () => {
      it("should debounce updates properly", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
          let counter = 0;
          hass.events.onZoneRegistryUpdate(() => counter++);
          lifecycle.onReady(async () => {
            setImmediate(async () => {
              hass.socket.socketEvents.emit("zone_registry_updated");
              await sleep(5);
              hass.socket.socketEvents.emit("zone_registry_updated");
              await sleep(5);
              hass.socket.socketEvents.emit("zone_registry_updated");
              await sleep(75);
              hass.socket.socketEvents.emit("zone_registry_updated");
            });
            await sleep(200);
            expect(counter).toBe(2);
          });
        });
      });

      it("should wait for an update before returning when creating", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass, event }) => {
          vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
          lifecycle.onReady(async () => {
            const response = hass.zone.create(EXAMPLE_ZONE);
            let order = "";
            setTimeout(() => {
              order += "a";
              event.emit(ZONE_REGISTRY_UPDATED);
            }, 5);
            await response;
            order += "b";
            expect(order).toEqual("ab");
          });
        });
      });
    });
  });
});
