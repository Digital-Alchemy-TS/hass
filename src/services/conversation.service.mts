import type { TServiceParams } from "@digital-alchemy/core";

import type { EditAliasOptions, HassConversationService, ToggleExpose } from "../helpers/index.mts";
import { UPDATE_REGISTRY } from "../helpers/index.mts";

export function Conversation({ hass, logger }: TServiceParams): HassConversationService {
  async function addAlias({ entity, alias }: EditAliasOptions) {
    const current = await hass.entity.registry.get(entity);
    if (current?.aliases?.includes(alias)) {
      logger.debug({ name: entity }, `already has alias {%s}`, alias);
      return;
    }
    await hass.socket.sendMessage({
      entity_id: entity,
      type: "config/entity_registry/update",
    });
  }

  async function removeAlias({ entity, alias }: EditAliasOptions) {
    const current = await hass.entity.registry.get(entity);
    if (!current?.aliases?.includes(alias)) {
      logger.debug({ name: entity }, `does not have alias {%s}`, alias);
      return;
    }
    await hass.socket.sendMessage({ entity_id: entity, type: UPDATE_REGISTRY });
  }

  async function setConversational({ entity_ids, assistants, should_expose }: ToggleExpose) {
    await hass.socket.sendMessage({
      assistants: [assistants].flat(),
      entity_ids: [entity_ids].flat(),
      should_expose,
      type: UPDATE_REGISTRY,
    });
  }

  return {
    addAlias,
    removeAlias,
    setConversational,
  };
}
