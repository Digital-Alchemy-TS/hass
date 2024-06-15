import { is, TAnyFunction, TServiceParams } from "@digital-alchemy/core";
import dayjs from "dayjs";
import { Get } from "type-fest";

import {
  TAreaId,
  TDeviceId,
  TFloorId,
  TLabelId,
  TPlatformId,
  TRawDomains,
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

export function ReferenceExtension({ hass, logger, internal }: TServiceParams) {
  const ENTITY_PROXIES = new Map<ANY_ENTITY, ByIdProxy<ANY_ENTITY>>();
  // #MARK:proxyGetLogic
  function proxyGetLogic<
    ENTITY extends ANY_ENTITY = ANY_ENTITY,
    PROPERTY extends string = string,
  >(entity: ENTITY, property: PROPERTY): Get<ENTITY_STATE<ENTITY>, PROPERTY> {
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
    const current = hass.entity.getCurrentState(entity);
    if (!current) {
      logger.error(
        { name: entity, property },
        `proxyGetLogic cannot find entity`,
      );
    }
    if (property.startsWith("last")) {
      const value = internal.utils.object.get(current, property) as string;
      return dayjs(value) as Get<ENTITY_STATE<ENTITY>, PROPERTY>;
    }

    const defaultValue = (property === "state" ? undefined : {}) as Get<
      ENTITY_STATE<ENTITY>,
      PROPERTY
    >;
    return internal.utils.object.get(current, property) || defaultValue;
  }

  // #MARK: byId
  function byId<ENTITY_ID extends ANY_ENTITY>(
    entity_id: ENTITY_ID,
  ): ByIdProxy<ENTITY_ID> {
    const entity_domain = domain(entity_id) as ALL_SERVICE_DOMAINS;
    if (!ENTITY_PROXIES.has(entity_id)) {
      const thing = hass.entity.getCurrentState(
        entity_id,
      ) as ByIdProxy<ENTITY_ID>;
      ENTITY_PROXIES.set(
        entity_id,
        // @ts-expect-error this is valid, shut up typescript
        // just because you can't do generics properly....
        new Proxy(thing, {
          // things that shouldn't be needed: this extract
          get: (_, property: Extract<keyof ByIdProxy<ENTITY_ID>, string>) => {
            if (property === "onUpdate") {
              return (callback: TAnyFunction) => {
                const removableCallback = async (
                  a: ENTITY_STATE<ENTITY_ID>,
                  b: ENTITY_STATE<ENTITY_ID>,
                ) =>
                  await internal.safeExec(async () => callback(a, b, remove));
                function remove() {
                  hass.entity
                    ._entityEvents()
                    .removeListener(entity_id, removableCallback);
                }

                hass.entity._entityEvents().on(entity_id, removableCallback);
                return { remove };
              };
            }
            if (property === "removeAllListeners") {
              return function () {
                hass.entity._entityEvents().removeAllListeners(entity_id);
              };
            }
            if (property === "once") {
              return (callback: TAnyFunction) =>
                hass.entity
                  ._entityEvents()
                  .once(entity_id, async (a, b) => callback(a, b));
            }
            if (property === "entity_id") {
              return entity_id;
            }
            if (property === "previous") {
              return hass.entity.previousState(entity_id);
            }
            if (property === "nextState") {
              return async () =>
                await new Promise<ENTITY_STATE<ENTITY_ID>>(done => {
                  hass.entity
                    ._entityEvents()
                    .once(entity_id, (entity: ENTITY_STATE<ENTITY_ID>) =>
                      done(entity satisfies ENTITY_STATE<ENTITY_ID>),
                    );
                });
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
                await hass.fetch.updateEntity(entity_id, {
                  attributes: value,
                });
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

  return {
    area: <AREA extends TAreaId, DOMAINS extends TRawDomains = TRawDomains>(
      area: AREA,
      ...domains: DOMAINS[]
    ): ByIdProxy<PICK_FROM_AREA<AREA, DOMAINS>>[] =>
      hass.idBy.area<AREA, DOMAINS>(area, ...domains).map(id => byId(id)),

    device: <
      DEVICE extends TDeviceId,
      DOMAINS extends TRawDomains = TRawDomains,
    >(
      device: DEVICE,
      ...domains: DOMAINS[]
    ): ByIdProxy<PICK_FROM_DEVICE<DEVICE, DOMAINS>>[] =>
      hass.idBy.device<DEVICE, DOMAINS>(device, ...domains).map(id => byId(id)),

    domain: <DOMAIN extends TRawDomains = TRawDomains>(
      domain: DOMAIN,
    ): ByIdProxy<PICK_ENTITY<DOMAIN>>[] =>
      hass.idBy.domain<DOMAIN>(domain).map(id => byId(id)),

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

    platform: <
      PLATFORM extends TPlatformId,
      DOMAINS extends TRawDomains = TRawDomains,
    >(
      platform: PLATFORM,
      ...domains: DOMAINS[]
    ): ByIdProxy<PICK_FROM_PLATFORM<PLATFORM, DOMAINS>>[] =>
      hass.idBy
        .platform<PLATFORM, DOMAINS>(platform, ...domains)
        .map(id => byId(id)),

    unique_id: <ID extends ANY_ENTITY>(unique_id: string): ByIdProxy<ID> => {
      const id = hass.idBy.unique_id<ID>(unique_id);
      return id ? byId(id) : undefined;
    },
  };
}
