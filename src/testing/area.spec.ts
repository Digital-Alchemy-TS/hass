import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  TServiceParams,
} from "@digital-alchemy/core";

import { AREA_REGISTRY_UPDATED, AreaDetails } from "../helpers";
import {
  CreateTestingApplication,
  SILENT_BOOT,
} from "../mock_assistant/helpers/utils";

describe("Area", () => {
  let application: ApplicationDefinition<
    ServiceMap,
    OptionalModuleConfiguration
  >;
  const EXAMPLE_AREA = {
    area_id: "empty_area",
    floor_id: null,
    icon: null,
    labels: [],
    name: "Empty Area",
    picture: null,
  } as AreaDetails;

  afterEach(async () => {
    if (application) {
      await application.teardown();
      application = undefined;
    }
    jest.restoreAllMocks();
  });

  describe("Lifecycle", () => {
    it("should force values to be available before ready", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(hass.socket, "sendMessage")
            .mockImplementation(async () => [EXAMPLE_AREA]);
          lifecycle.onReady(async () => {
            await hass.area.list();
            expect(spy).toHaveBeenCalledWith(
              expect.objectContaining({ type: "config/area_registry/list" }),
            );
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
          },
        }),
      );
    });
  });

  describe("API", () => {
    describe("Formatting", () => {
      it("should call list properly", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass }: TServiceParams) {
            const spy = jest
              .spyOn(hass.socket, "sendMessage")
              .mockImplementation(async () => []);
            lifecycle.onReady(async () => {
              await hass.area.list();
              expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ type: "config/area_registry/list" }),
              );
            });
          },
        });
        await application.bootstrap(
          SILENT_BOOT({
            hass: {
              AUTO_CONNECT_SOCKET: false,
              AUTO_SCAN_CALL_PROXY: false,
            },
          }),
        );
      });

      it("should call update properly", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass, event }: TServiceParams) {
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
          },
        });
        await application.bootstrap(
          SILENT_BOOT({
            hass: {
              AUTO_CONNECT_SOCKET: false,
              AUTO_SCAN_CALL_PROXY: false,
            },
          }),
        );
      });

      it("should call delete properly", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass, event }: TServiceParams) {
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
          },
        });
        await application.bootstrap(
          SILENT_BOOT({
            hass: {
              AUTO_CONNECT_SOCKET: false,
              AUTO_SCAN_CALL_PROXY: false,
            },
          }),
        );
      });

      it("should call create properly", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass, event }: TServiceParams) {
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
          },
        });
        await application.bootstrap(
          SILENT_BOOT({
            hass: {
              AUTO_CONNECT_SOCKET: false,
              AUTO_SCAN_CALL_PROXY: false,
            },
          }),
        );
      });
    });

    describe("Order of operations", () => {
      it("should wait for an update before returning when updating", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass, event }: TServiceParams) {
            jest
              .spyOn(hass.socket, "sendMessage")
              .mockImplementation(async () => undefined);
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
          },
        });
        await application.bootstrap(
          SILENT_BOOT({
            hass: {
              AUTO_CONNECT_SOCKET: false,
              AUTO_SCAN_CALL_PROXY: false,
            },
          }),
        );
      });

      it("should wait for an update before returning when deleting", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass, event }: TServiceParams) {
            jest
              .spyOn(hass.socket, "sendMessage")
              .mockImplementation(async () => undefined);
            lifecycle.onReady(async () => {
              const response = hass.area.delete("example_area");
              let order = "";
              setTimeout(() => {
                order += "a";
                event.emit(AREA_REGISTRY_UPDATED);
              }, 5);
              await response;
              order += "b";
              expect(order).toEqual("ab");
            });
          },
        });
        await application.bootstrap(
          SILENT_BOOT({
            hass: {
              AUTO_CONNECT_SOCKET: false,
              AUTO_SCAN_CALL_PROXY: false,
            },
          }),
        );
      });

      it("should wait for an update before returning when creating", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass, event }: TServiceParams) {
            jest
              .spyOn(hass.socket, "sendMessage")
              .mockImplementation(async () => undefined);
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
          },
        });
        await application.bootstrap(
          SILENT_BOOT({
            hass: {
              AUTO_CONNECT_SOCKET: false,
              AUTO_SCAN_CALL_PROXY: false,
            },
          }),
        );
      });
    });
  });
});
