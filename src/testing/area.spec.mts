import { sleep } from "@digital-alchemy/core";
import { subscribe } from "diagnostics_channel";

import type { AreaDetails } from "../helpers/index.mts";
import { AREA_REGISTRY_UPDATED } from "../helpers/index.mts";
import { hassTestRunner, INTERNAL_MESSAGE } from "../mock_assistant/index.mts";
import type { TAreaId } from "../user.mts";

const EXAMPLE_AREA = {
  area_id: "empty_area" as TAreaId,
  floor_id: null,
  icon: null,
  labels: [],
  name: "Empty Area",
  picture: null,
} as AreaDetails;

afterEach(async () => {
  await hassTestRunner.teardown();
  vi.restoreAllMocks();
});

describe("Lifecycle", () => {
  it("should force values to be available before ready", async () => {
    expect.assertions(1);

    const app = await hassTestRunner.run(({ mock_assistant, lifecycle, hass }) => {
      const spy = vi.fn();
      mock_assistant.socket.connection.on(INTERNAL_MESSAGE, spy);
      lifecycle.onReady(async () => {
        await hass.area.list();
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({ type: "config/area_registry/list" }),
        );
      }, -1);
    });
    await app.teardown();
  });
});

describe("API", () => {
  describe("Formatting", () => {
    it("should call list properly", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => []);
        lifecycle.onReady(async () => {
          await hass.area.list();
          expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({ type: "config/area_registry/list" }),
          );
        });
      });
    });

    it("should call update properly", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass, event }) => {
        const spy = vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
        lifecycle.onReady(async () => {
          setImmediate(() => event.emit(AREA_REGISTRY_UPDATED));
          await hass.area.update(EXAMPLE_AREA);

          expect(spy).toHaveBeenCalledWith({
            type: "config/area_registry/update",
            ...EXAMPLE_AREA,
          });
        });
      });
    });

    it("should debounce updates properly", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
        let counter = 0;
        hass.events.onAreaRegistryUpdate(() => counter++);
        lifecycle.onReady(async () => {
          setImmediate(async () => {
            hass.socket.socketEvents.emit("area_registry_updated");
            await sleep(5);
            hass.socket.socketEvents.emit("area_registry_updated");
            await sleep(5);
            hass.socket.socketEvents.emit("area_registry_updated");
            await sleep(75);
            hass.socket.socketEvents.emit("area_registry_updated");
          });
          await sleep(200);
          expect(counter).toBe(2);
        });
      });
    });

    it("should publish diagnostics on area registry update", async () => {
      expect.assertions(1);
      hassTestRunner.configure({ hass: { EMIT_DIAGNOSTICS: true } });
      await hassTestRunner.run(({ lifecycle, hass }) => {
        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
        const spy = vi.fn();
        subscribe(hass.diagnostics.area.registry_update.name, spy);
        lifecycle.onReady(async () => {
          setImmediate(async () => {
            hass.socket.socketEvents.emit("area_registry_updated");
          });
          await sleep(100);
          expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({ ms: expect.any(Number) }),
            hass.diagnostics.area.registry_update.name,
          );
        });
      });
    });

    it("should call delete properly", async () => {
      expect.assertions(1);

      await hassTestRunner.run(({ lifecycle, hass, event }) => {
        const spy = vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
        lifecycle.onReady(async () => {
          setImmediate(() => event.emit(AREA_REGISTRY_UPDATED));
          await hass.area.delete(EXAMPLE_AREA.area_id);

          expect(spy).toHaveBeenCalledWith({
            area_id: "empty_area",
            type: "config/area_registry/delete",
          });
        });
      });
    });

    it("should call create properly", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass, event }) => {
        const spy = vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
        lifecycle.onReady(async () => {
          setImmediate(() => event.emit(AREA_REGISTRY_UPDATED));
          await hass.area.create(EXAMPLE_AREA);

          expect(spy).toHaveBeenCalledWith({
            type: "config/area_registry/create",
            ...EXAMPLE_AREA,
          });
        });
      });
    });
  });

  describe("Order of operations", () => {
    it("should wait for an update before returning when updating", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass, event }) => {
        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
        lifecycle.onReady(async () => {
          const response = hass.area.update(EXAMPLE_AREA);
          let order = "";
          setTimeout(() => {
            order += "a";
            event.emit(AREA_REGISTRY_UPDATED);
          }, 5);
          await response;
          order += "b";
          expect(order).toEqual("ab");
        });
      });
    });

    it("should wait for an update before returning when deleting", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass, event }) => {
        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
        lifecycle.onReady(async () => {
          const response = hass.area.delete("example_area" as TAreaId);
          let order = "";
          setTimeout(() => {
            order += "a";
            event.emit(AREA_REGISTRY_UPDATED);
          }, 5);
          await response;
          order += "b";
          expect(order).toEqual("ab");
        });
      });
    });

    it("should wait for an update before returning when creating", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass, event }) => {
        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
        lifecycle.onReady(async () => {
          const response = hass.area.create(EXAMPLE_AREA);
          let order = "";
          setTimeout(() => {
            order += "a";
            event.emit(AREA_REGISTRY_UPDATED);
          }, 5);
          await response;
          order += "b";
          expect(order).toEqual("ab");
        });
      });
    });
  });
});
