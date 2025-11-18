import { sleep } from "@digital-alchemy/core";
import { subscribe } from "diagnostics_channel";

import type { AreaDetails } from "../helpers/index.mts";
import { AREA_REGISTRY_UPDATED, ENTITY_REGISTRY_UPDATED } from "../helpers/index.mts";
import { hassTestRunner, INTERNAL_MESSAGE } from "../mock_assistant/index.mts";
import type { ANY_ENTITY, TAreaId } from "../user.mts";

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

  describe("apply", () => {
    it("should apply area to a single entity", async () => {
      expect.assertions(2);
      await hassTestRunner.run(({ lifecycle, hass, event }) => {
        const spy = vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
        lifecycle.onReady(async () => {
          const entity = "sensor.magic" as ANY_ENTITY;
          const area = "living_room" as TAreaId;
          const response = hass.area.apply(area, [entity]);
          setImmediate(() => event.emit(ENTITY_REGISTRY_UPDATED));
          const result = await response;

          expect(spy).toHaveBeenCalledWith({
            area_id: area,
            entity_id: entity,
            type: "config/entity_registry/update",
          });
          expect(result.updated).toEqual([entity]);
        });
      });
    });

    it("should apply area to multiple entities", async () => {
      expect.assertions(3);
      await hassTestRunner.run(({ lifecycle, hass, event }) => {
        lifecycle.onReady(async () => {
          const updateCalls: Array<{ area_id: TAreaId; entity_id: ANY_ENTITY; type: string }> = [];
          vi.spyOn(hass.socket, "sendMessage").mockImplementation(async message => {
            if (message?.type === "config/entity_registry/update") {
              updateCalls.push(
                message as { area_id: TAreaId; entity_id: ANY_ENTITY; type: string },
              );
              // Emit event asynchronously to ensure listener is registered
              setImmediate(() => event.emit(ENTITY_REGISTRY_UPDATED));
            }
            return undefined;
          });

          const entities = ["sensor.magic", "light.kitchen_lamp"] as ANY_ENTITY[];
          const area = "living_room" as TAreaId;
          const result = await hass.area.apply(area, entities);

          expect(updateCalls).toHaveLength(2);
          expect(updateCalls).toEqual([
            {
              area_id: area,
              entity_id: entities[0],
              type: "config/entity_registry/update",
            },
            {
              area_id: area,
              entity_id: entities[1],
              type: "config/entity_registry/update",
            },
          ]);
          expect(result.updated).toEqual(entities);
        });
      });
    });

    it("should skip entities that already have the correct area", async () => {
      expect.assertions(2);
      await hassTestRunner.run(({ lifecycle, hass, event }) => {
        lifecycle.onReady(async () => {
          const spy = vi
            .spyOn(hass.socket, "sendMessage")
            .mockImplementation(async () => undefined);
          // Find an entity that already has an area assigned
          const entityWithArea = hass.entity.registry.current.find(item => item.area_id !== null);
          if (!entityWithArea) {
            throw new Error("No entity with area found in fixtures");
          }

          const entity = entityWithArea.entity_id as ANY_ENTITY;
          const area = entityWithArea.area_id as TAreaId;
          const result = await hass.area.apply(area, [entity]);

          const updateCalls = spy.mock.calls.filter(
            call => call[0]?.type === "config/entity_registry/update",
          );
          expect(updateCalls).toHaveLength(0);
          expect(result.updated).toEqual([]);
        });
      });
    });

    it("should throw error for unknown entity", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          const unknownEntity = "sensor.unknown_entity" as ANY_ENTITY;
          const area = "living_room" as TAreaId;

          try {
            await hass.area.apply(area, [unknownEntity]);
          } catch (error) {
            // InternalError structure: check various possible properties
            const err = error as Record<string, unknown>;
            const errorString = String(error);
            const hasCode = err.code === "UNKNOWN_ENTITY";
            const hasName = err.name === "UNKNOWN_ENTITY";
            const hasMessage = String(err.message || "").includes("UNKNOWN_ENTITY");
            const hasString = errorString.includes("UNKNOWN_ENTITY");
            expect(hasCode || hasName || hasMessage || hasString).toBe(true);
          }
        });
      });
    });

    it("should wait for ENTITY_REGISTRY_UPDATED before continuing", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass, event }) => {
        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
        lifecycle.onReady(async () => {
          const entity = "sensor.magic" as ANY_ENTITY;
          const area = "living_room" as TAreaId;
          const response = hass.area.apply(area, [entity]);
          let order = "";
          setTimeout(() => {
            order += "a";
            event.emit(ENTITY_REGISTRY_UPDATED);
          }, 5);
          await response;
          order += "b";
          expect(order).toEqual("ab");
        });
      });
    });

    it("should return only updated entities when some are skipped", async () => {
      expect.assertions(2);
      await hassTestRunner.run(({ lifecycle, hass, event }) => {
        lifecycle.onReady(async () => {
          const spy = vi.spyOn(hass.socket, "sendMessage").mockImplementation(async message => {
            if (message?.type === "config/entity_registry/update") {
              setImmediate(() => event.emit(ENTITY_REGISTRY_UPDATED));
            }
            return undefined;
          });

          // Find an entity that already has "kitchen" area so it will be skipped
          const entityWithArea = hass.entity.registry.current.find(
            item => item.area_id === "kitchen",
          );
          if (!entityWithArea) {
            throw new Error("No entity with kitchen area found in fixtures");
          }

          const existingEntity = entityWithArea.entity_id as ANY_ENTITY;
          const newEntity = "sensor.magic" as ANY_ENTITY;
          const newArea = "kitchen" as TAreaId;

          const result = await hass.area.apply(newArea, [existingEntity, newEntity]);

          const updateCalls = spy.mock.calls.filter(
            call => call[0]?.type === "config/entity_registry/update",
          );
          expect(updateCalls).toHaveLength(1);
          expect(result.updated).toEqual([newEntity]);
        });
      });
    });
  });
});
