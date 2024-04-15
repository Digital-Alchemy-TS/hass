import { is, TServiceParams } from "@digital-alchemy/core";

import { ManifestItem, TZoneId, ZoneDetails, ZoneOptions } from "../helpers";

export function Zone({
  lifecycle,
  config,
  hass,
  logger,
  context,
}: TServiceParams) {
  lifecycle.onBootstrap(async () => {
    if (!config.hass.AUTO_CONNECT_SOCKET || !config.hass.MANAGE_REGISTRY) {
      return;
    }
    hass.zone.current = await hass.zone.list();
    hass.socket.subscribe({
      context,
      event_type: "zone_registry_updated",
      async exec() {
        hass.zone.current = await hass.zone.list();
        logger.debug(`zone registry updated`);
      },
    });
  });

  is.zone = (floor: string): floor is TZoneId =>
    hass.zone.current.some(i => i.id === floor);

  async function ZoneCreate(options: ZoneOptions) {
    await hass.socket.sendMessage<ManifestItem[]>({
      ...options,
      type: "zone/create",
    });
  }

  async function ZoneUpdate(zone_id: string, options: ZoneOptions) {
    await hass.socket.sendMessage<ManifestItem[]>({
      ...options,
      type: "zone/create",
      zone_id,
    });
  }

  async function ZoneList() {
    return await hass.socket.sendMessage<ZoneDetails[]>({
      type: "manifest/list",
    });
  }
  return {
    create: ZoneCreate,
    current: [] as ZoneDetails[],
    list: ZoneList,
    update: ZoneUpdate,
  };
}

declare module "@digital-alchemy/core" {
  export interface IsIt {
    zone(floor: string): floor is TZoneId;
  }
}
