import {
  each,
  INCREMENT,
  is,
  SECOND,
  sleep,
  START,
  TAnyFunction,
  TBlackHole,
  TServiceParams,
} from "@digital-alchemy/core";
import dayjs, { Dayjs } from "dayjs";
import EventEmitter from "events";
import { exit } from "process";
import { Get } from "type-fest";

import {
  ALL_DOMAINS,
  EditLabelOptions,
  ENTITY_STATE,
  EntityHistoryDTO,
  EntityHistoryResult,
  EntityRegistryItem,
  HASSIO_WS_COMMAND,
  PICK_ENTITY,
  UPDATE_REGISTRY,
} from "..";

type EntityHistoryItem = { a: object; s: unknown; lu: number };
export const ENTITY_UPDATE_RECEIVER = Symbol.for("entityUpdateReceiver");
export type ByIdProxy<ENTITY_ID extends PICK_ENTITY> =
  ENTITY_STATE<ENTITY_ID> & {
    entity_id: ENTITY_ID;
    /**
     * Run callback
     */
    onUpdate: (
      callback: (
        new_state: NonNullable<ENTITY_STATE<ENTITY_ID>>,
        old_state: NonNullable<ENTITY_STATE<ENTITY_ID>>,
      ) => TBlackHole,
    ) => void;
    /**
     * Run callback once, for next update
     */
    once: (
      callback: (
        new_state: NonNullable<ENTITY_STATE<ENTITY_ID>>,
        old_state: NonNullable<ENTITY_STATE<ENTITY_ID>>,
      ) => TBlackHole,
    ) => void;
    /**
     * Will resolve with the next state of the next value. No time limit
     */
    nextState: () => Promise<ENTITY_STATE<ENTITY_ID>>;
    /**
     * Access the immediate previous entity state
     */
    previous: ENTITY_STATE<ENTITY_ID>;
  };

const MAX_ATTEMPTS = 50;
const FAILED_LOAD_DELAY = 5;
const UNLIMITED = 0;
const RECENT = 5;

