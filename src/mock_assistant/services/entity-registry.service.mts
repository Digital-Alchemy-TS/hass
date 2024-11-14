import { TServiceParams } from "@digital-alchemy/core";

import { TRawEntityIds } from "../../dynamic.mts";
import { EntityRegistryItem } from "../../helpers/index.mts";

export function MockEntityRegistryExtension({ mock_assistant, hass }: TServiceParams) {
  let entityRegistry = new Map<TRawEntityIds, EntityRegistryItem<TRawEntityIds>>();

  hass.entity.registry.list = async () => [...entityRegistry.values()];

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
     * does not imply sendUpdate
     */
    loadFixtures(incoming: EntityRegistryItem<TRawEntityIds>[]) {
      entityRegistry = new Map(incoming.map(i => [i.entity_id, i]));
    },

    /**
     * emit entity_registry_updated
     */
    sendUpdate,
  };
}
