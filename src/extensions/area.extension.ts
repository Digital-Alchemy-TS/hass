import { TServiceParams } from "@digital-alchemy/core";

import { AreaCreate, AreaDetails, TAreaId } from "../helpers";

export function Area({ hass, context, config, logger }: TServiceParams) {
  hass.socket.onConnect(async () => {
    if (!config.hass.AUTO_CONNECT_SOCKET || !config.hass.MANAGE_REGISTRY) {
      return;
    }
    hass.area.current = await hass.area.list();
    hass.socket.subscribe({
      context,
      event_type: "area_registry_updated",
      async exec() {
        hass.area.current = await hass.area.list();
        logger.debug(`area registry updated`);
      },
    });
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
