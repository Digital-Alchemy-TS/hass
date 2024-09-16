import { TServiceParams } from "@digital-alchemy/core";

import { TRawEntityIds } from "../../dynamic";
import { ENTITY_STATE, EntityRegistryItem } from "../../helpers";

export function MockEntityExtension({ mock_assistant, hass }: TServiceParams) {
  let entityRegistry = new Map<TRawEntityIds, EntityRegistryItem<TRawEntityIds>>();
  let entities = new Map<TRawEntityIds, ENTITY_STATE<TRawEntityIds>>();

  const origGetAll = hass.fetch.getAllEntities;

  hass.entity.registry.list = async () => [...entityRegistry.values()];

  hass.fetch.getAllEntities = async () => [...entities.values()];

  const sendUpdate = () =>
    mock_assistant.socket.sendMessage({
      event: { event_type: "entity_registry_updated" },
      type: "event",
    });

  mock_assistant.socket.onMessage<{ entity_id: TRawEntityIds }>(
    "config/entity_registry/get",
    message => {
      mock_assistant.socket.sendMessage({
        id: message.id,
        result: entityRegistry.get(message.entity_id),
        type: "result",
      });
    },
  );

  return {
    /**
     * restores code references, only used for testing internals
     */
    reset() {
      hass.fetch.getAllEntities = origGetAll;
    },

    /**
     * emit entity_registry_updated
     */
    sendUpdate,

    /**
     * does not imply sendUpdate
     */
    setEntities(incoming: ENTITY_STATE<TRawEntityIds>[]) {
      entities = new Map(incoming.map(i => [i.entity_id, i]));
    },

    /**
     * does not imply sendUpdate
     */
    setRegistry(incoming: EntityRegistryItem<TRawEntityIds>[]) {
      entityRegistry = new Map(incoming.map(i => [i.entity_id, i]));
    },
  };
}
