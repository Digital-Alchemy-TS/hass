import { TServiceParams } from "@digital-alchemy/core";

import {
  AREA_REGISTRY_UPDATED,
  DEVICE_REGISTRY_UPDATED,
  ENTITY_REGISTRY_UPDATED,
  FLOOR_REGISTRY_UPDATED,
  HassEventsService,
  LABEL_REGISTRY_UPDATED,
  SimpleCallback,
  ZONE_REGISTRY_UPDATED,
} from "../helpers";

export function Events({ event }: TServiceParams): HassEventsService {
  return {
    onAreaRegistryUpdate: (callback: SimpleCallback) => event.on(AREA_REGISTRY_UPDATED, callback),
    onDeviceRegistryUpdate: (callback: SimpleCallback) =>
      event.on(DEVICE_REGISTRY_UPDATED, callback),
    onEntityRegistryUpdate: (callback: SimpleCallback) =>
      event.on(ENTITY_REGISTRY_UPDATED, callback),
    onFloorRegistryUpdate: (callback: SimpleCallback) => event.on(FLOOR_REGISTRY_UPDATED, callback),
    onLabelRegistryUpdate: (callback: SimpleCallback) => event.on(LABEL_REGISTRY_UPDATED, callback),
    onZoneRegistryUpdate: (callback: SimpleCallback) => event.on(ZONE_REGISTRY_UPDATED, callback),
  };
}
