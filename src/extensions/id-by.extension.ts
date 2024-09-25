import { is, TServiceParams } from "@digital-alchemy/core";

import {
  TAreaId,
  TDeviceId,
  TFloorId,
  TLabelId,
  TPlatformId,
  TUniqueId,
  TUniqueIDMapping,
} from "../dynamic";
import {
  ALL_DOMAINS,
  ANY_ENTITY,
  EntityRegistryItem,
  IDByInterface,
  PICK_ENTITY,
  PICK_FROM_AREA,
  PICK_FROM_DEVICE,
  PICK_FROM_FLOOR,
  PICK_FROM_LABEL,
  PICK_FROM_PLATFORM,
} from "../helpers";

const check = <RAW extends ANY_ENTITY>(raw: RAW[], domains: ALL_DOMAINS[]) => {
  if (!is.empty(domains)) {
    raw = raw.filter(entity => is.domain(entity, domains));
  }
  return raw;
};

export function IDByExtension({ hass, logger }: TServiceParams): IDByInterface {
  // * byDomain
  function byDomain<DOMAIN extends ALL_DOMAINS>(domain: DOMAIN) {
    const MASTER_STATE = hass.entity._masterState();
    return Object.keys(MASTER_STATE[domain] ?? {}).map(
      id => `${domain}.${id}` as PICK_ENTITY<DOMAIN>,
    );
  }

  // * unique_id
  function unique_id<
    UNIQUE_ID extends TUniqueId,
    ENTITY_ID extends Extract<TUniqueIDMapping[UNIQUE_ID], ANY_ENTITY> = Extract<
      TUniqueIDMapping[UNIQUE_ID],
      ANY_ENTITY
    >,
  >(unique_id: UNIQUE_ID): ENTITY_ID {
    hass.entity.warnEarly("byUniqueId");
    const entity = hass.entity.registry.current.find(
      i => i.unique_id === unique_id,
    ) as EntityRegistryItem<ENTITY_ID>;
    if (!entity) {
      logger.error({ name: unique_id, unique_id }, `could not find an entity`);
      return undefined;
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
      hass.entity.registry.current
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
    const fromEntity = hass.entity.registry.current
      .filter(i => i.area_id === area)
      .map(i => i.entity_id);

    // identify devices
    const devices = new Set(
      hass.device.current.filter(device => device.area_id === area).map(i => i.id),
    );

    // extract entities associated with device, that have not been assigned to a room
    const fromDevice = hass.entity.registry.current
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
      hass.entity.registry.current
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
      hass.entity.registry.current
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
      hass.entity.registry.current
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
