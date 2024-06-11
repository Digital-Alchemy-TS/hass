import { is, TServiceParams } from "@digital-alchemy/core";

import {
  TAreaId,
  TDeviceId,
  TFloorId,
  TLabelId,
  TPlatformId,
} from "../dynamic";
import {
  ALL_DOMAINS,
  domain,
  PICK_FROM_AREA,
  PICK_FROM_DEVICE,
  PICK_FROM_FLOOR,
  PICK_FROM_LABEL,
} from "../helpers";

export function IDByExtension({ hass }: TServiceParams) {
  // * label
  function label<LABEL extends TLabelId, DOMAIN extends ALL_DOMAINS>(
    label: LABEL,
    ...domains: DOMAIN[]
  ): PICK_FROM_LABEL<LABEL, DOMAIN>[] {
    hass.entity.warnEarly("label");
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

  // * area
  function area<AREA extends TAreaId, DOMAIN extends ALL_DOMAINS>(
    area: AREA,
    ...domains: DOMAIN[]
  ): PICK_FROM_AREA<AREA, DOMAIN>[] {
    hass.entity.warnEarly("area");
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

  // * device
  function device<DEVICE extends TDeviceId, DOMAIN extends ALL_DOMAINS>(
    device: DEVICE,
    ...domains: DOMAIN[]
  ): PICK_FROM_DEVICE<DEVICE, DOMAIN>[] {
    hass.entity.warnEarly("device");
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

  // * floor
  function floor<FLOOR extends TFloorId, DOMAIN extends ALL_DOMAINS>(
    floor: FLOOR,
    ...domains: DOMAIN[]
  ): PICK_FROM_FLOOR<FLOOR, DOMAIN>[] {
    hass.entity.warnEarly("floor");
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

  // * platform
  function platform<PLATFORM extends TPlatformId, DOMAIN extends ALL_DOMAINS>(
    platform: PLATFORM,
    ...domains: DOMAIN[]
  ) {
    hass.entity.warnEarly("platform");
    const raw = hass.entity.registry.current
      .filter(i => i.platform === platform)
      .filter(i => i.platform === platform)
      .map(i => i.entity_id);
    if (is.empty(domains)) {
      return raw;
    }
    return raw.filter(i => domains.includes(domain(i) as DOMAIN));
  }

  return { area, device, floor, label, platform };
}
