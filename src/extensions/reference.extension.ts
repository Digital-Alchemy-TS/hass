import { DOWN, is, NONE, sleep, TAnyFunction, TServiceParams, UP } from "@digital-alchemy/core";
import dayjs, { Dayjs } from "dayjs";
import { Get } from "type-fest";

import { SERVICE_LIST_UPDATED, SOCKET_CONNECTED } from "..";
import {
  TAreaId,
  TDeviceId,
  TFloorId,
  TLabelId,
  TPlatformId,
  TRawDomains,
  TUniqueId,
  TUniqueIDMapping,
} from "../dynamic";
import {
  ALL_SERVICE_DOMAINS,
  ANY_ENTITY,
  ByIdProxy,
  domain,
  ENTITY_STATE,
  HassReferenceService,
  PICK_ENTITY,
  PICK_FROM_AREA,
  PICK_FROM_DEVICE,
  PICK_FROM_FLOOR,
  PICK_FROM_LABEL,
  PICK_FROM_PLATFORM,
} from "../helpers";

/**
 * ## Overview
 *
 * This service is intended for the creation of type safe entity references based on entity id.
 *
 * ```typescript
 * const ref = hass.refBy.id("switch.example");
 * ```
 *
 * These contain specialized type definitions that gets looked up by entity id, making typescript report info about the desired entity.
 *
 * ## Capabilities
 *
 * ### Event Listeners
 *
 * Run a callback in response to
 * - `.onUpdate((new_state, old_state) => ...)`
 * - `.once((new_state, old_state) => ...)`
 *
 * ### State lookups
 *
 * - `.nextState(timeout?)`
 * - `.waitForState(state, timeout?)`
 * - `.previous.state` | `.previous.attributes`
 *
 * ### Service Calling
 *
 * For services that appear on the same domain as the provided entity, the service call can be made directly from the reference.
 *
 * >  Ex: `switch.example` calling `switch.turn_on`
 *
 * ```typescript
 * ref.turn_on();
 * ```
 *
 * The `entity_id` property that would normally be required is automatically provided by the proxy.
 *
 * ### Property Lookups
 *
 * - `.state`
 * - `.entity_id`
 * - `.attributes`
 *
 * ## Garbage Collection
 *
 * - `.removeAllListeners()`
 *
 * The reference may call the remove all active event listeners and timers at any time.
 * It will interrupt any timers (nextState/waitForState), as well as detach any event listeners
 */
