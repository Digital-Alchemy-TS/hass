import { debounce, TServiceParams } from "@digital-alchemy/core";

import { TLabelId } from "../dynamic";
import { EARLY_ON_READY, LABEL_REGISTRY_UPDATED, LabelDefinition, LabelOptions } from "../helpers";

export function Label({ hass, config, logger, lifecycle, event, context }: TServiceParams) {
  hass.socket.onConnect(async () => {
    let loading = new Promise<void>(async done => {
      hass.label.current = await hass.label.list();
      loading = undefined;
      done();
    });
    lifecycle.onReady(async () => loading && (await loading), EARLY_ON_READY);
  });

  hass.socket.subscribe({
    context,
    event_type: "label_registry_updated",
    async exec() {
      await debounce(LABEL_REGISTRY_UPDATED, config.hass.EVENT_DEBOUNCE_MS);
      hass.label.current = await hass.label.list();
      logger.debug(`label registry updated`);
      event.emit(LABEL_REGISTRY_UPDATED);
    },
  });

  async function create(details: LabelOptions) {
    return await new Promise<void>(async done => {
      event.once(LABEL_REGISTRY_UPDATED, done);
      await hass.socket.sendMessage({
        type: "config/label_registry/create",
        ...details,
      });
    });
  }

  async function deleteLabel(label_id: TLabelId) {
    return await new Promise<void>(async done => {
      event.once(LABEL_REGISTRY_UPDATED, done);
      await hass.socket.sendMessage({
        label_id,
        type: "config/label_registry/delete",
      });
    });
  }

  async function list() {
    return await hass.socket.sendMessage<LabelDefinition[]>({
      type: "config/label_registry/list",
    });
  }

  async function update(details: LabelDefinition) {
    return await new Promise<void>(async done => {
      event.once(LABEL_REGISTRY_UPDATED, done);
      await hass.socket.sendMessage({
        type: "config/label_registry/update",
        ...details,
      });
    });
  }

  return {
    create,
    current: [] as LabelDefinition[],
    delete: deleteLabel,
    list,
    update,
  };
}
