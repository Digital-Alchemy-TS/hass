import { is, TServiceParams } from "@digital-alchemy/core";

import { TLabelId } from "../dynamic";
import { LabelDefinition, LabelOptions } from "../helpers";

export function Label({ hass, config, logger, context }: TServiceParams) {
  hass.socket.onConnect(async () => {
    if (!config.hass.AUTO_CONNECT_SOCKET || !config.hass.MANAGE_REGISTRY) {
      return;
    }
    hass.label.current = await hass.label.list();
    hass.socket.subscribe({
      context,
      event_type: "label_registry_updated",
      async exec() {
        hass.label.current = await hass.label.list();
        logger.debug(`label registry updated`);
      },
    });
  });

  is.label = (label: TLabelId): label is TLabelId =>
    hass.label.current.some(i => i.label_id === label);

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

declare module "@digital-alchemy/core" {
  export interface IsIt {
    label(label: string): label is TLabelId;
  }
}