export function EntityManager({
  logger,
  hass,
  lifecycle,
  internal,
}: TServiceParams) {
  // # Local vars
  /**
   * MASTER_STATE.switch.desk_light = {entity_id,state,attributes,...}
   */
  let MASTER_STATE = {} as Partial<
    Record<ALL_DOMAINS, Record<string, ENTITY_STATE<PICK_ENTITY>>>
  >;
  const ENTITY_PROXIES = new Map<PICK_ENTITY, ByIdProxy<PICK_ENTITY>>();
  const PREVIOUS_STATE = new Map<PICK_ENTITY, ENTITY_STATE<PICK_ENTITY>>();
  let lastRefresh: Dayjs;

  // * Local event emitter for coordination of socket events
  // Other libraries will internally take advantage of this eventemitter
  const event = new EventEmitter();
  event.setMaxListeners(UNLIMITED);
  let init = false;

  // # Methods
  // ## Retrieve raw state object for entity
  function getCurrentState<ENTITY_ID extends PICK_ENTITY>(
    entity_id: ENTITY_ID,
    // 🖕 TS
  ): NonNullable<ENTITY_STATE<ENTITY_ID>> {
    const out = internal.utils.object.get(MASTER_STATE, entity_id) ?? {};
    return out as ENTITY_STATE<ENTITY_ID>;
  }

  // ## Proxy version of the logic
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
    return internal.utils.object.get(current, property) || defaultValue;
  }

  // ## Retrieve a proxy by id
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
              return (callback: TAnyFunction) =>
                event.on(entity_id, async (a, b) => callback(a, b));
            }
            if (property === "once") {
              return (callback: TAnyFunction) =>
                event.once(entity_id, async (a, b) => callback(a, b));
            }
            if (property === "entity_id") {
              return entity_id;
            }
            if (property === "previous") {
              return PREVIOUS_STATE.get(entity_id);
            }
            if (property === "nextState") {
              return new Promise<ENTITY_STATE<ENTITY_ID>>(done => {
                event.once(entity_id, (entity: ENTITY_STATE<ENTITY_ID>) =>
                  done(entity as ENTITY_STATE<ENTITY_ID>),
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

  // ## Retrieve entity history (via socket)
  async function history<ENTITES extends PICK_ENTITY[]>(
    payload: Omit<EntityHistoryDTO<ENTITES>, "type">,
  ) {
    logger.trace({ payload }, `looking up entity history`);
    const result = (await hass.socket.sendMessage({
      ...payload,
      end_time: dayjs(payload.end_time).toISOString(),
      start_time: dayjs(payload.start_time).toISOString(),
      type: HASSIO_WS_COMMAND.history_during_period,
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

  // ## Build a string array of all known entity ids
  function listEntities(): PICK_ENTITY[] {
    return Object.keys(MASTER_STATE).flatMap(domain =>
      Object.keys(MASTER_STATE[domain as ALL_DOMAINS]).map(
        id => `${domain}.${id}` as PICK_ENTITY,
      ),
    );
  }

  // ## Gather all entity proxies for a domain
  function findByDomain<DOMAIN extends ALL_DOMAINS>(domain: DOMAIN) {
    return Object.keys(MASTER_STATE[domain] ?? {}).map(i =>
      byId(`${domain}.${i}` as PICK_ENTITY),
    );
  }

  // ## Load all entity state information from hass
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
    if (is.empty(states)) {
      if (recursion > MAX_ATTEMPTS) {
        logger.fatal(
          { name: refresh },
          `failed to load service list from Home Assistant. validate configuration`,
        );
        exit();
      }
      logger.warn(
        { name: refresh },
        "failed to retrieve entity list. retrying {%s}/[%s]",
        recursion,
        MAX_ATTEMPTS,
      );
      await sleep(FAILED_LOAD_DELAY * SECOND);
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
            entity as ENTITY_STATE<PICK_ENTITY>,
            internal.utils.object.get(oldState, entity.entity_id),
          ),
      );
    });
    init = true;
  }

  // ## is.entity definition
  // Actually tie the type casting to real state
  is.entity = (entityId: PICK_ENTITY): entityId is PICK_ENTITY =>
    is.undefined(internal.utils.object.get(MASTER_STATE, entityId));

  // ## Receiver function for incoming entity updates
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
      internal.utils.object.del(MASTER_STATE, entity_id);
      return;
    }
    internal.utils.object.set(MASTER_STATE, entity_id, new_state);
    if (!hass.socket.pauseMessages) {
      event.emit(entity_id, new_state, old_state);
    }
  }

  lifecycle.onPostConfig(async () => {
    logger.debug({ name: "onPostConfig" }, `pre populate {MASTER_STATE}`);
    await refresh();
  });

  async function AddLabel({ entity, label }: EditLabelOptions) {
    const current = await EntityGet(entity);
    if (current?.labels?.includes(label)) {
      logger.debug({ name: entity }, `already has label {%s}`, label);
      return;
    }
    await hass.socket.sendMessage({
      entity_id: entity,
      labels: [...current.labels, label],
      type: UPDATE_REGISTRY,
    });
  }

  async function EntitySource() {
    return await hass.socket.sendMessage<
      Record<PICK_ENTITY, { domain: string }>
    >({ type: "entity/source" });
  }

  async function EntityList() {
    await hass.socket.sendMessage({
      type: "config/entity_registry/list_for_display",
    });
  }

  async function RemoveLabel({ entity, label }: EditLabelOptions) {
    const current = await EntityGet(entity);
    if (!current?.labels?.includes(label)) {
      logger.debug({ name: entity }, `does not have label {%s}`, label);
      return;
    }
    logger.debug({ name: entity }, `removing label [%s]`, label);
    await hass.socket.sendMessage({
      entity_id: entity,
      labels: current.labels.filter(i => i !== label),
      type: UPDATE_REGISTRY,
    });
  }

  async function EntityGet<ENTITY extends PICK_ENTITY>(entity_id: ENTITY) {
    return await hass.socket.sendMessage<EntityRegistryItem<ENTITY>>({
      entity_id: entity_id,
      type: "config/entity_registry/get",
    });
  }

  return {
    /**
     * Internal library use only
     */
    [ENTITY_UPDATE_RECEIVER]: EntityUpdateReceiver,

    /**
     * Retrieves a proxy object for a specified entity. This proxy object
     * provides current values and event hooks for the entity.
     */
    byId,

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
     * Initiates a refresh of the current entity states. Useful for ensuring
     * synchronization with the latest state data from Home Assistant.
     */
    refresh,

    registry: {
      addLabel: AddLabel,
      get: EntityGet,
      list: EntityList,
      removeLabel: RemoveLabel,
      source: EntitySource,
    },
  };
}

declare module "@digital-alchemy/core" {
  export interface IsIt {
    entity(entity: PICK_ENTITY): entity is PICK_ENTITY;
  }
}
