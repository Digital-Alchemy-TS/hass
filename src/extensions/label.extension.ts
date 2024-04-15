import { TServiceParams } from "@digital-alchemy/core";

import { LabelDefinition, LabelOptions, TLabelId } from "../helpers";

export function Label({ hass, lifecycle, config }: TServiceParams) {
  lifecycle.onBootstrap(async () => {
    if (!config.hass.AUTO_CONNECT_SOCKET || !config.hass.MANAGE_REGISTRY) {
      return;
    }
    hass.floor.current = await hass.floor.list();
  });

  return {
    async create(details: LabelOptions) {
      await hass.socket.sendMessage({
        type: "config/label_registry/create",
        ...details,
      });
    },
    current: [] as LabelDefinition[],
    async delete(area_id: TLabelId) {
      await hass.socket.sendMessage({
        area_id,
        type: "config/label_registry/delete",
      });
    },
    async list() {
      return await hass.socket.sendMessage<LabelDefinition[]>({
        type: "config/label_registry/list",
      });
    },
    async update(details: LabelDefinition) {
      await hass.socket.sendMessage({
        type: "config/label_registry/update",
        ...details,
      });
    },
  };
}
