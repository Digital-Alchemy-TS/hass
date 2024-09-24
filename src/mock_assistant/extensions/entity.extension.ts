import { deepExtend, InternalError, is, NONE, sleep, TServiceParams } from "@digital-alchemy/core";

import { TRawEntityIds } from "../../dynamic";
import { ENTITY_STATE, PICK_ENTITY } from "../../helpers";

export function MockEntityExtension({
  hass,
  internal,
  context,
  logger,
  mock_assistant,
}: TServiceParams) {
  let entities = new Map<TRawEntityIds, ENTITY_STATE<TRawEntityIds>>();

  const origGetAll = hass.fetch.getAllEntities;

  hass.fetch.getAllEntities = async () => [...entities.values()];

  function setupState(incoming: SetupStateOptions) {
    if (internal.boot.completedLifecycleEvents.has("PreInit")) {
      logger.error(`run [setupState] as part of the .setup command of your test`);
      throw new InternalError(context, "LATE_SETUP", "Must call setupState before preInit");
    }
    const list = Object.keys(incoming) as PICK_ENTITY[];
    list.forEach((key: PICK_ENTITY) => {
      const data = entities.get(key);
      entities.set(key, {
        ...data,
        state: incoming[key].state,
      });
    });
  }

  async function emitChange<ENTITY extends PICK_ENTITY>(
    entity: ENTITY,
    update: PartialUpdate<ENTITY>,
  ) {
    const old_state = entities.get(entity);
    if (hass.socket.connectionState !== "connected") {
      throw new InternalError(context, "EARLY_CHANGE", "Websocket does not identify as connected");
    }
    if (!old_state) {
      throw new InternalError(
        context,
        "MISSING_ENTITY",
        "Cannot find existing entity for old_state",
      );
    }
    const new_state = deepExtend({}, old_state);
    if ("state" in update) {
      new_state.state = update.state;
    }
    if (!is.empty(update.attributes)) {
      new_state.attributes = deepExtend(new_state.attributes, update.attributes);
    }

    mock_assistant.socket.sendMessage({
      event: {
        data: { new_state, old_state },
        event_type: "state_changed",
      },
      type: "event",
    });

    // allow changes to propagate properly
    await sleep(NONE);
  }

  return {
    /**
     *
     */
    emitChange,

    /**
     * @internal
     */
    loadFixtures(incoming: ENTITY_STATE<TRawEntityIds>[]) {
      if (!is.empty(entities)) {
        // this should not be possible, the dependency resolution order of tests SHOULD prevent
        // if you get this error, let me know how
        throw new InternalError(
          context,
          "FIXTURES_ALREADY_LOADED",
          "There is data in the entity fixtures already, order of operations wrong",
        );
      }
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

type PartialUpdate<ENTITY extends PICK_ENTITY> = Partial<
  Pick<ENTITY_STATE<ENTITY>, "state" | "attributes">
>;

type SetupStateOptions = Partial<{ [ENTITY in PICK_ENTITY]: PartialUpdate<ENTITY> }>;
