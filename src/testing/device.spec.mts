import { subscribe } from "node:diagnostics_channel";

import { sleep } from "@digital-alchemy/core";

import { DeviceDetails } from "../helpers/index.mts";
import { hassTestRunner } from "../mock_assistant/index.mts";

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

  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  describe("Lifecycle", () => {
    it("should force values to be available before ready", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi
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
    await hassTestRunner.run(({ lifecycle, hass }) => {
      vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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
        await hassTestRunner.run(({ lifecycle, hass }) => {
          const spy = vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => []);
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

  it("should publish diagnostics on device registry update", async () => {
    expect.assertions(1);
    hassTestRunner.configure({ hass: { EMIT_DIAGNOSTICS: true } });
    await hassTestRunner.run(({ lifecycle, hass }) => {
      vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
      const spy = vi.fn();
      subscribe(hass.diagnostics.device.registry_update.name, spy);
      lifecycle.onReady(async () => {
        setImmediate(async () => {
          hass.socket.socketEvents.emit("device_registry_updated");
        });
        await sleep(100);
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({ ms: expect.any(Number) }),
          hass.diagnostics.device.registry_update.name,
        );
      });
    });
  });
});
