import { TServiceParams } from "@digital-alchemy/core";

import {
  EditAliasOptions,
  EditLabelOptions,
  EntityRegistryItem,
  LabelDefinition,
  LabelOptions,
  PICK_ENTITY,
  ToggleExpose,
  UPDATE_REGISTRY,
} from "../helpers";

export function Registry({ hass, logger, lifecycle }: TServiceParams) {
  async function CreateLabel(options: LabelOptions) {
    logger.info({ options }, `create label`);
    await hass.socket.sendMessage({
      type: "config/label/create",
      ...options,
    });
  }

  async function RemoveLabel({ entity, label }: EditLabelOptions) {
    const current = await EntityGet(entity);
    if (!current?.labels?.includes(label)) {
      logger.debug({ name: entity }, `does not have label {%s}`, label);
      return;
    }
    logger.debug({ name: entity }, `removing label [%s]`, label);
    await hass.socket.sendMessage({
      entity_id: entity,
      labels: current.labels.filter(i => i !== label),
      type: UPDATE_REGISTRY,
    });
  }

  async function ListLabels() {
    return await hass.socket.sendMessage<LabelDefinition[]>({
      type: "config/label_registry/list",
    });
  }

  async function AddLabel({ entity, label }: EditLabelOptions) {
    const current = await EntityGet(entity);
    if (current?.labels?.includes(label)) {
      logger.debug({ name: entity }, `already has label {%s}`, label);
      return;
    }
    await hass.socket.sendMessage({
      entity_id: entity,
      labels: [...current.labels, label],
      type: UPDATE_REGISTRY,
    });
  }

  async function EntityGet<ENTITY extends PICK_ENTITY>(entity_id: ENTITY) {
    return await hass.socket.sendMessage<EntityRegistryItem<ENTITY>>({
      entity_id: entity_id,
      type: "config/entity_registry/get",
    });
  }

  async function AddAlias({ entity, alias }: EditAliasOptions) {
    const current = await EntityGet(entity);
    if (current?.aliases?.includes(alias)) {
      logger.debug({ name: entity }, `already has alias {%s}`, alias);
      return;
    }
    await hass.socket.sendMessage({
      entity_id: entity,
      type: UPDATE_REGISTRY,
    });
  }

  async function RemoveAlias({ entity, alias }: EditAliasOptions) {
    const current = await EntityGet(entity);
    if (!current?.aliases?.includes(alias)) {
      logger.debug({ name: entity }, `does not have alias {%s}`, alias);
      return;
    }
    await hass.socket.sendMessage({
      entity_id: entity,
      type: UPDATE_REGISTRY,
    });
  }

  async function SetConversational({
    entity_ids,
    assistants,
    should_expose,
  }: ToggleExpose) {
    await hass.socket.sendMessage({
      assistants: [assistants].flat(),
      entity_ids: [entity_ids].flat(),
      should_expose,
      type: UPDATE_REGISTRY,
    });
  }

  async function EntityList() {
    await hass.socket.sendMessage({
      type: "config/entity_registry/list_for_display",
    });
  }

  async function DeviceList() {
    await hass.socket.sendMessage({
      type: "config/device_registry/list",
    });
  }

  async function ListAreas() {
    await hass.socket.sendMessage({
      type: "config/area_registry/list",
    });
  }

  return {
    area: {
      list: ListAreas,
    },
    conversation: {
      addAlias: AddAlias,
      removeAlias: RemoveAlias,
      setConversational: SetConversational,
    },
    device: {
      list: DeviceList,
    },
    entity: {
      addLabel: AddLabel,
      get: EntityGet,
      list: EntityList,
      removeLabel: RemoveLabel,
    },
    label: {
      create: CreateLabel,
      list: ListLabels,
    },
  };
}
