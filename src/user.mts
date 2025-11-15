/* eslint-disable sonarjs/class-name */
/* eslint-disable @typescript-eslint/no-empty-object-type */

// #MARK: utility
type UnPrefix<T> = T extends `_${infer Platform}` ? Platform : never;

// #MARK: merging
export interface HassUniqueIdMapping {
  // "{unique_id}": "{entity_id}"
}

export interface HassDomainMapping {
  // "{domain}": "{entity_id}" | "{entity_id}" | ....
}

// ? prefix everything with "_" to ensure valid keys
export interface HassPlatformMapping {
  // "_{platform}": "{entity_id}" | "{entity_id}" | ....
}

export interface HassDeviceMapping {
  // "_{device}": "{entity_id}" | "{entity_id}" | ....
}

export interface HassAreaMapping {
  // "_{area}": "{entity_id}" | "{entity_id}" | ....
}

export interface HassLabelMapping {
  // "_{label}": "{entity_id}" | "{entity_id}" | ....
}

export interface HassFloorMapping {
  // "_{label}": "{entity_id}" | "{entity_id}" | ....
}

export interface HassEntitySetupMapping {
  // "{entity_id}": { attributes, context, entity_id, state }
}

export interface iCallService {
  // "{service_domain}": { "{service}": fn }
}

export interface HassZoneMapping {
  // "zone": true
}

export interface HassThemeMapping {
  // "{theme_name}": true | "light" | "dark" | "light" | "dark"
}

// #MARK: extract
export type TAreaId = UnPrefix<keyof HassAreaMapping>;
export type TDeviceId = UnPrefix<keyof HassDeviceMapping>;
export type TFloorId = UnPrefix<keyof HassFloorMapping>;
export type TLabelId = UnPrefix<keyof HassLabelMapping>;
export type TPlatformId = UnPrefix<keyof HassPlatformMapping>;

export type TRawDomains = keyof HassDomainMapping;
export type TZoneId = keyof HassZoneMapping;
export type ALL_DOMAINS = keyof HassDomainMapping;
export type TUniqueId = keyof HassUniqueIdMapping;
export type ANY_ENTITY = keyof HassEntitySetupMapping;
export type TRawEntityIds = keyof HassEntitySetupMapping;

export type PICK_FROM_AREA<ID extends TAreaId, DOMAIN extends ALL_DOMAINS = ALL_DOMAINS> = Extract<
  HassAreaMapping[`_${ID}`],
  PICK_ENTITY<DOMAIN>
>;

export type PICK_FROM_LABEL<
  ID extends TLabelId,
  DOMAIN extends ALL_DOMAINS = ALL_DOMAINS,
> = Extract<HassLabelMapping[`_${ID}`], PICK_ENTITY<DOMAIN>>;

export type PICK_FROM_FLOOR<
  ID extends TFloorId,
  DOMAIN extends ALL_DOMAINS = ALL_DOMAINS,
> = Extract<HassFloorMapping[`_${ID}`], PICK_ENTITY<DOMAIN>>;

export type PICK_FROM_DEVICE<
  ID extends TDeviceId,
  DOMAIN extends ALL_DOMAINS = ALL_DOMAINS,
> = Extract<HassDeviceMapping[`_${ID}`], PICK_ENTITY<DOMAIN>>;

export type PICK_FROM_PLATFORM<
  ID extends TPlatformId,
  DOMAIN extends ALL_DOMAINS = ALL_DOMAINS,
> = Extract<HassPlatformMapping[`_${ID}`], PICK_ENTITY<DOMAIN>>;

export type GetDomain<ENTITY extends `${ALL_DOMAINS}.${string}`> =
  ENTITY extends `${infer domain}.${string}` ? domain : never;

/**
 * Pick any valid entity, optionally limiting by domain
 */
export type PICK_ENTITY<DOMAIN extends ALL_DOMAINS = ALL_DOMAINS> = Extract<
  TRawEntityIds,
  `${DOMAIN}.${string}`
>;
