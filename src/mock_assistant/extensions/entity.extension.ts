import { InternalError, TServiceParams } from "@digital-alchemy/core";

import { TRawEntityIds } from "../../dynamic";
import { ENTITY_STATE, PICK_ENTITY } from "../../helpers";

export function MockEntityExtension({ hass, internal, context }: TServiceParams) {
  let entities = new Map<TRawEntityIds, ENTITY_STATE<TRawEntityIds>>();

  const origGetAll = hass.fetch.getAllEntities;

  hass.fetch.getAllEntities = async () => [...entities.values()];

  function setupState(data: Record<PICK_ENTITY, { state: string | number }>) {
    if (internal.boot.completedLifecycleEvents.has("PreInit")) {
      throw new InternalError(context, "LATE_SETUP", "Must call setupState before preInit");
    }
    const list = Object.keys(data) as PICK_ENTITY[];
    list.forEach((key: PICK_ENTITY) => {
      const data = entities.get(key);
      entities.set(key, {
        ...data,
        // @ts-expect-error i don't care
        state: data[key].state,
      });
    });
  }

  return {
    /**
     * @internal
     */
    loadFixtures(incoming: ENTITY_STATE<TRawEntityIds>[]) {
      entities = new Map(incoming.map(i => [i.entity_id, i]));
    },

    /**
     * @internal
     *
     * restores code references, only used for testing internals
     */
    monkeyReset() {
      hass.fetch.getAllEntities = origGetAll;
    },

    /**
     * Does not emit update event
     *
     * Intended for test setup
     */
    setupState,
  };
}
