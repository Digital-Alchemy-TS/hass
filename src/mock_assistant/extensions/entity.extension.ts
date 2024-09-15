import { TServiceParams } from "@digital-alchemy/core";

import { TRawEntityIds } from "../../dynamic";
import { ENTITY_STATE, EntityRegistryItem } from "../../helpers";

export function MockEntityExtension({ mock_assistant, hass }: TServiceParams) {
  let entityRegistry = new Map<TRawEntityIds, EntityRegistryItem<TRawEntityIds>>();
  let entities = new Map<TRawEntityIds, ENTITY_STATE<TRawEntityIds>>();

  hass.entity.registry.list = async () => [...entityRegistry.values()];

  hass.fetch.getAllEntities = async () => [...entities.values()];

  return {
    setEntities(incoming: ENTITY_STATE<TRawEntityIds>[]) {
      entities = new Map(incoming.map(i => [i.entity_id, i]));
    },
    setRegistry(incoming: EntityRegistryItem<TRawEntityIds>[]) {
      entityRegistry = new Map(incoming.map(i => [i.entity_id, i]));
    },
  };
}
