import type { TServiceParams } from "@digital-alchemy/core";

import type { HassEventsService, SimpleCallback } from "../helpers/index.mts";
import {
  AREA_REGISTRY_UPDATED,
  DEVICE_REGISTRY_UPDATED,
  ENTITY_REGISTRY_UPDATED,
  FLOOR_REGISTRY_UPDATED,
  LABEL_REGISTRY_UPDATED,
  ZONE_REGISTRY_UPDATED,
} from "../helpers/index.mts";

export function EventsService({ event, internal }: TServiceParams): HassEventsService {
  return {
    onAreaRegistryUpdate: (callback: SimpleCallback) => {
      event.on(AREA_REGISTRY_UPDATED, callback);
      return internal.removeFn(() => event.removeListener(AREA_REGISTRY_UPDATED, callback));
    },
    onDeviceRegistryUpdate: (callback: SimpleCallback) => {
      event.on(DEVICE_REGISTRY_UPDATED, callback);
      return internal.removeFn(() => event.removeListener(DEVICE_REGISTRY_UPDATED, callback));
    },
    onEntityRegistryUpdate: (callback: SimpleCallback) => {
      event.on(ENTITY_REGISTRY_UPDATED, callback);
      return internal.removeFn(() => event.removeListener(ENTITY_REGISTRY_UPDATED, callback));
    },
    onFloorRegistryUpdate: (callback: SimpleCallback) => {
      event.on(FLOOR_REGISTRY_UPDATED, callback);
      return internal.removeFn(() => event.removeListener(FLOOR_REGISTRY_UPDATED, callback));
    },
    onLabelRegistryUpdate: (callback: SimpleCallback) => {
      event.on(LABEL_REGISTRY_UPDATED, callback);
      return internal.removeFn(() => event.removeListener(LABEL_REGISTRY_UPDATED, callback));
    },
    onZoneRegistryUpdate: (callback: SimpleCallback) => {
      event.on(ZONE_REGISTRY_UPDATED, callback);
      return internal.removeFn(() => event.removeListener(ZONE_REGISTRY_UPDATED, callback));
    },
  };
}
