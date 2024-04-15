import { is, TServiceParams } from "@digital-alchemy/core";

import { FloorCreate, FloorDetails, TFloorId } from "../helpers";

export function Floor({
  hass,
  lifecycle,
  config,
  context,
  logger,
}: TServiceParams) {
  lifecycle.onBootstrap(async () => {
    if (!config.hass.AUTO_CONNECT_SOCKET || !config.hass.MANAGE_REGISTRY) {
      return;
    }
    hass.floor.current = await hass.floor.list();
    hass.socket.subscribe({
      context,
      event_type: "floor_registry_updated",
      async exec() {
        hass.floor.current = await hass.floor.list();
        logger.debug(`floor registry updated`);
      },
    });
  });

  is.floor = (floor: string): floor is TFloorId =>
    hass.floor.current.some(i => i.floor_id === floor);

  return {
    async create(details: FloorCreate) {
      await hass.socket.sendMessage({
        type: "config/floor_registry/create",
        ...details,
      });
    },
    current: [] as FloorDetails[],
    async delete(floor_id: TFloorId) {
      await hass.socket.sendMessage({
        floor_id,
        type: "config/floor_registry/delete",
      });
    },
    async list() {
      return await hass.socket.sendMessage<FloorDetails[]>({
        type: "config/floor_registry/list",
      });
    },
    async update(details: FloorDetails) {
      await hass.socket.sendMessage({
        type: "config/floor_registry/update",
        ...details,
      });
    },
  };
}

declare module "@digital-alchemy/core" {
  export interface IsIt {
    floor(floor: string): floor is TFloorId;
  }
}
