import { is, TServiceParams } from "@digital-alchemy/core";

import { TLabelId } from "../dynamic";
import {
  EARLY_ON_READY,
  LABEL_REGISTRY_UPDATED,
  LabelDefinition,
  LabelOptions,
} from "../helpers";

export function Label({
  hass,
  config,
  logger,
  lifecycle,
  event,
  context,
}: TServiceParams) {
  hass.socket.onConnect(async () => {
    if (!config.hass.AUTO_CONNECT_SOCKET || !config.hass.MANAGE_REGISTRY) {
      return;
    }
    let loading = new Promise<void>(async done => {
      hass.label.current = await hass.label.list();
      loading = undefined;
      done();
    });
    lifecycle.onReady(async () => loading && (await loading), EARLY_ON_READY);
    hass.socket.subscribe({
      context,
      event_type: "label_registry_updated",
      async exec() {
        hass.label.current = await hass.label.list();
        logger.debug(`label registry updated`);
        event.emit(LABEL_REGISTRY_UPDATED);
      },
    });
  });

  is.label = (label: TLabelId): label is TLabelId =>
    hass.label.current.some(i => i.label_id === label);

  return {
    async create(details: LabelOptions) {
      return await new Promise<void>(async done => {
        event.once(LABEL_REGISTRY_UPDATED, done);
        await hass.socket.sendMessage({
          type: "config/label_registry/create",
          ...details,
        });
      });
    },
    current: [] as LabelDefinition[],
    async delete(area_id: TLabelId) {
      return await new Promise<void>(async done => {
        event.once(LABEL_REGISTRY_UPDATED, done);
        await hass.socket.sendMessage({
          area_id,
          type: "config/label_registry/delete",
        });
      });
    },
    async list() {
      return await hass.socket.sendMessage<LabelDefinition[]>({
        type: "config/label_registry/list",
      });
    },
    async update(details: LabelDefinition) {
      return await new Promise<void>(async done => {
        event.once(LABEL_REGISTRY_UPDATED, done);
        await hass.socket.sendMessage({
          type: "config/label_registry/update",
          ...details,
        });
      });
    },
  };
}

declare module "@digital-alchemy/core" {
  export interface IsIt {
    label(label: string): label is TLabelId;
  }
}
