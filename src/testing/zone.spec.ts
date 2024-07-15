import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  sleep,
  TServiceParams,
} from "@digital-alchemy/core";

import { ZONE_REGISTRY_UPDATED, ZoneDetails } from "../helpers";
import { CreateTestingApplication, SILENT_BOOT } from "../mock_assistant";

describe("Zone", () => {
  let application: ApplicationDefinition<
    ServiceMap,
    OptionalModuleConfiguration
  >;
  const EXAMPLE_ZONE = {
    icon: "",
    latitude: 0,
    longitude: 0,
    name: "Test",
    passive: true,
  } as ZoneDetails;

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
            .mockImplementation(async () => [EXAMPLE_ZONE]);
          lifecycle.onReady(async () => {
            await hass.zone.list();
            expect(spy).toHaveBeenCalledWith(
              expect.objectContaining({ type: "zone/list" }),
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
              await hass.zone.list();
              expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ type: "zone/list" }),
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

      it("should call create properly", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass, event }: TServiceParams) {
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
      it("should throttle updates properly", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass }: TServiceParams) {
            jest
              .spyOn(hass.socket, "sendMessage")
              .mockImplementation(async () => undefined);
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
