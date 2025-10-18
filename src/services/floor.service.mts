import type { TServiceParams } from "@digital-alchemy/core";
import { debounce } from "@digital-alchemy/core";

import type { FloorCreate, FloorDetails, HassFloorService } from "../helpers/index.mts";
import { EARLY_ON_READY, FLOOR_REGISTRY_UPDATED, perf } from "../helpers/index.mts";
import type { TFloorId } from "../user.mts";

export function Floor({
  hass,
  config,
  context,
  event,
  logger,
  lifecycle,
}: TServiceParams): HassFloorService {
  hass.socket.onConnect(async () => {
    let loading = new Promise<void>(async done => {
      hass.floor.current = await hass.floor.list();
      loading = undefined;
      done();
    });
    lifecycle.onReady(async () => loading && (await loading), EARLY_ON_READY);

    hass.socket.subscribe({
      context,
      event_type: "floor_registry_updated",
      async exec() {
        const ms = perf();
        await debounce(FLOOR_REGISTRY_UPDATED, config.hass.EVENT_DEBOUNCE_MS);
        hass.floor.current = await hass.floor.list();
        logger.debug(`floor registry updated`);
        event.emit(FLOOR_REGISTRY_UPDATED);
        hass.diagnostics.floor?.registry_update.publish({ ms: ms() });
      },
    });
  });

  return {
    async create(details: FloorCreate) {
      return await new Promise<void>(async done => {
        event.once(FLOOR_REGISTRY_UPDATED, done);
        await hass.socket.sendMessage({
          aliases: [],
          type: "config/floor_registry/create",
          ...details,
        });
      });
    },
    current: [] as FloorDetails[],
    async delete(floor_id: TFloorId) {
      return await new Promise<void>(async done => {
        event.once(FLOOR_REGISTRY_UPDATED, done);
        await hass.socket.sendMessage({
          floor_id,
          type: "config/floor_registry/delete",
        });
      });
    },
    async list() {
      return await hass.socket.sendMessage<FloorDetails[]>({
        type: "config/floor_registry/list",
      });
    },
    async update(details: FloorDetails) {
      return await new Promise<void>(async done => {
        event.once(FLOOR_REGISTRY_UPDATED, done);
        await hass.socket.sendMessage({
          type: "config/floor_registry/update",
          ...details,
        });
      });
    },
  };
}
