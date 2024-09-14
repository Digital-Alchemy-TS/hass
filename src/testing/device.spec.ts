import { LibraryTestRunner, sleep, TestRunner } from "@digital-alchemy/core";

import { LIB_HASS } from "..";
import { DeviceDetails, HassConfig } from "../helpers";
import { LIB_MOCK_ASSISTANT } from "../mock_assistant";

describe("Device", () => {
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
  let runner: LibraryTestRunner<typeof LIB_HASS>;

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
          .mockImplementation(async () => [EXAMPLE_DEVICE]);
        lifecycle.onReady(async () => {
          await hass.device.list();
          expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({ type: "config/device_registry/list" }),
          );
        });
      });
    });
  });

  it("should debounce updates properly", async () => {
    expect.assertions(1);
    await runner.run(({ lifecycle, hass }) => {
      jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
      let counter = 0;
      hass.events.onDeviceRegistryUpdate(() => counter++);
      lifecycle.onReady(async () => {
        setImmediate(async () => {
          hass.socket.socketEvents.emit("device_registry_updated");
          await sleep(5);
          hass.socket.socketEvents.emit("device_registry_updated");
          await sleep(5);
          hass.socket.socketEvents.emit("device_registry_updated");
          await sleep(75);
          hass.socket.socketEvents.emit("device_registry_updated");
        });
        await sleep(200);
        expect(counter).toBe(2);
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
            await hass.device.list();
            expect(spy).toHaveBeenCalledWith(
              expect.objectContaining({
                type: "config/device_registry/list",
              }),
            );
          });
        });
      });
    });
  });
});
