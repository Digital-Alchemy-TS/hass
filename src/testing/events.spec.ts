import {
  AREA_REGISTRY_UPDATED,
  DEVICE_REGISTRY_UPDATED,
  ENTITY_REGISTRY_UPDATED,
  FLOOR_REGISTRY_UPDATED,
  LABEL_REGISTRY_UPDATED,
  ZONE_REGISTRY_UPDATED,
} from "../helpers";
import { hassTestRunner } from "../mock_assistant";

describe("Events", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    jest.restoreAllMocks();
  });

  describe("Event Callbacks", () => {
    it("should register callback for AREA_REGISTRY_UPDATED", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ event, hass }) => {
        const spy = jest.spyOn(event, "on");
        const callback = jest.fn();
        hass.events.onAreaRegistryUpdate(callback);
        expect(spy).toHaveBeenCalledWith(AREA_REGISTRY_UPDATED, callback);
      });
    });

    it("should register callback for DEVICE_REGISTRY_UPDATED", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ event, hass }) => {
        const spy = jest.spyOn(event, "on");
        const callback = jest.fn();
        hass.events.onDeviceRegistryUpdate(callback);
        expect(spy).toHaveBeenCalledWith(DEVICE_REGISTRY_UPDATED, callback);
      });
    });

    it("should register callback for ENTITY_REGISTRY_UPDATED", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ event, hass }) => {
        const spy = jest.spyOn(event, "on");
        const callback = jest.fn();
        hass.events.onEntityRegistryUpdate(callback);
        expect(spy).toHaveBeenCalledWith(ENTITY_REGISTRY_UPDATED, callback);
      });
    });

    it("should register callback for FLOOR_REGISTRY_UPDATED", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ event, hass }) => {
        const spy = jest.spyOn(event, "on");
        const callback = jest.fn();
        hass.events.onFloorRegistryUpdate(callback);
        expect(spy).toHaveBeenCalledWith(FLOOR_REGISTRY_UPDATED, callback);
      });
    });

    it("should register callback for LABEL_REGISTRY_UPDATED", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ event, hass }) => {
        const spy = jest.spyOn(event, "on");
        const callback = jest.fn();
        hass.events.onLabelRegistryUpdate(callback);
        expect(spy).toHaveBeenCalledWith(LABEL_REGISTRY_UPDATED, callback);
      });
    });

    it("should register callback for ZONE_REGISTRY_UPDATED", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ event, hass }) => {
        const spy = jest.spyOn(event, "on");
        const callback = jest.fn();
        hass.events.onZoneRegistryUpdate(callback);
        expect(spy).toHaveBeenCalledWith(ZONE_REGISTRY_UPDATED, callback);
      });
    });
  });
});
