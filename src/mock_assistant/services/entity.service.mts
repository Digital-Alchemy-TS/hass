import type { TServiceParams } from "@digital-alchemy/core";
import { deepExtend, InternalError, sleep } from "@digital-alchemy/core";

import type { ENTITY_STATE } from "../../index.mts";
import type { ANY_ENTITY, PICK_ENTITY, TRawEntityIds } from "../../user.mts";

export function MockEntityExtension({
  hass,
  internal,
  context,
  logger,
  config,
  lifecycle,
  mock_assistant,
}: TServiceParams) {
  const { is } = internal.utils;
  let entities = new Map<TRawEntityIds, ENTITY_STATE<TRawEntityIds>>();

  // Queue for register() calls that arrive before socket is connected (F5)
  const pendingRegistrations: Array<() => void> = [];

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
    await sleep(config.mock_assistant.EMIT_SLEEP);
  }

  // Flush pending register() MASTER_STATE populations once socket connects
  lifecycle.onReady(() => {
    while (!is.empty(pendingRegistrations)) {
      pendingRegistrations.shift()?.();
    }
  });

  /**
   * Register a new entity into the mock seed store post-boot.
   * Inserts into the entities Map and populates MASTER_STATE via the socket path.
   *
   * Unlike setupState/loadFixtures, this is safe to call after PreInit and after boot.
   * If the socket is not yet connected, the MASTER_STATE population is deferred until ready.
   */
  function register(entity_id: ANY_ENTITY, initialState: Partial<ENTITY_STATE<ANY_ENTITY>>) {
    const state = {
      attributes: {},
      entity_id: entity_id as TRawEntityIds,
      state: "unknown",
      ...initialState,
    } as ENTITY_STATE<TRawEntityIds>;
    entities.set(entity_id as TRawEntityIds, state);

    const populate = () => {
      hass.entity._entityUpdateReceiver(
        entity_id,
        state,
        undefined as unknown as ENTITY_STATE<ANY_ENTITY>,
      );
    };

    if (hass.socket.connectionState === "connected") {
      populate();
    } else {
      pendingRegistrations.push(populate);
    }
  }

  return {
    /**
     * Look up an entity from the seed store by entity_id.
     */
    byId(entity_id: ANY_ENTITY) {
      return entities.get(entity_id as TRawEntityIds);
    },

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
     * Register a new entity into the mock seed store post-boot.
     */
    register,

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
