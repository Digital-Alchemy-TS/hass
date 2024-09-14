import { LibraryTestRunner, TestRunner } from "@digital-alchemy/core";

import { LIB_HASS } from "..";
import {
  AREA_REGISTRY_UPDATED,
  DEVICE_REGISTRY_UPDATED,
  ENTITY_REGISTRY_UPDATED,
  FLOOR_REGISTRY_UPDATED,
  HassConfig,
  LABEL_REGISTRY_UPDATED,
  ZONE_REGISTRY_UPDATED,
} from "../helpers";
import { LIB_MOCK_ASSISTANT } from "../mock_assistant";

describe("Events", () => {
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

  describe("Event Callbacks", () => {
    it("should register callback for AREA_REGISTRY_UPDATED", async () => {
      expect.assertions(1);
      await runner.run(({ event, hass }) => {
        const spy = jest.spyOn(event, "on");
        const callback = jest.fn();
        hass.events.onAreaRegistryUpdate(callback);
        expect(spy).toHaveBeenCalledWith(AREA_REGISTRY_UPDATED, callback);
      });
    });

    it("should register callback for DEVICE_REGISTRY_UPDATED", async () => {
      expect.assertions(1);
      await runner.run(({ event, hass }) => {
        const spy = jest.spyOn(event, "on");
        const callback = jest.fn();
        hass.events.onDeviceRegistryUpdate(callback);
        expect(spy).toHaveBeenCalledWith(DEVICE_REGISTRY_UPDATED, callback);
      });
    });

    it("should register callback for ENTITY_REGISTRY_UPDATED", async () => {
      expect.assertions(1);
      await runner.run(({ event, hass }) => {
        const spy = jest.spyOn(event, "on");
        const callback = jest.fn();
        hass.events.onEntityRegistryUpdate(callback);
        expect(spy).toHaveBeenCalledWith(ENTITY_REGISTRY_UPDATED, callback);
      });
    });

    it("should register callback for FLOOR_REGISTRY_UPDATED", async () => {
      expect.assertions(1);
      await runner.run(({ event, hass }) => {
        const spy = jest.spyOn(event, "on");
        const callback = jest.fn();
        hass.events.onFloorRegistryUpdate(callback);
        expect(spy).toHaveBeenCalledWith(FLOOR_REGISTRY_UPDATED, callback);
      });
    });

    it("should register callback for LABEL_REGISTRY_UPDATED", async () => {
      expect.assertions(1);
      await runner.run(({ event, hass }) => {
        const spy = jest.spyOn(event, "on");
        const callback = jest.fn();
        hass.events.onLabelRegistryUpdate(callback);
        expect(spy).toHaveBeenCalledWith(LABEL_REGISTRY_UPDATED, callback);
      });
    });

    it("should register callback for ZONE_REGISTRY_UPDATED", async () => {
      expect.assertions(1);
      await runner.run(({ event, hass }) => {
        const spy = jest.spyOn(event, "on");
        const callback = jest.fn();
        hass.events.onZoneRegistryUpdate(callback);
        expect(spy).toHaveBeenCalledWith(ZONE_REGISTRY_UPDATED, callback);
      });
    });
  });
});
