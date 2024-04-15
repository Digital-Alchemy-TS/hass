import { TServiceParams } from "@digital-alchemy/core";

import { FloorCreate, FloorDetails, TFloorId } from "../helpers";

export function Floor({ hass, lifecycle, config }: TServiceParams) {
  lifecycle.onBootstrap(async () => {
    if (!config.hass.AUTO_CONNECT_SOCKET || !config.hass.MANAGE_REGISTRY) {
      return;
    }
    hass.floor.current = await hass.floor.list();
  });

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