export function ReferenceService({
  hass,
  logger,
  internal,
  event,
}: TServiceParams): HassReferenceService {
  // #MARK:proxyGetLogic
  function proxyGetLogic<ENTITY extends ANY_ENTITY = ANY_ENTITY, PROPERTY extends string = string>(
    entity: ENTITY,
    property: PROPERTY,
  ): Get<ENTITY_STATE<ENTITY>, PROPERTY> {
    const valid = ["state", "attributes", "last"].some(i => property.startsWith(i));
    if (!valid) {
      logger.error({ entity, name: proxyGetLogic, property }, `invalid property lookup`);
      return undefined;
    }
    const current = hass.entity.getCurrentState(entity);
    if (!current) {
      logger.error({ name: entity, property }, `proxyGetLogic cannot find entity`);
    }
    if (property.startsWith("last")) {
      const value = internal.utils.object.get(current, property) as string;
      return dayjs(value) as Get<ENTITY_STATE<ENTITY>, PROPERTY>;
    }
    if (property === "state") {
      if (domain(entity) === "sensor" && is.number(Number(current.state))) {
        return Number(current.state) as Get<ENTITY_STATE<ENTITY>, PROPERTY>;
      }
      return current.state as Get<ENTITY_STATE<ENTITY>, PROPERTY>;
    }

    return (current.attributes || {}) as Get<ENTITY_STATE<ENTITY>, PROPERTY>;
  }

  // #MARK: byId
  // ! Calls to this function MUST ALWAYS go through `hass.refBy.id`
  // never call this function directly 💧
  function byId<ENTITY_ID extends ANY_ENTITY>(entity_id: ENTITY_ID): ByIdProxy<ENTITY_ID> {
    const entity_domain = domain(entity_id) as ALL_SERVICE_DOMAINS;
    const { ...thing } = hass.entity.getCurrentState(entity_id) as ByIdProxy<ENTITY_ID>;
    let loaded = false;

    function keys() {
      const entityDomain = domain(entity_id);
      return [
        "attributes",
        "entity_id",
        "history",
        "last",
        "nextState",
        "once",
        "onUpdate",
        "previous",
        "removeAllListeners",
        "state",
        "waitForState",
        ...hass.configure
          .getServices()
          .filter(({ domain }) => domain === entityDomain)
          .flatMap(i => Object.keys(i.services))
          .sort((a, b) => (a > b ? UP : DOWN)),
      ];
    }

    function appendKeys(force = false) {
      if (loaded && !force) {
        return;
      }
      // Not gonna build types for this, and ts-expect-error fails in jest
      // This is a weird hack for an obscure feature, so sue me
      //
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      keys().forEach(i => (thing[i] ??= () => {}));
      if (!is.empty(hass.configure.getServices())) {
        loaded = true;
      }
    }

    event.on(SERVICE_LIST_UPDATED, () => appendKeys(true));
    const listeners = new Set<() => void>();

    // just because you can't do generics properly....
    return new Proxy(thing, {
      // things that shouldn't be needed: this extract
      // eslint-disable-next-line sonarjs/function-return-type
      get: (_, property: Extract<keyof ByIdProxy<ENTITY_ID>, string>) => {
        switch (property) {
          // #MARK: onUpdate
          case "onUpdate": {
            return (callback: TAnyFunction) => {
              const removableCallback = async (
                new_state: ENTITY_STATE<ENTITY_ID>,
                old_state: ENTITY_STATE<ENTITY_ID>,
              ) => await internal.safeExec(async () => callback(new_state, old_state, remove));
              function remove() {
                event.removeListener(entity_id, removableCallback);
                event.removeListener(SOCKET_CONNECTED, removableCallback);
                listeners.delete(remove);
                logger.trace({ entity_id }, "remove [onUpdate] listener");
              }

              event.on(entity_id, removableCallback);
              event.on(SOCKET_CONNECTED, removableCallback);
              listeners.add(remove);

              return is.removeFn(remove);
            };
          }

          // #MARK: removeAllListeners
          case "removeAllListeners": {
            return function () {
              // remove will delete from set
              listeners.forEach(remove => remove());
            };
          }

          // #MARK: history
          case "history": {
            return async function (from: Dayjs | Date, to: Dayjs | Date) {
              return await hass.fetch.fetchEntityHistory(entity_id, from, to);
            };
          }

          // #MARK: once
          case "once": {
            return (callback: TAnyFunction) => {
              const remove = () => {
                event.removeListener(entity_id, wrapped);
                listeners.delete(remove);
                logger.trace({ entity_id }, "remove [once] listener");
              };
              const wrapped = async (a: ENTITY_STATE<ENTITY_ID>, b: ENTITY_STATE<ENTITY_ID>) => {
                listeners.delete(remove);
                callback(a, b);
              };
              listeners.add(remove);
              event.once(entity_id, wrapped);
              return is.removeFn(remove);
            };
          }

          // #MARK: entity_id
          case "entity_id": {
            return entity_id;
          }

          // #MARK: previous
          case "previous": {
            return hass.entity.previousState(entity_id);
          }

          // #MARK: nextState
          case "nextState": {
            return async (timeout?: number) =>
              await new Promise<ENTITY_STATE<ENTITY_ID>>(async done => {
                // - set up cleanup function
                const remove = () => {
                  listeners.delete(remove);
                  event.removeListener(entity_id, complete);
                  done = undefined;
                  logger.trace({ entity_id }, "remove [nextState] listener");
                  if (wait) {
                    logger.trace({ entity_id }, "stopping [nextState] race timer");
                    wait.kill("stop");
                  }
                };
                listeners.add(remove);

                // - add wrapper & make friendly with race
                const complete = (entity: ENTITY_STATE<ENTITY_ID>) => {
                  if (done) {
                    done(entity satisfies ENTITY_STATE<ENTITY_ID>);
                    done = undefined;
                  }
                };

                // - attach single run listener
                event.once(entity_id, complete);

                // - race!
                let wait: ReturnType<typeof sleep>;
                if (is.number(timeout) && timeout > NONE) {
                  // keep track of sleep so it can be cleaned up also
                  wait = sleep(timeout);
                  await wait;
                  wait = undefined;
                  if (done) {
                    logger.debug({ entity_id, name: "nextState", timeout }, "timed out");
                    done(undefined);
                    remove();
                  }
                }
              });
          }

          // #MARK: waitForState
          case "waitForState": {
            return async (state: string | number, timeout?: number) =>
              await new Promise<ENTITY_STATE<ENTITY_ID>>(async done => {
                const remove = () => {
                  done = undefined;
                  listeners.delete(remove);
                  done = undefined;
                  logger.trace({ entity_id }, "remove [waitForState] listener");
                  if (wait) {
                    logger.trace({ entity_id }, "stopping [waitForState] race timer");

                    wait.kill("stop");
                  }
                  event.removeListener(entity_id, complete);
                };
                listeners.add(remove);

                const complete = (entity: ENTITY_STATE<ENTITY_ID>) => {
                  if (entity.state !== state) {
                    logger.trace(
                      {
                        expected: state,
                        incoming: entity.state,
                        name: "waitForState",
                      },
                      `state did not match`,
                    );
                    return;
                  }
                  if (done) {
                    done(entity satisfies ENTITY_STATE<ENTITY_ID>);
                    remove();
                  }
                };

                event.on(entity_id, complete);
                let wait: ReturnType<typeof sleep>;
                if (is.number(timeout) && timeout > NONE) {
                  wait = sleep(timeout);
                  await wait;
                  wait = undefined;
                  if (done) {
                    logger.debug({ entity_id, name: "waitForState", timeout }, "timed out");
                    done(undefined);
                    remove();
                  }
                }
              });
          }
        }
        // #MARK: service calls
        if (hass.configure.isService(entity_domain, property)) {
          return async function (data = {}) {
            // @ts-expect-error it's fine
            return await hass.call[entity_domain][property]({
              entity_id,
              ...data,
            });
          };
        }
        return proxyGetLogic(entity_id, property);
      },
      // #MARK: has
      has(_, property: string) {
        appendKeys();
        return property in thing;
      },
      // #MARK: ownKeys
      ownKeys() {
        appendKeys();
        return Object.keys(thing);
      },
      // #MARK: set
      set(_, property: Extract<keyof ByIdProxy<ENTITY_ID>, string>, value: unknown) {
        // * state
        if (property === "state") {
          setImmediate(async () => {
            logger.debug({ entity_id, state: value }, `emitting set state via rest`);
            await hass.fetch.updateEntity(entity_id, {
              state: value as string | number,
            });
          });
          return true;
        }
        // * attributes
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
            await hass.fetch.updateEntity(entity_id, {
              attributes: value,
            });
          });
          return true;
        }
        logger.error({ entity_id, property }, `cannot set property on entity`);
        return false;
      },
    });
  }

  // #MARK: <return>
  return {
    area: <AREA extends TAreaId, DOMAINS extends TRawDomains = TRawDomains>(
      area: AREA,
      ...domains: DOMAINS[]
    ): ByIdProxy<PICK_FROM_AREA<AREA, DOMAINS>>[] =>
      hass.idBy.area<AREA, DOMAINS>(area, ...domains).map(id => hass.refBy.id(id)),

    device: <DEVICE extends TDeviceId, DOMAINS extends TRawDomains = TRawDomains>(
      device: DEVICE,
      ...domains: DOMAINS[]
    ): ByIdProxy<PICK_FROM_DEVICE<DEVICE, DOMAINS>>[] =>
      hass.idBy.device<DEVICE, DOMAINS>(device, ...domains).map(id => hass.refBy.id(id)),

    domain: <DOMAIN extends TRawDomains = TRawDomains>(
      domain: DOMAIN,
    ): ByIdProxy<PICK_ENTITY<DOMAIN>>[] =>
      hass.idBy.domain<DOMAIN>(domain).map(id => hass.refBy.id(id)),

    floor: <FLOOR extends TFloorId, DOMAINS extends TRawDomains = TRawDomains>(
      floor: FLOOR,
      ...domains: DOMAINS[]
    ): ByIdProxy<PICK_FROM_FLOOR<FLOOR, DOMAINS>>[] =>
      hass.idBy.floor<FLOOR, DOMAINS>(floor, ...domains).map(id => hass.refBy.id(id)),

    id: byId,

    label: <LABEL extends TLabelId, DOMAINS extends TRawDomains = TRawDomains>(
      label: LABEL,
      ...domains: DOMAINS[]
    ): ByIdProxy<PICK_FROM_LABEL<LABEL, DOMAINS>>[] =>
      hass.idBy.label<LABEL, DOMAINS>(label, ...domains).map(id => hass.refBy.id(id)),

    platform: <PLATFORM extends TPlatformId, DOMAINS extends TRawDomains = TRawDomains>(
      platform: PLATFORM,
      ...domains: DOMAINS[]
    ): ByIdProxy<PICK_FROM_PLATFORM<PLATFORM, DOMAINS>>[] =>
      hass.idBy.platform<PLATFORM, DOMAINS>(platform, ...domains).map(id => hass.refBy.id(id)),

    unique_id: <
      UNIQUE_ID extends TUniqueId,
      ENTITY_ID extends Extract<TUniqueIDMapping[UNIQUE_ID], ANY_ENTITY> = Extract<
        TUniqueIDMapping[UNIQUE_ID],
        ANY_ENTITY
      >,
    >(
      unique_id: UNIQUE_ID,
    ): ByIdProxy<ENTITY_ID> => {
      const id = hass.idBy.unique_id<UNIQUE_ID, ENTITY_ID>(unique_id);
      if (!id) {
        // mental note:
        // this is technically fixable, but would require emitting internal events
        // for both entity_id & unique_id
        return undefined;
      }
      return hass.refBy.id(id);
    },
  };
}
