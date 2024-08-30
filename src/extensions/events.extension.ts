import { TBlackHole, TServiceParams } from "@digital-alchemy/core";

import {
  AREA_REGISTRY_UPDATED,
  DEVICE_REGISTRY_UPDATED,
  ENTITY_REGISTRY_UPDATED,
  FLOOR_REGISTRY_UPDATED,
  LABEL_REGISTRY_UPDATED,
  ZONE_REGISTRY_UPDATED,
} from "../helpers";

type SimpleCallback = () => TBlackHole;

const ANY_REGISTRY = [
  AREA_REGISTRY_UPDATED,
  DEVICE_REGISTRY_UPDATED,
  ENTITY_REGISTRY_UPDATED,
  FLOOR_REGISTRY_UPDATED,
  LABEL_REGISTRY_UPDATED,
  ZONE_REGISTRY_UPDATED,
];

export function Events({ event }: TServiceParams) {
  return {
    onAreaRegistryUpdate: (callback: SimpleCallback) =>
      event.on(AREA_REGISTRY_UPDATED, callback),
    onDeviceRegistryUpdate: (callback: SimpleCallback) =>
      event.on(DEVICE_REGISTRY_UPDATED, callback),
    onEntityRegistryUpdate: (callback: SimpleCallback) =>
      event.on(ENTITY_REGISTRY_UPDATED, callback),
    onFloorRegistryUpdate: (callback: SimpleCallback) =>
      event.on(FLOOR_REGISTRY_UPDATED, callback),
    onLabelRegistryUpdate: (callback: SimpleCallback) =>
      event.on(LABEL_REGISTRY_UPDATED, callback),
    onRegistryUpdate: (callback: SimpleCallback) =>
      ANY_REGISTRY.forEach(i => event.on(i, callback)),
    onZoneRegistryUpdate: (callback: SimpleCallback) =>
      event.on(ZONE_REGISTRY_UPDATED, callback),
  };
}
