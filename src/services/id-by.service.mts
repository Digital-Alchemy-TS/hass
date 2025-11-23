import type { TServiceParams } from "@digital-alchemy/core";
import { FIRST, SINGLE } from "@digital-alchemy/core";

import type { EntityRegistryItem, IDByInterface } from "../index.mts";
import { domain } from "../index.mts";
import type {
  ALL_DOMAINS,
  ANY_ENTITY,
  HassUniqueIdMapping,
  PICK_FROM_AREA,
  PICK_FROM_DEVICE,
  PICK_FROM_FLOOR,
  PICK_FROM_LABEL,
  PICK_FROM_PLATFORM,
  TAreaId,
  TDeviceId,
  TFloorId,
  TLabelId,
  TPlatformId,
  TUniqueId,
} from "../user.mts";

export function IDByExtension({
  hass,
  logger,
  config,
  internal: {
    utils: { is },
  },
}: TServiceParams): IDByInterface {
  const check = <RAW extends ANY_ENTITY>(raw: RAW[], domains: ALL_DOMAINS[]) => {
    if (!is.empty(domains)) {
      raw = raw.filter(entity => is.domain(entity, domains));
    }
    return raw;
  };

  const getEntities = () =>
    config.hass.FILTER_DISABLED_ENTITIES_ID_BY
      ? hass.entity.registry.current.filter(i => is.empty(i.disabled_by))
      : hass.entity.registry.current;

  // * byDomain
  function byDomain<DOMAIN extends ALL_DOMAINS>(target: DOMAIN) {
    return getEntities()
      .map(i => i.entity_id)
      .filter(i => is.domain(i, target));
  }

  /**
   * unique_id
   *
   * ## Dev note on logic here
   *
   * unique_ids are not ACTUALLY unique when iterating through the registry from here
   * hacs does this a bunch, using a sensor with the same unique_id as an update entity
   *
   * The logic here will look up ALL entities with the "unique"_id, then check to see if there are multiple results
   * It is assumed by both this code and type-writer that the unique_id lookup will refer to the not update entity
   */
  function unique_id<
    UNIQUE_ID extends TUniqueId,
    ENTITY_ID extends Extract<HassUniqueIdMapping[UNIQUE_ID], ANY_ENTITY> = Extract<
      HassUniqueIdMapping[UNIQUE_ID],
      ANY_ENTITY
    >,
  >(unique_id: UNIQUE_ID, platform?: TPlatformId): ENTITY_ID {
    hass.entity.warnEarly("byUniqueId");
    let list = hass.entity.registry.current.filter(
      i => i.unique_id === unique_id,
    ) as EntityRegistryItem<ENTITY_ID>[];
    if (!is.empty(platform)) {
      list = list.filter(i => i.platform === platform);
    }
    if (is.empty(list)) {
      logger.error({ name: unique_id, unique_id }, `could not find an entity`);
      return undefined;
    }
    if (list.length > SINGLE) {
      const trimmed = list.filter(
        i =>
          // @ts-expect-error issue in dev types
          domain(i.entity_id) !== "update",
      );
      if (trimmed.length > SINGLE) {
        const available_entity_ids = trimmed.map(i => i.entity_id);
        logger.warn(
          { available_entity_ids, unique_id },
          `unique_id collision during lookup (chose first in list)`,
        );
      } else {
        logger.trace(
          { unique_id },
          `chose {%s} over update entity during lookup`,
          trimmed[FIRST].entity_id,
        );
      }
      list = trimmed;
    }
    const [entity] = list;
    if (config.hass.FILTER_DISABLED_ENTITIES_ID_BY && !is.empty(entity?.disabled_by)) {
      logger.debug(
        { entity_id: entity?.entity_id, unique_id },
        `access disabled entity by unique_id`,
      );
    }
    return entity?.entity_id;
  }

  // * label
  function label<LABEL extends TLabelId, DOMAIN extends ALL_DOMAINS>(
    label: LABEL,
    ...domains: DOMAIN[]
  ) {
    hass.entity.warnEarly("label");
    return check(
      getEntities()
        .filter(i => i.labels.includes(label))
        .map(i => i.entity_id as PICK_FROM_LABEL<LABEL, DOMAIN>),
      domains,
    );
  }

  // * area
  function area<AREA extends TAreaId, DOMAIN extends ALL_DOMAINS>(
    area: AREA,
    ...domains: DOMAIN[]
  ) {
    hass.entity.warnEarly("area");

    // find entities are associated with the area directly
    const entities = getEntities();
    const fromEntity = entities.filter(i => i.area_id === area).map(i => i.entity_id);

    // identify devices
    const devices = new Set(
      hass.device.current.filter(device => device.area_id === area).map(i => i.id),
    );

    // extract entities associated with device, that have not been assigned to a room
    const fromDevice = entities
      .filter(entity => devices.has(entity.device_id) && is.empty(entity.area_id))
      .map(i => i.entity_id);

    return check(
      // merge lists
      is.unique([...fromEntity, ...fromDevice]),
      domains,
    ) as PICK_FROM_AREA<AREA, DOMAIN>[];
  }

  // * device
  function device<DEVICE extends TDeviceId, DOMAIN extends ALL_DOMAINS>(
    device: DEVICE,
    ...domains: DOMAIN[]
  ): PICK_FROM_DEVICE<DEVICE, DOMAIN>[] {
    hass.entity.warnEarly("device");
    return check(
      getEntities()
        .filter(i => i.device_id === device)
        .map(i => i.entity_id as PICK_FROM_DEVICE<DEVICE, DOMAIN>),
      domains,
    );
  }

  // * floor
  function floor<FLOOR extends TFloorId, DOMAIN extends ALL_DOMAINS>(
    floor: FLOOR,
    ...domains: DOMAIN[]
  ): PICK_FROM_FLOOR<FLOOR, DOMAIN>[] {
    hass.entity.warnEarly("floor");
    const areas = new Set<TAreaId>(
      hass.area.current.filter(i => i.floor_id === floor).map(i => i.area_id),
    );
    return check(
      getEntities()
        .filter(i => areas.has(i.area_id))
        .map(i => i.entity_id as PICK_FROM_FLOOR<FLOOR, DOMAIN>),
      domains,
    );
  }

  // * platform
  function platform<PLATFORM extends TPlatformId, DOMAIN extends ALL_DOMAINS>(
    platform: PLATFORM,
    ...domains: DOMAIN[]
  ): PICK_FROM_PLATFORM<PLATFORM, DOMAIN>[] {
    hass.entity.warnEarly("platform");
    return check(
      getEntities()
        .filter(i => i.platform === platform)
        .map(i => i.entity_id as PICK_FROM_PLATFORM<PLATFORM, DOMAIN>),
      domains,
    );
  }

  return {
    area,
    device,
    domain: byDomain,
    floor,
    label,
    platform,
    unique_id,
  };
}
