import { DOWN, is, NONE, sleep, TAnyFunction, TServiceParams, UP } from "@digital-alchemy/core";
import dayjs, { Dayjs } from "dayjs";
import { Get } from "type-fest";

import { SERVICE_LIST_UPDATED } from "..";
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
  PICK_ENTITY,
  PICK_FROM_AREA,
  PICK_FROM_DEVICE,
  PICK_FROM_FLOOR,
  PICK_FROM_LABEL,
  PICK_FROM_PLATFORM,
} from "../helpers";

export function ReferenceExtension({ hass, logger, internal, event }: TServiceParams) {
  const ENTITY_PROXIES = new Map<ANY_ENTITY, ByIdProxy<ANY_ENTITY>>();
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
  function byId<ENTITY_ID extends ANY_ENTITY>(entity_id: ENTITY_ID): ByIdProxy<ENTITY_ID> {
    const entity_domain = domain(entity_id) as ALL_SERVICE_DOMAINS;
    if (!ENTITY_PROXIES.has(entity_id)) {
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
      ENTITY_PROXIES.set(
        entity_id,
        // just because you can't do generics properly....
        new Proxy(thing, {
          // things that shouldn't be needed: this extract
          // eslint-disable-next-line sonarjs/function-return-type
          get: (_, property: Extract<keyof ByIdProxy<ENTITY_ID>, string>) => {
            switch (property) {
              // * onUpdate
              case "onUpdate": {
                return (callback: TAnyFunction) => {
                  const removableCallback = async (
                    a: ENTITY_STATE<ENTITY_ID>,
                    b: ENTITY_STATE<ENTITY_ID>,
                  ) => await internal.safeExec(async () => callback(a, b, remove));
                  function remove() {
                    event.removeListener(entity_id, removableCallback);
                  }

                  event.on(entity_id, removableCallback);
                  return { remove };
                };
              }

              // * removeAllListeners
              case "removeAllListeners": {
                return function () {
                  event.removeAllListeners(entity_id);
                };
              }

              // * history
              case "history": {
                return async function (from: Dayjs | Date, to: Dayjs | Date) {
                  return await hass.fetch.fetchEntityHistory(entity_id, from, to);
                };
              }

              // * once
              case "once": {
                return (callback: TAnyFunction) =>
                  event.once(entity_id, async (a, b) => callback(a, b));
              }

              // * entity_id
              case "entity_id": {
                return entity_id;
              }

              // * previous
              case "previous": {
                return hass.entity.previousState(entity_id);
              }

              // * nextState
              case "nextState": {
                return async (timeout?: number) =>
                  await new Promise<ENTITY_STATE<ENTITY_ID>>(async done => {
                    const complete = (entity: ENTITY_STATE<ENTITY_ID>) => {
                      if (done) {
                        done(entity satisfies ENTITY_STATE<ENTITY_ID>);
                        done = undefined;
                      }
                    };
                    event.once(entity_id, complete);
                    if (is.number(timeout) && timeout > NONE) {
                      await sleep(timeout);
                      if (done) {
                        logger.debug({ entity_id, name: "nextState", timeout }, "timed out");
                        done(undefined);
                        done = undefined;
                        event.removeListener(entity_id, complete);
                      }
                    }
                  });
              }

              // * waitForState
              case "waitForState": {
                return async (state: string | number, timeout?: number) =>
                  await new Promise<ENTITY_STATE<ENTITY_ID>>(async done => {
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
                        done = undefined;
                        event.removeListener(entity_id, complete);
                      }
                    };
                    event.on(entity_id, complete);
                    if (is.number(timeout) && timeout > NONE) {
                      await sleep(timeout);
                      if (done) {
                        logger.debug({ entity_id, name: "waitForState", timeout }, "timed out");
                        done(undefined);
                        done = undefined;
                        event.removeListener(entity_id, complete);
                      }
                    }
                  });
              }
            }
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
          has(_, property: string) {
            appendKeys();
            return property in thing;
          },
          ownKeys() {
            appendKeys();
            return Object.keys(thing);
          },
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
        }),
      );
    }
    return ENTITY_PROXIES.get(entity_id) as ByIdProxy<ENTITY_ID>;
  }

  return {
    area: <AREA extends TAreaId, DOMAINS extends TRawDomains = TRawDomains>(
      area: AREA,
      ...domains: DOMAINS[]
    ): ByIdProxy<PICK_FROM_AREA<AREA, DOMAINS>>[] =>
      hass.idBy.area<AREA, DOMAINS>(area, ...domains).map(id => byId(id)),

    device: <DEVICE extends TDeviceId, DOMAINS extends TRawDomains = TRawDomains>(
      device: DEVICE,
      ...domains: DOMAINS[]
    ): ByIdProxy<PICK_FROM_DEVICE<DEVICE, DOMAINS>>[] =>
      hass.idBy.device<DEVICE, DOMAINS>(device, ...domains).map(id => byId(id)),

    domain: <DOMAIN extends TRawDomains = TRawDomains>(
      domain: DOMAIN,
    ): ByIdProxy<PICK_ENTITY<DOMAIN>>[] => hass.idBy.domain<DOMAIN>(domain).map(id => byId(id)),

    floor: <FLOOR extends TFloorId, DOMAINS extends TRawDomains = TRawDomains>(
      floor: FLOOR,
      ...domains: DOMAINS[]
    ): ByIdProxy<PICK_FROM_FLOOR<FLOOR, DOMAINS>>[] =>
      hass.idBy.floor<FLOOR, DOMAINS>(floor, ...domains).map(id => byId(id)),

    id: byId,

    label: <LABEL extends TLabelId, DOMAINS extends TRawDomains = TRawDomains>(
      label: LABEL,
      ...domains: DOMAINS[]
    ): ByIdProxy<PICK_FROM_LABEL<LABEL, DOMAINS>>[] =>
      hass.idBy.label<LABEL, DOMAINS>(label, ...domains).map(id => byId(id)),

    platform: <PLATFORM extends TPlatformId, DOMAINS extends TRawDomains = TRawDomains>(
      platform: PLATFORM,
      ...domains: DOMAINS[]
    ): ByIdProxy<PICK_FROM_PLATFORM<PLATFORM, DOMAINS>>[] =>
      hass.idBy.platform<PLATFORM, DOMAINS>(platform, ...domains).map(id => byId(id)),

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
        return undefined;
      }
      return byId(id);
    },
  };
}
