import { debounce, TServiceParams } from "@digital-alchemy/core";

import {
  EARLY_ON_READY,
  HassZoneService,
  ManifestItem,
  perf,
  ZONE_REGISTRY_UPDATED,
  ZoneDetails,
  ZoneOptions,
} from "../helpers/index.mts";

export function Zone({
  config,
  hass,
  event,
  logger,
  context,
  lifecycle,
}: TServiceParams): HassZoneService {
  hass.socket.onConnect(async () => {
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
        const ms = perf();
        await debounce(ZONE_REGISTRY_UPDATED, config.hass.EVENT_DEBOUNCE_MS);
        hass.zone.current = await hass.zone.list();
        logger.debug(`zone registry updated`);
        event.emit(ZONE_REGISTRY_UPDATED);
        hass.diagnostics.zone?.registry_update.publish({ ms: ms() });
      },
    });
  });

  async function ZoneCreate(options: ZoneOptions) {
    return new Promise<void>(async done => {
      event.once(ZONE_REGISTRY_UPDATED, done);
      await hass.socket.sendMessage<ManifestItem[]>({
        ...options,
        type: "zone/create",
      });
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
