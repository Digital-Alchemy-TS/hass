import {
  TAreaId,
  TDeviceId,
  TFloorId,
  TLabelId,
  TPlatformId,
  TRawEntityIds,
  TUniqueId,
  TUniqueIDMapping,
} from "../dynamic";
import {
  ALL_DOMAINS,
  ANY_ENTITY,
  PICK_ENTITY,
  PICK_FROM_AREA,
  PICK_FROM_DEVICE,
  PICK_FROM_FLOOR,
  PICK_FROM_LABEL,
  PICK_FROM_PLATFORM,
} from "./utility.helper";

export type IDByInterface = {
  area: <AREA extends TAreaId, DOMAIN extends ALL_DOMAINS>(
    area: AREA,
    ...domains: DOMAIN[]
  ) => PICK_FROM_AREA<AREA, DOMAIN>[];
  device: <DEVICE extends TDeviceId, DOMAIN extends ALL_DOMAINS>(
    device: DEVICE,
    ...domains: DOMAIN[]
  ) => PICK_FROM_DEVICE<DEVICE, DOMAIN>[];
  domain: <DOMAIN extends ALL_DOMAINS>(domain: DOMAIN) => PICK_ENTITY<DOMAIN>[];
  floor: <FLOOR extends TFloorId, DOMAIN extends ALL_DOMAINS>(
    floor: FLOOR,
    ...domains: DOMAIN[]
  ) => PICK_FROM_FLOOR<FLOOR, DOMAIN>[];
  label: <LABEL extends TLabelId, DOMAIN extends ALL_DOMAINS>(
    label: LABEL,
    ...domains: DOMAIN[]
  ) => PICK_FROM_LABEL<LABEL, DOMAIN>[];
  platform: <PLATFORM extends TPlatformId, DOMAIN extends ALL_DOMAINS>(
    platform: PLATFORM,
    ...domains: DOMAIN[]
  ) => PICK_FROM_PLATFORM<PLATFORM, DOMAIN>[];
  unique_id: <
    UNIQUE_ID extends TUniqueId,
    ENTITY_ID extends Extract<
      TUniqueIDMapping[UNIQUE_ID],
      ANY_ENTITY
    > = Extract<TUniqueIDMapping[UNIQUE_ID], TRawEntityIds>,
  >(
    unique_id: UNIQUE_ID,
  ) => ENTITY_ID;
};
