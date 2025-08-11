export const HASS_ENTITY = "HASS_ENTITY";
export const HASS_ENTITY_GROUP = "HASS_ENTITY_GROUP";
export const ALL_ENTITIES_UPDATED = "ALL_ENTITIES_UPDATED";
export const SOCKET_READY = "SOCKET_READY";

export enum HassSocketMessageTypes {
  auth_required = "auth_required",
  auth_ok = "auth_ok",
  event = "event",
  result = "result",
  pong = "pong",
  auth_invalid = "auth_invalid",
}

export const HOME_ASSISTANT_MODULE_CONFIGURATION = "HOME_ASSISTANT_MODULE_CONFIGURATION";

export const EARLY_ON_READY = 1;
export const ENTITY_REGISTRY_UPDATED = "ENTITY_REGISTRY_UPDATED";
export const AREA_REGISTRY_UPDATED = "AREA_REGISTRY_UPDATED";
export const LABEL_REGISTRY_UPDATED = "LABEL_REGISTRY_UPDATED";
export const FLOOR_REGISTRY_UPDATED = "FLOOR_REGISTRY_UPDATED";
export const DEVICE_REGISTRY_UPDATED = "DEVICE_REGISTRY_UPDATED";
export const ZONE_REGISTRY_UPDATED = "ZONE_REGISTRY_UPDATED";
