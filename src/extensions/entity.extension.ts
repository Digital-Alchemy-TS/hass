import {
  each,
  eachSeries,
  INCREMENT,
  is,
  SECOND,
  sleep,
  START,
  TAnyFunction,
  TServiceParams,
} from "@digital-alchemy/core";
import dayjs, { Dayjs } from "dayjs";
import EventEmitter from "events";
import { exit } from "process";
import { Get } from "type-fest";

import {
  ALL_DOMAINS,
  ByIdProxy,
  domain,
  EditLabelOptions,
  ENTITY_REGISTRY_UPDATED,
  ENTITY_STATE,
  EntityHistoryDTO,
  EntityHistoryItem,
  EntityHistoryResult,
  EntityRegistryItem,
  PICK_ENTITY,
  PICK_FROM_AREA,
  PICK_FROM_DEVICE,
  PICK_FROM_FLOOR,
  PICK_FROM_LABEL,
  TAreaId,
  TDeviceId,
  TFloorId,
  TLabelId,
  TPlatformId,
} from "..";

const MAX_ATTEMPTS = 10;
const UNLIMITED = 0;
const RECENT = 5;
export const ENTITY_UPDATE_RECEIVER = Symbol.for("entityUpdateReceiver");

export function EntityManager({
  logger,
  hass,
  config,
  lifecycle,
  event,
  context,
  internal: { utils },
}: TServiceParams) {
  // #MARK: Local vars
  /**
   * MASTER_STATE.switch.desk_light = {entity_id,state,attributes,...}
   */
  let MASTER_STATE = {} as Partial<
    Record<ALL_DOMAINS, Record<string, ENTITY_STATE<PICK_ENTITY>>>
  >;
  const ENTITY_PROXIES = new Map<PICK_ENTITY, ByIdProxy<PICK_ENTITY>>();
  const PREVIOUS_STATE = new Map<PICK_ENTITY, ENTITY_STATE<PICK_ENTITY>>();
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
  const ENTITY_EVENTS = new EventEmitter();
  ENTITY_EVENTS.setMaxListeners(UNLIMITED);
  let init = false;

  // #MARK: getCurrentState
  function getCurrentState<ENTITY_ID extends PICK_ENTITY>(
    entity_id: ENTITY_ID,
    // 🖕 TS
  ): NonNullable<ENTITY_STATE<ENTITY_ID>> {
    const out = utils.object.get(MASTER_STATE, entity_id) ?? {};
    return out as ENTITY_STATE<ENTITY_ID>;
  }

  // #MARK:proxyGetLogic
  function proxyGetLogic<
    ENTITY extends PICK_ENTITY = PICK_ENTITY,
    PROPERTY extends string = string,
  >(entity: ENTITY, property: PROPERTY): Get<ENTITY_STATE<ENTITY>, PROPERTY> {
    if (!init) {
      return undefined;
    }
    const valid = ["state", "attributes", "last"].some(i =>
      property.startsWith(i),
    );
    if (!valid) {
      logger.error(
        { entity, name: proxyGetLogic, property },
        `invalid property lookup`,
      );
      return undefined;
    }
    const current = getCurrentState(entity);
    const defaultValue = (property === "state" ? undefined : {}) as Get<
      ENTITY_STATE<ENTITY>,
      PROPERTY
    >;
    if (!current) {
      logger.error(
        { defaultValue, name: entity, property },
        `proxyGetLogic cannot find entity`,
      );
    }
    return utils.object.get(current, property) || defaultValue;
  }

  // #MARK: byId
  function byId<ENTITY_ID extends PICK_ENTITY>(
    entity_id: ENTITY_ID,
  ): ByIdProxy<ENTITY_ID> {
    if (!ENTITY_PROXIES.has(entity_id)) {
      ENTITY_PROXIES.set(
        entity_id,
        new Proxy(getCurrentState(entity_id) as ByIdProxy<ENTITY_ID>, {
          // things that shouldn't be needed: this extract
          get: (_, property: Extract<keyof ByIdProxy<ENTITY_ID>, string>) => {
            if (property === "onUpdate") {
              return (callback: TAnyFunction) => {
                const removableCallback = (
                  a: ENTITY_STATE<ENTITY_ID>,
                  b: ENTITY_STATE<ENTITY_ID>,
                ) => callback(a, b, remove);
                function remove() {
                  ENTITY_EVENTS.removeListener(entity_id, removableCallback);
                }
                ENTITY_EVENTS.on(entity_id, removableCallback);
                return { remove };
              };
            }
            if (property === "removeAllListeners") {
              return function () {
                ENTITY_EVENTS.removeAllListeners(entity_id);
              };
            }
            if (property === "once") {
              return (callback: TAnyFunction) =>
                ENTITY_EVENTS.once(entity_id, async (a, b) => callback(a, b));
            }
            if (property === "entity_id") {
              return entity_id;
            }
            if (property === "previous") {
              return PREVIOUS_STATE.get(entity_id);
            }
            if (property === "nextState") {
              return async () =>
                await new Promise<ENTITY_STATE<ENTITY_ID>>(done => {
                  ENTITY_EVENTS.once(
                    entity_id,
                    (entity: ENTITY_STATE<ENTITY_ID>) =>
                      done(entity satisfies ENTITY_STATE<ENTITY_ID>),
                  );
                });
            }
            return proxyGetLogic(entity_id, property);
          },
          set(
            _,
            property: Extract<keyof ByIdProxy<ENTITY_ID>, string>,
            value: unknown,
          ) {
            if (property === "state") {
              setImmediate(async () => {
                logger.debug(
                  { entity_id, state: value },
                  `emitting set state via rest`,
                );
                await hass.fetch.updateEntity(entity_id, {
                  state: value as string | number,
                });
              });
              return true;
            }
            if (property === "attributes") {
              if (!is.object(value)) {
                logger.error(`can only provide objects as attributes`);
                return false;
              }
              setImmediate(async () => {
                logger.debug(
                  { attributes: Object.keys(value), entity_id },
                  `updating attributes via rest`,
                );
                await hass.fetch.updateEntity(entity_id, { attributes: value });
              });
              return true;
            }
            logger.error(
              { entity_id, property },
              `cannot set property on entity`,
            );
            return false;
          },
        }),
      );
    }
    return ENTITY_PROXIES.get(entity_id) as ByIdProxy<ENTITY_ID>;
  }

  // #MARK: history
  async function history<ENTITES extends PICK_ENTITY[]>(
    payload: Omit<EntityHistoryDTO<ENTITES>, "type">,
  ) {
    logger.trace({ payload }, `looking up entity history`);
    const result = (await hass.socket.sendMessage({
      ...payload,
      end_time: dayjs(payload.end_time).toISOString(),
      start_time: dayjs(payload.start_time).toISOString(),
      type: "history/history_during_period",
    })) as Record<PICK_ENTITY, EntityHistoryItem[]>;

    const entities = Object.keys(result) as PICK_ENTITY[];
    return Object.fromEntries(
      entities.map((entity_id: PICK_ENTITY) => {
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
  function listEntities(): PICK_ENTITY[] {
    return Object.keys(MASTER_STATE).flatMap(domain =>
      Object.keys(MASTER_STATE[domain as ALL_DOMAINS]).map(
        id => `${domain}.${id}` as PICK_ENTITY,
      ),
    );
  }

  // #MARK: findByDomain
  function findByDomain<DOMAIN extends ALL_DOMAINS>(domain: DOMAIN) {
    return Object.keys(MASTER_STATE[domain] ?? {}).map(i =>
      byId(`${domain}.${i}` as PICK_ENTITY),
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
    const emitUpdates: ENTITY_STATE<PICK_ENTITY>[] = [];

    // - Go through all entities, setting the state
    // ~ If this is a refresh (not an initial boot), track what changed so events can be emitted
    states.forEach(entity => {
      // ? Set first, ensure data is populated
      // `nextTick` will fire AFTER loop finishes
      utils.object.set(
        MASTER_STATE,
        entity.entity_id,
        entity,
        is.undefined(utils.object.get(oldState, entity.entity_id)),
      );
      if (!init) {
        return;
      }
      const old = utils.object.get(oldState, entity.entity_id);
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
            entity satisfies ENTITY_STATE<PICK_ENTITY>,
            utils.object.get(oldState, entity.entity_id),
          ),
      );
    });
    init = true;
  }

  // #MARK: EntityUpdateReceiver
  function EntityUpdateReceiver<ENTITY extends PICK_ENTITY = PICK_ENTITY>(
    entity_id: PICK_ENTITY,
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
      utils.object.del(MASTER_STATE, entity_id);
      return;
    }
    utils.object.set(MASTER_STATE, entity_id, new_state);
    if (!hass.socket.pauseMessages) {
      ENTITY_EVENTS.emit(entity_id, new_state, old_state);
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
  }

  // #MARK: EntitySource
  async function EntitySource() {
    return await hass.socket.sendMessage<
      Record<PICK_ENTITY, { domain: string }>
    >({ type: "entity/source" });
  }

  // #MARK: EntityList
  async function EntityList() {
    return await hass.socket.sendMessage<EntityRegistryItem<PICK_ENTITY>[]>({
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
  async function EntityGet<ENTITY extends PICK_ENTITY>(entity_id: ENTITY) {
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

  // #MARK: byUniqueId
  function byUniqueId<ID extends PICK_ENTITY>(unique_id: string) {
    warnEarly("byUniqueId");
    const entity = hass.entity.registry.current.find(
      i => i.unique_id === unique_id,
    ) as EntityRegistryItem<ID>;
    if (!entity) {
      logger.error({ name: byUniqueId, unique_id }, `could not find an entity`);
      return undefined;
    }
    return hass.entity.byId<ID>(entity.entity_id);
  }

  // #MARK: byLabel
  function byLabel<LABEL extends TLabelId, DOMAIN extends ALL_DOMAINS>(
    label: LABEL,
    ...domains: DOMAIN[]
  ): PICK_FROM_LABEL<LABEL, DOMAIN>[] {
    warnEarly("byLabel");
    const raw = hass.entity.registry.current.filter(i =>
      i.labels.includes(label),
    );
    if (is.empty(domains)) {
      return raw.map(i => i.entity_id as PICK_FROM_LABEL<LABEL, DOMAIN>);
    }
    return raw
      .filter(entity =>
        domains.some(domain => is.domain(entity.entity_id, domain)),
      )
      .map(i => i.entity_id) as PICK_FROM_LABEL<LABEL, DOMAIN>[];
  }

  // #MARK: byArea
  function byArea<AREA extends TAreaId, DOMAIN extends ALL_DOMAINS>(
    area: AREA,
    ...domains: DOMAIN[]
  ): PICK_FROM_AREA<AREA, DOMAIN>[] {
    warnEarly("byArea");
    const raw = hass.entity.registry.current.filter(i => i.area_id === area);
    if (is.empty(domains)) {
      return raw.map(i => i.entity_id as PICK_FROM_AREA<AREA, DOMAIN>);
    }
    return raw
      .filter(entity =>
        domains.some(domain => is.domain(entity.entity_id, domain)),
      )
      .map(i => i.entity_id as PICK_FROM_AREA<AREA, DOMAIN>);
  }

  // #MARK: byDevice
  function byDevice<DEVICE extends TDeviceId, DOMAIN extends ALL_DOMAINS>(
    device: DEVICE,
    ...domains: DOMAIN[]
  ): PICK_FROM_DEVICE<DEVICE, DOMAIN>[] {
    warnEarly("byDevice");
    const raw = hass.entity.registry.current.filter(
      i => i.device_id === device,
    );
    if (is.empty(domains)) {
      return raw.map(i => i.entity_id as PICK_FROM_DEVICE<DEVICE, DOMAIN>);
    }
    return raw
      .filter(entity =>
        domains.some(domain => is.domain(entity.entity_id, domain)),
      )
      .map(i => i.entity_id as PICK_FROM_DEVICE<DEVICE, DOMAIN>);
  }

  // #MARK: byFloor
  function byFloor<FLOOR extends TFloorId, DOMAIN extends ALL_DOMAINS>(
    floor: FLOOR,
    ...domains: DOMAIN[]
  ): PICK_FROM_FLOOR<FLOOR, DOMAIN>[] {
    warnEarly("byFloor");
    const areas = new Set<TAreaId>(
      hass.area.current.filter(i => i.floor_id === floor).map(i => i.area_id),
    );
    const raw = hass.entity.registry.current.filter(i => areas.has(i.area_id));
    if (is.empty(domains)) {
      return raw.map(i => i.entity_id as PICK_FROM_FLOOR<FLOOR, DOMAIN>);
    }
    return raw
      .filter(entity =>
        domains.some(domain => is.domain(entity.entity_id, domain)),
      )
      .map(i => i.entity_id as PICK_FROM_FLOOR<FLOOR, DOMAIN>);
  }

  // #MARK: byPlatform
  function byPlatform<PLATFORM extends TPlatformId, DOMAIN extends ALL_DOMAINS>(
    platform: PLATFORM,
    ...domains: DOMAIN[]
  ) {
    warnEarly("byPlatform");
    const raw = hass.entity.registry.current
      .filter(i => i.platform === platform)
      .filter(i => i.platform === platform)
      .map(i => i.entity_id);
    if (is.empty(domains)) {
      return raw;
    }
    return raw.filter(i => domains.includes(domain(i) as DOMAIN));
  }

  // #MARK: RemoveEntity
  async function RemoveEntity(entity_id: PICK_ENTITY | PICK_ENTITY[]) {
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
    /**
     * Retrieve a list of entities listed as being part of a certain area
     * Tracks area updates at runtime
     */
    byArea,

    /**
     * Retrieve a list of entities associated with a particular device id
     */
    byDevice,

    /**
     * Retrieve a list of entities that have areas associated with a certain floor
     */
    byFloor,

    /**
     * Retrieves a proxy object for a specified entity. This proxy object
     * provides current values and event hooks for the entity.
     */
    byId,

    /**
     * Retrieve a list of entities that have a given label
     */
    byLabel,

    /**
     * search out ids by platform
     */
    byPlatform,

    /**
     * looks up entity_id reference by the unique id in the registry, and returns the entity reference
     */
    byUniqueId,

    /**
     * Internal library use only
     */
    entityUpdateReceiver: EntityUpdateReceiver,

    /**
     * Lists all entities within a specified domain. This is useful for
     * domain-specific operations or queries.
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
     * Retrieve the raw entity data for this point in time
     */
    raw: (id: PICK_ENTITY) => utils.object.get(MASTER_STATE, id),

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
      current: [] as EntityRegistryItem<PICK_ENTITY>[],
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
