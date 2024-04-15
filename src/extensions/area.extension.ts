import { TServiceParams } from "@digital-alchemy/core";

import { AreaCreate, AreaDetails, TAreaId } from "../helpers";

export function Area({ hass, lifecycle, config }: TServiceParams) {
  lifecycle.onBootstrap(async () => {
    if (!config.hass.AUTO_CONNECT_SOCKET || !config.hass.MANAGE_REGISTRY) {
      return;
    }
    hass.floor.current = await hass.floor.list();
  });

  return {
    async create(details: AreaCreate) {
      await hass.socket.sendMessage({
        type: "config/area_registry/create",
        ...details,
      });
    },
    current: [] as AreaDetails[],
    async delete(area_id: TAreaId) {
      await hass.socket.sendMessage({
        area_id,
        type: "config/area_registry/delete",
      });
    },
    async list() {
      return await hass.socket.sendMessage<AreaDetails[]>({
        type: "config/area_registry/list",
      });
    },
    async update(details: AreaDetails) {
      await hass.socket.sendMessage({
        type: "config/area_registry/update",
        ...details,
      });
    },
  };
}
