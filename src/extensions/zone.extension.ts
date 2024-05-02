import { TServiceParams } from "@digital-alchemy/core";

import {
  EARLY_ON_READY,
  ManifestItem,
  ZoneDetails,
  ZoneOptions,
} from "../helpers";

export function Zone({
  config,
  hass,
  logger,
  context,
  lifecycle,
}: TServiceParams) {
  hass.socket.onConnect(async () => {
    if (!config.hass.AUTO_CONNECT_SOCKET || !config.hass.MANAGE_REGISTRY) {
      return;
    }
    let loading = new Promise<void>(async done => {
      hass.zone.current = await hass.zone.list();
      loading = undefined;
      done();
    });
    lifecycle.onReady(async () => loading && (await loading), EARLY_ON_READY);
    hass.socket.subscribe({
      context,
      event_type: "zone_registry_updated",
      async exec() {
        hass.zone.current = await hass.zone.list();
        logger.debug(`zone registry updated`);
      },
    });
  });

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
      type: "zone/list",
    });
  }
  return {
    create: ZoneCreate,
    current: [] as ZoneDetails[],
    list: ZoneList,
    update: ZoneUpdate,
  };
}
