import {
  debounce,
  each,
  eachSeries,
  INCREMENT,
  is,
  SECOND,
  sleep,
  START,
  TServiceParams,
} from "@digital-alchemy/core";
import dayjs, { Dayjs } from "dayjs";

import {
  ALL_DOMAINS,
  ANY_ENTITY,
  EditLabelOptions,
  ENTITY_REGISTRY_UPDATED,
  ENTITY_STATE,
  EntityHistoryDTO,
  EntityHistoryItem,
  EntityHistoryResult,
  EntityRegistryItem,
  HassEntityManager,
  PICK_ENTITY,
  TMasterState,
} from "..";

const MAX_ATTEMPTS = 10;
const RECENT = 5;

export function EntityManager({
  logger,
  hass,
  config,
  lifecycle,
  event,
  context,
  internal,
}: TServiceParams): HassEntityManager {
  // #MARK: Local vars
  /**
   * MASTER_STATE.switch.desk_light = {entity_id,state,attributes,...}
   */
  let MASTER_STATE = {} as Partial<TMasterState>;
  const PREVIOUS_STATE = new Map<ANY_ENTITY, ENTITY_STATE<ANY_ENTITY>>();
  let lastRefresh: Dayjs;
  function warnEarly(method: string) {
    if (!init) {
      lifecycle.onReady(() => {
        logger.error(
          "attempted to use [%s] before application booted. use {lifecycle.onReady}",
          method,
        );
        // eslint-disable-next-line no-console
        console.trace(method);
      });
    }
  }

  // * Local event emitter for coordination of socket events
  // Other libraries will internally take advantage of this eventemitter
  let init = false;

  // #MARK: getCurrentState
  function getCurrentState<ENTITY_ID extends ANY_ENTITY>(
    entity_id: ENTITY_ID,
  ): ENTITY_STATE<ENTITY_ID> {
    const out = internal.utils.object.get(MASTER_STATE, entity_id) ?? {};
    return out as ENTITY_STATE<ENTITY_ID>;
  }

  // #MARK: history
  async function history<ENTITES extends ANY_ENTITY[]>(
    payload: Omit<EntityHistoryDTO<ENTITES>, "type">,
  ) {
    logger.trace({ payload }, `looking up entity history`);
    const result = (await hass.socket.sendMessage({
      ...payload,
      end_time: dayjs(payload.end_time).toISOString(),
      start_time: dayjs(payload.start_time).toISOString(),
      type: "history/history_during_period",
    })) as Record<ANY_ENTITY, EntityHistoryItem[]>;

    const entities = Object.keys(result) as ANY_ENTITY[];
    return Object.fromEntries(
      entities.map((entity_id: ANY_ENTITY) => {
        const key = entity_id;
        const states = result[entity_id];
        const value = states.map(data => {
          return {
            attributes: data.a,
            date: new Date(data.lu * SECOND),
            state: data.s,
          } as EntityHistoryResult;
        });
        return [key, value];
      }),
    );
  }

  // #MARK: listEntities
  function listEntities<DOMAIN extends ALL_DOMAINS = ALL_DOMAINS>(
    domain?: DOMAIN,
  ): PICK_ENTITY<DOMAIN>[] {
    if (domain) {
      return Object.keys(MASTER_STATE[domain as ALL_DOMAINS]).map(
        id => `${domain}.${id}` as PICK_ENTITY<DOMAIN>,
      );
    }
    return Object.keys(MASTER_STATE).flatMap(domain =>
      Object.keys(MASTER_STATE[domain as ALL_DOMAINS]).map(
        id => `${domain}.${id}` as PICK_ENTITY<DOMAIN>,
      ),
    );
  }

  // #MARK: refresh
  async function refresh(recursion = START): Promise<void> {
    const now = dayjs();
    if (lastRefresh) {
      const diff = lastRefresh.diff(now, "ms");
      if (diff >= RECENT * SECOND) {
        logger.warn({ diff }, `multiple refreshes in close time`);
      }
    }
    lastRefresh = now;
    // - Fetch list of entities
    const states = await hass.fetch.getAllEntities();
    // - Keep retrying until max failures reached
    if (!is.array(states) || is.empty(states)) {
      if (recursion > MAX_ATTEMPTS) {
        logger.fatal(
          { name: refresh },
          `failed to load service list from Home Assistant. validate configuration`,
        );
        process.exit();
      }
      logger.warn(
        { name: refresh, response: states },
        "failed to retrieve entity list. retrying {%s}/[%s]",
        recursion,
        MAX_ATTEMPTS,
      );
      await sleep(config.hass.RETRY_INTERVAL * SECOND);
      await refresh(recursion + INCREMENT);
      return;
    }

    // - Preserve old state for comparison
    const oldState = MASTER_STATE;
    MASTER_STATE = {};
    const emitUpdates: ENTITY_STATE<ANY_ENTITY>[] = [];

    // - Go through all entities, setting the state
    // ~ If this is a refresh (not an initial boot), track what changed so events can be emitted
    states.forEach(entity => {
      // ? Set first, ensure data is populated
      // `nextTick` will fire AFTER loop finishes
      internal.utils.object.set(
        MASTER_STATE,
        entity.entity_id,
        entity,
        is.undefined(internal.utils.object.get(oldState, entity.entity_id)),
      );
      if (!init) {
        return;
      }
      const old = internal.utils.object.get(oldState, entity.entity_id);
      if (is.equal(old, entity)) {
        // logger.trace(
        //   { entity_id: entity.entity_id, name: refresh },
        //   `no change on refresh`,
        // );
        return;
      }
      emitUpdates.push(entity);
    });

    // Attempt to not blow up the system?
    // TODO: does this gain anything? is a debounce needed somewhere else instead?
    setImmediate(async () => {
      await each(
        emitUpdates,
        async entity =>
          await entityUpdateReceiver(
            entity.entity_id,
            entity satisfies ENTITY_STATE<ANY_ENTITY>,
            internal.utils.object.get(oldState, entity.entity_id),
          ),
      );
    });
    init = true;
  }

  // #MARK: EntityUpdateReceiver
  function entityUpdateReceiver<ENTITY extends ANY_ENTITY = ANY_ENTITY>(
    entity_id: ENTITY,
    new_state: ENTITY_STATE<ENTITY>,
    old_state: ENTITY_STATE<ENTITY>,
  ) {
    PREVIOUS_STATE.set(entity_id, old_state);
    if (new_state === null) {
      logger.warn(
        { name: entityUpdateReceiver },
        `removing deleted entity [%s] from {MASTER_STATE}`,
        entity_id,
      );
      internal.utils.object.del(MASTER_STATE, entity_id);
      return;
    }
    internal.utils.object.set(MASTER_STATE, entity_id, new_state);
    if (!hass.socket.pauseMessages) {
      event.emit(entity_id, new_state, old_state);
      const unique_id = hass.entity.registry.current.find(
        i => i.entity_id === entity_id,
      )?.unique_id;
      if (is.number(unique_id) || !is.empty(unique_id)) {
        event.emit(unique_id, new_state, old_state);
      }
    }
  }

  // #MARK: onPostConfig
  lifecycle.onPostConfig(async function HassEntityPostConfig() {
    logger.debug({ name: HassEntityPostConfig }, `pre populate {MASTER_STATE}`);
    await hass.entity.refresh();
  });

  async function AddLabel({ entity, label }: EditLabelOptions) {
    await each([entity].flat(), async entity => {
      const current = await entityGet(entity);
      if (current?.labels?.includes(label)) {
        logger.debug({ name: entity }, `already has label {%s}`, label);
        return;
      }
      return await new Promise<void>(async done => {
        event.once(ENTITY_REGISTRY_UPDATED, done);
        await hass.socket.sendMessage({
          entity_id: entity,
          labels: [...current.labels, label],
          type: "config/entity_registry/update",
        });
      });
    });
  }

  // #MARK: EntitySource
  async function EntitySource() {
    return await hass.socket.sendMessage<Record<ANY_ENTITY, { domain: string }>>({
      type: "entity/source",
    });
  }

  // #MARK: EntityList
  async function EntityList() {
    return await hass.socket.sendMessage<EntityRegistryItem<ANY_ENTITY>[]>({
      type: "config/entity_registry/list",
    });
  }

  // #MARK: RemoveLabel
  async function RemoveLabel({ entity, label }: EditLabelOptions) {
    const current = await entityGet(entity);
    if (!current?.labels?.includes(label)) {
      logger.debug({ name: entity }, `does not have label {%s}`, label);
      return;
    }
    logger.debug({ name: entity }, `removing label [%s]`, label);
    return await new Promise<void>(async done => {
      event.once(ENTITY_REGISTRY_UPDATED, done);
      await hass.socket.sendMessage({
        entity_id: entity,
        labels: current.labels.filter(i => i !== label),
        type: "config/entity_registry/update",
      });
    });
  }

  // #MARK: EntityGet
  async function entityGet<ENTITY extends ANY_ENTITY>(entity_id: ENTITY) {
    return await hass.socket.sendMessage<EntityRegistryItem<ENTITY>>({
      entity_id: entity_id,
      type: "config/entity_registry/get",
    });
  }

  // #MARK: onConnect
  hass.socket.onConnect(async () => {
    hass.socket.subscribe({
      context,
      event_type: "entity_registry_updated",
      async exec() {
        await debounce(ENTITY_REGISTRY_UPDATED, config.hass.EVENT_DEBOUNCE_MS);
        logger.debug("entity registry updated");
        hass.entity.registry.current = await hass.entity.registry.list();
        event.emit(ENTITY_REGISTRY_UPDATED);
      },
    });
    hass.entity.registry.current = await hass.entity.registry.list();
  });

  // #MARK: RemoveEntity
  async function RemoveEntity(entity_id: ANY_ENTITY | ANY_ENTITY[]) {
    warnEarly("RemoveEntity");
    await eachSeries([entity_id].flat(), async entity_id => {
      logger.debug({ name: entity_id }, `removing entity`);
      await hass.socket.sendMessage({
        entity_id,
        type: "config/entity_registry/remove",
      });
    });
  }

  // #MARK: return object
  return {
    _entityUpdateReceiver: entityUpdateReceiver,

    _masterState: () => MASTER_STATE,

    /**
     * Retrieves the current state of a given entity. This method returns
     * raw data, offering a direct view of the entity's state at a given moment.
     */
    getCurrentState,

    history,
    listEntities,
    previousState: (entity_id: ANY_ENTITY) => PREVIOUS_STATE.get(entity_id),
    refresh,
    registry: {
      addLabel: AddLabel,
      current: [] as EntityRegistryItem<ANY_ENTITY>[],
      get: entityGet,
      list: EntityList,
      registryList: EntityList,
      removeEntity: RemoveEntity,
      removeLabel: RemoveLabel,
      source: EntitySource,
    },
    warnEarly,
  };
}
