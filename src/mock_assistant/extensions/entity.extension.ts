import { TServiceParams } from "@digital-alchemy/core";

import { TRawEntityIds } from "../../dynamic";
import { EntityRegistryItem } from "../../helpers";

export function MockEntityExtension({ mock_assistant, hass }: TServiceParams) {
  let entities = new Map<TRawEntityIds, EntityRegistryItem<TRawEntityIds>>();

  hass.entity.registry.list = async () => [...entities.values()];

  return {
    set(incoming: EntityRegistryItem<TRawEntityIds>[]) {
      entities = new Map(incoming.map(i => [i.entity_id, i]));
    },
  };
}
