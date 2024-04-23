import { is, TServiceParams } from "@digital-alchemy/core";

import { TFloorId } from "../dynamic";
import {
  EARLY_ON_READY,
  FLOOR_REGISTRY_UPDATED,
  FloorCreate,
  FloorDetails,
} from "../helpers";

export function Floor({
  hass,
  config,
  context,
  event,
  logger,
  lifecycle,
}: TServiceParams) {
  hass.socket.onConnect(async () => {
    if (!config.hass.AUTO_CONNECT_SOCKET || !config.hass.MANAGE_REGISTRY) {
      return;
    }
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
        hass.floor.current = await hass.floor.list();
        logger.debug(`floor registry updated`);
        event.emit(FLOOR_REGISTRY_UPDATED);
      },
    });
  });

  is.floor = (floor: string): floor is TFloorId =>
    hass.floor.current.some(i => i.floor_id === floor);

  return {
    async create(details: FloorCreate) {
      return await new Promise<void>(async done => {
        event.once(FLOOR_REGISTRY_UPDATED, done);
        await hass.socket.sendMessage({
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

declare module "@digital-alchemy/core" {
  export interface IsIt {
    floor(floor: string): floor is TFloorId;
  }
}
