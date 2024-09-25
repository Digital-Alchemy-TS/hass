import { sleep } from "@digital-alchemy/core";

import { ZONE_REGISTRY_UPDATED, ZoneDetails } from "../helpers";
import { hassTestRunner } from "../mock_assistant";

describe("Zone", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    jest.restoreAllMocks();
  });

  const EXAMPLE_ZONE = {
    icon: "",
    latitude: 0,
    longitude: 0,
    name: "Test",
    passive: true,
  } as ZoneDetails;

  describe("Lifecycle", () => {
    it("should force values to be available before ready", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = jest
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
          const spy = jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => []);
          lifecycle.onReady(async () => {
            await hass.zone.list();
            expect(spy).toHaveBeenCalledWith(expect.objectContaining({ type: "zone/list" }));
          });
        });
      });

      it("should call create properly", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass, event }) => {
          const spy = jest
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
    });

    describe("Order of operations", () => {
      it("should debounce updates properly", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass }) => {
          jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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
          jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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
