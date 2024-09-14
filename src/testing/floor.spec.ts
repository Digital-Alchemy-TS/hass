import { iTestRunner, sleep, TestRunner } from "@digital-alchemy/core";

import { LIB_HASS } from "..";
import { TFloorId } from "../dynamic";
import { FLOOR_REGISTRY_UPDATED, FloorDetails, HassConfig } from "../helpers";
import { LIB_MOCK_ASSISTANT } from "../mock_assistant";

describe("Floor", () => {
  const EXAMPLE_FLOOR = {
    aliases: [],
    floor_id: "upstairs",
    icon: null,
    level: 2,
    name: "Upstairs",
  } as unknown as FloorDetails;
  let runner: iTestRunner;

  beforeEach(() => {
    runner = TestRunner({ target: LIB_HASS })
      .appendLibrary(LIB_MOCK_ASSISTANT)
      .appendService(({ hass }) => {
        jest
          .spyOn(hass.fetch, "getConfig")
          .mockImplementation(async () => ({ version: "2024.4.1" }) as HassConfig);
      })
      .configure({
        configuration: {
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
            MOCK_SOCKET: true,
          },
        },
      });
  });

  afterEach(async () => {
    await runner.teardown();
    jest.restoreAllMocks();
  });

  describe("Lifecycle", () => {
    it("should force values to be available before ready", async () => {
      expect.assertions(1);
      await runner.run(({ lifecycle, hass }) => {
        const spy = jest
          .spyOn(hass.socket, "sendMessage")
          .mockImplementation(async () => [EXAMPLE_FLOOR]);
        lifecycle.onReady(async () => {
          await hass.floor.list();
          expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({ type: "config/floor_registry/list" }),
          );
        });
      });
    });
  });

  describe("API", () => {
    describe("Formatting", () => {
      it("should call list properly", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass }) => {
          const spy = jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => []);
          lifecycle.onReady(async () => {
            await hass.floor.list();
            expect(spy).toHaveBeenCalledWith(
              expect.objectContaining({ type: "config/floor_registry/list" }),
            );
          });
        });
      });

      it("should call update properly", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass, event }) => {
          const spy = jest
            .spyOn(hass.socket, "sendMessage")
            .mockImplementation(async () => undefined);
          lifecycle.onReady(async () => {
            setImmediate(() => event.emit(FLOOR_REGISTRY_UPDATED));
            await hass.floor.update(EXAMPLE_FLOOR);

            expect(spy).toHaveBeenCalledWith({
              type: "config/floor_registry/update",
              ...EXAMPLE_FLOOR,
            });
          });
        });
      });

      it("should call delete properly", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass, event }) => {
          const spy = jest
            .spyOn(hass.socket, "sendMessage")
            .mockImplementation(async () => undefined);
          lifecycle.onReady(async () => {
            setImmediate(() => event.emit(FLOOR_REGISTRY_UPDATED));
            await hass.floor.delete(EXAMPLE_FLOOR.floor_id);

            expect(spy).toHaveBeenCalledWith({
              floor_id: "upstairs",
              type: "config/floor_registry/delete",
            });
          });
        });
      });

      it("should call create properly", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass, event }) => {
          const spy = jest
            .spyOn(hass.socket, "sendMessage")
            .mockImplementation(async () => undefined);
          lifecycle.onReady(async () => {
            setImmediate(() => event.emit(FLOOR_REGISTRY_UPDATED));
            await hass.floor.create(EXAMPLE_FLOOR);

            expect(spy).toHaveBeenCalledWith({
              type: "config/floor_registry/create",
              ...EXAMPLE_FLOOR,
            });
          });
        });
      });
    });

    describe("Order of operations", () => {
      it("should wait for an update before returning when updating", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass, event }) => {
          jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
          lifecycle.onReady(async () => {
            const response = hass.floor.update(EXAMPLE_FLOOR);
            let order = "";
            setTimeout(() => {
              order += "a";
              event.emit(FLOOR_REGISTRY_UPDATED);
            }, 5);
            await response;
            order += "b";
            expect(order).toEqual("ab");
          });
        });
      });

      it("should debounce updates properly", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass }) => {
          jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
          let counter = 0;
          hass.events.onFloorRegistryUpdate(() => counter++);
          lifecycle.onReady(async () => {
            setImmediate(async () => {
              hass.socket.socketEvents.emit("floor_registry_updated");
              await sleep(5);
              hass.socket.socketEvents.emit("floor_registry_updated");
              await sleep(5);
              hass.socket.socketEvents.emit("floor_registry_updated");
              await sleep(75);
              hass.socket.socketEvents.emit("floor_registry_updated");
            });
            await sleep(200);
            expect(counter).toBe(2);
          });
        });
      });

      it("should wait for an update before returning when deleting", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass, event }) => {
          jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
          lifecycle.onReady(async () => {
            const response = hass.floor.delete("example_floor" as TFloorId);
            let order = "";
            setTimeout(() => {
              order += "a";
              event.emit(FLOOR_REGISTRY_UPDATED);
            }, 5);
            await response;
            order += "b";
            expect(order).toEqual("ab");
          });
        });
      });

      it("should wait for an update before returning when creating", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass, event }) => {
          jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
          lifecycle.onReady(async () => {
            const response = hass.floor.create(EXAMPLE_FLOOR);
            let order = "";
            setTimeout(() => {
              order += "a";
              event.emit(FLOOR_REGISTRY_UPDATED);
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
