import { iTestRunner, sleep, TestRunner } from "@digital-alchemy/core";

import { LIB_HASS } from "..";
import { TAreaId } from "../dynamic";
import { AREA_REGISTRY_UPDATED, AreaDetails, HassConfig } from "../helpers";
import { LIB_MOCK_ASSISTANT } from "../mock_assistant";

describe("Area", () => {
  const EXAMPLE_AREA = {
    area_id: "empty_area" as TAreaId,
    floor_id: null,
    icon: null,
    labels: [],
    name: "Empty Area",
    picture: null,
  } as AreaDetails;
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
          .mockImplementation(async () => [EXAMPLE_AREA]);
        lifecycle.onReady(async () => {
          await hass.area.list();
          expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({ type: "config/area_registry/list" }),
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
            await hass.area.list();
            expect(spy).toHaveBeenCalledWith(
              expect.objectContaining({ type: "config/area_registry/list" }),
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
        await runner.run(({ lifecycle, hass }) => {
          jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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

      it("should call delete properly", async () => {
        expect.assertions(1);

        await runner.run(({ lifecycle, hass, event }) => {
          const spy = jest
            .spyOn(hass.socket, "sendMessage")
            .mockImplementation(async () => undefined);
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
        await runner.run(({ lifecycle, hass, event }) => {
          const spy = jest
            .spyOn(hass.socket, "sendMessage")
            .mockImplementation(async () => undefined);
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
        await runner.run(({ lifecycle, hass, event }) => {
          jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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
        await runner.run(({ lifecycle, hass, event }) => {
          jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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
        await runner.run(({ lifecycle, hass, event }) => {
          jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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
});
