import {
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
import { exit } from "process";

import {
  ALL_DOMAINS,
  ANY_ENTITY,
  ByIdProxy,
  EditLabelOptions,
  ENTITY_REGISTRY_UPDATED,
  ENTITY_STATE,
  EntityHistoryDTO,
  EntityHistoryItem,
  EntityHistoryResult,
  EntityRegistryItem,
  PICK_ENTITY,
  TAreaId,
  TDeviceId,
  TFloorId,
  TLabelId,
  TPlatformId,
  TRawDomains,
  TUniqueId,
  TUniqueIDMapping,
} from "..";

const MAX_ATTEMPTS = 10;
const RECENT = 5;

type TMasterState = {
  [DOMAIN in ALL_DOMAINS]: Record<string, ENTITY_STATE<PICK_ENTITY<DOMAIN>>>;
};

export function EntityManager({
  logger,
  hass,
  config,
  lifecycle,
  event,
  context,
  internal,
}: TServiceParams) {
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

  // #MARK: findByDomain
  function findByDomain<DOMAIN extends ALL_DOMAINS>(domain: DOMAIN) {
    return Object.keys(MASTER_STATE[domain] ?? {}).map(i =>
      hass.refBy.id(`${domain}.${i}` as PICK_ENTITY<DOMAIN>),
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
        exit();
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
          await EntityUpdateReceiver(
            entity.entity_id,
            entity satisfies ENTITY_STATE<ANY_ENTITY>,
            internal.utils.object.get(oldState, entity.entity_id),
          ),
      );
    });
    init = true;
  }

  // #MARK: EntityUpdateReceiver
  function EntityUpdateReceiver<ENTITY extends ANY_ENTITY = ANY_ENTITY>(
    entity_id: ENTITY,
    new_state: ENTITY_STATE<ENTITY>,
    old_state: ENTITY_STATE<ENTITY>,
  ) {
    PREVIOUS_STATE.set(entity_id, old_state);
    if (new_state === null) {
      logger.warn(
        { name: EntityUpdateReceiver },
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
      if (!is.empty(unique_id)) {
        event.emit(unique_id, new_state, old_state);
      }
    }
  }

  // #MARK: onPostConfig
  lifecycle.onPostConfig(async function HassEntityPostConfig() {
    if (!config.hass.AUTO_CONNECT_SOCKET) {
      return;
    }
    logger.debug({ name: HassEntityPostConfig }, `pre populate {MASTER_STATE}`);
    await hass.entity.refresh();
  });

  async function AddLabel({ entity, label }: EditLabelOptions) {
    await each([entity].flat(), async entity => {
      const current = await EntityGet(entity);
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
    return await hass.socket.sendMessage<
      Record<ANY_ENTITY, { domain: string }>
    >({ type: "entity/source" });
  }

  // #MARK: EntityList
  async function EntityList() {
    return await hass.socket.sendMessage<EntityRegistryItem<ANY_ENTITY>[]>({
      type: "config/entity_registry/list",
    });
  }

  // #MARK: RemoveLabel
  async function RemoveLabel({ entity, label }: EditLabelOptions) {
    const current = await EntityGet(entity);
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
  async function EntityGet<ENTITY extends ANY_ENTITY>(entity_id: ENTITY) {
    return await hass.socket.sendMessage<EntityRegistryItem<ENTITY>>({
      entity_id: entity_id,
      type: "config/entity_registry/get",
    });
  }

  // #MARK: onConnect
  hass.socket.onConnect(async () => {
    if (!config.hass.AUTO_CONNECT_SOCKET || !config.hass.MANAGE_REGISTRY) {
      return;
    }
    hass.entity.registry.current = await hass.entity.registry.list();
    hass.socket.subscribe({
      context,
      event_type: "entity_registry_updated",
      async exec() {
        logger.debug("entity registry updated");
        hass.entity.registry.current = await hass.entity.registry.list();
        event.emit(ENTITY_REGISTRY_UPDATED);
      },
    });
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
    _entityEvents: () => event,
    /**
     * Internal library use only
     */
    _entityUpdateReceiver: EntityUpdateReceiver,

    _masterState: () => MASTER_STATE,

    /**
     * Retrieve a list of entities listed as being part of a certain area
     * Tracks area updates at runtime
     *
     * @deprecated use `hass.idBy.area` - to be remove 2024-08
     */
    byArea: <AREA extends TAreaId, DOMAINS extends TRawDomains = TRawDomains>(
      area: AREA,
      ...domains: DOMAINS[]
    ) => hass.idBy.area(area, ...domains),

    /**
     * Retrieve a list of entities associated with a particular device id
     *
     * @deprecated use `hass.idBy.device` - to be remove 2024-08
     */
    byDevice: <
      DEVICE extends TDeviceId,
      DOMAINS extends TRawDomains = TRawDomains,
    >(
      device: DEVICE,
      ...domains: DOMAINS[]
    ) => hass.idBy.device<DEVICE, DOMAINS>(device, ...domains),

    /**
     * Retrieve a list of entities that have areas associated with a certain floor
     *
     * @deprecated use `hass.idBy.floor` - to be remove 2024-08
     */
    byFloor: <
      FLOOR extends TFloorId,
      DOMAINS extends TRawDomains = TRawDomains,
    >(
      floor: FLOOR,
      ...domains: DOMAINS[]
    ) => hass.idBy.floor<FLOOR, DOMAINS>(floor, ...domains),

    /**
     * Retrieves a proxy object for a specified entity. This proxy object
     * provides current values and event hooks for the entity.
     *
     * @deprecated use `hass.refBy.id` - to be remove 2024-08
     */
    byId: <ID extends ANY_ENTITY>(id: ID): ByIdProxy<ID> => hass.refBy.id(id),

    /**
     * Retrieve a list of entities that have a given label
     *
     * @deprecated use `hass.idBy.label` - to be remove 2024-08
     */
    byLabel: <
      LABEL extends TLabelId,
      DOMAINS extends TRawDomains = TRawDomains,
    >(
      label: LABEL,
      ...domains: DOMAINS[]
    ) => hass.idBy.label<LABEL, DOMAINS>(label, ...domains),

    /**
     * search out ids by platform
     *
     * @deprecated use `hass.idBy.platform` - to be remove 2024-08
     */
    byPlatform: <
      PLATFORM extends TPlatformId,
      DOMAINS extends TRawDomains = TRawDomains,
    >(
      platform: PLATFORM,
      ...domains: DOMAINS[]
    ) => hass.idBy.platform<PLATFORM, DOMAINS>(platform, ...domains),

    /**
     * looks up entity_id reference by the unique id in the registry, and returns the entity reference
     *
     * @deprecated use `hass.idBy.unique_id` | `hass.refBy.unique_id`
     */
    byUniqueId: <
      UNIQUE_ID extends TUniqueId,
      ENTITY_ID extends Extract<
        TUniqueIDMapping[UNIQUE_ID],
        ANY_ENTITY
      > = Extract<TUniqueIDMapping[UNIQUE_ID], ANY_ENTITY>,
    >(
      unique_id: UNIQUE_ID,
    ) => hass.refBy.unique_id<UNIQUE_ID, ENTITY_ID>(unique_id),

    /**
     * Lists all entities within a specified domain. This is useful for
     * domain-specific operations or queries.
     *
     * @deprecated use `hass.idBy.domain` | `hass.refBy.domain`
     */
    findByDomain,

    /**
     * Retrieves the current state of a given entity. This method returns
     * raw data, offering a direct view of the entity's state at a given moment.
     */
    getCurrentState,

    /**
     * Retrieves the historical state data of entities over a specified time
     * period. Useful for analysis or tracking changes over time.
     */
    history,

    /**
     * Provides a simple listing of all entity IDs. Useful for enumeration
     * and quick reference to all available entities.
     */
    listEntities,

    /**
     * Returns the previous entity state (not a proxy)
     */
    previousState: (entity_id: ANY_ENTITY) => PREVIOUS_STATE.get(entity_id),

    /**
     * Retrieve the raw entity data for this point in time
     */
    raw: (entity_id: ANY_ENTITY) =>
      internal.utils.object.get(MASTER_STATE, entity_id),

    /**
     * Initiates a refresh of the current entity states. Useful for ensuring
     * synchronization with the latest state data from Home Assistant.
     */
    refresh,

    /**
     * Interact with the entity registry
     */
    registry: {
      addLabel: AddLabel,
      current: [] as EntityRegistryItem<ANY_ENTITY>[],
      get: EntityGet,
      list: EntityList,
      registryList: EntityList,
      removeEntity: RemoveEntity,
      removeLabel: RemoveLabel,
      source: EntitySource,
    },

    warnEarly,
  };
}
