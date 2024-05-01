import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  TServiceParams,
} from "@digital-alchemy/core";

import { DeviceDetails } from "../helpers";
import {
  CreateTestingApplication,
  SILENT_BOOT,
} from "../mock_assistant/helpers/utils";

describe("Device", () => {
  let application: ApplicationDefinition<
    ServiceMap,
    OptionalModuleConfiguration
  >;
  const EXAMPLE_DEVICE = {
    area_id: null,
    config_entries: ["42816b768aa8697c18c1b6d241112cef"],
    configuration_url: null,
    connections: [],
    disabled_by: null,
    entry_type: "service",
    hw_version: null,
    id: "e328cb3f7ec4e37b3b102374b05c37a9",
    identifiers: [["hassio", "core"]],
    labels: [],
    manufacturer: "Home Assistant",
    model: "Home Assistant Core",
    name: "Home Assistant Core",
    name_by_user: null,
    serial_number: null,
    sw_version: "2024.4.3",
    via_device_id: null,
  } as unknown as DeviceDetails;

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
            .mockImplementation(async () => [EXAMPLE_DEVICE]);
          lifecycle.onReady(async () => {
            await hass.device.list();
            expect(spy).toHaveBeenCalledWith(
              expect.objectContaining({ type: "config/device_registry/list" }),
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
              await hass.device.list();
              expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                  type: "config/device_registry/list",
                }),
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
  });
});
