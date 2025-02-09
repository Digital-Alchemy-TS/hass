import { is, TBlackHole } from "@digital-alchemy/core";
import { Dayjs } from "dayjs";
import { Get } from "type-fest";

import {
  ENTITY_SETUP,
  iCallService,
  REGISTRY_SETUP,
  TAreaId,
  TDeviceId,
  TFloorId,
  TLabelId,
  TPlatformId,
  TRawDomains,
  TRawEntityIds,
} from "../dynamic.mts";
import { HassEntityContext } from "./entity-state.mts";

export type ANY_ENTITY = TRawEntityIds;

// ? Casting by domain turns things from "equiv to ANY_ENTITY" to "scene.*" type generics
// These are no longer valid comparisons against ANY_ENTITY though
// ? The extract converts those generic types back into real entity ids to make types valid again
/**
 * Pick any valid entity, optionally limiting by domain
 */
export type PICK_ENTITY<DOMAIN extends ALL_DOMAINS = ALL_DOMAINS> = Extract<
  ANY_ENTITY,
  `${DOMAIN}.${string}`
>;

/**
 * Pick any valid service call, optionally limiting by domain
 */
export type PICK_SERVICE<DOMAIN extends ALL_SERVICE_DOMAINS = ALL_SERVICE_DOMAINS> = {
  [key in DOMAIN]: `${key}.${keyof iCallService[key] & string}`;
}[DOMAIN];

export type PICK_SERVICE_PARAMETERS<
  DOMAINS extends ALL_SERVICE_DOMAINS,
  SERVICE extends PICK_SERVICE<DOMAINS>,
> =
  Get<iCallService, SERVICE> extends (serviceParams: infer ServiceParams) => TBlackHole
    ? ServiceParams
    : never;

export function entity_split(
  entity: { entity_id: ANY_ENTITY } | ANY_ENTITY,
): [ALL_DOMAINS, string] {
  if (is.object(entity)) {
    entity = entity.entity_id;
  }
  return entity.split(".") as [ALL_DOMAINS, string];
}
/**
 * Extract the domain from an entity with type safety
 */
export function domain(entity: { entity_id: ANY_ENTITY } | ANY_ENTITY): ALL_DOMAINS {
  if (is.object(entity)) {
    entity = entity.entity_id;
  }
  return entity_split(entity).shift() as ALL_DOMAINS;
}

export type ENTITY_PROP<ENTITY_ID extends PICK_ENTITY, PROP extends "state" | "attributes"> = Get<
  ENTITY_SETUP,
  `${ENTITY_ID}.${PROP}`
>;

/**
 * Type definitions to match a specific entity.
 */
export type ENTITY_STATE<ENTITY_ID extends ANY_ENTITY> = Omit<
  ENTITY_SETUP[ENTITY_ID],
  "state" | "context" | "last_changed" | "last_updated" | "entity_id" | "attributes"
> & {
  last_reported: Dayjs;
  last_changed: Dayjs;
  last_updated: Dayjs;
  attributes: ENTITY_SETUP[ENTITY_ID]["attributes"];
  entity_id: ENTITY_ID;
  state: ENTITY_SETUP[ENTITY_ID]["state"];
  context: HassEntityContext;
};

/**
 * Union of all domains that contain entities
 */
export type ALL_DOMAINS = TRawDomains;

/**
 * Union of all services with callable methods
 */
export type ALL_SERVICE_DOMAINS = keyof iCallService;

export type GetDomain<ENTITY extends ANY_ENTITY> = ENTITY extends `${infer domain}.${string}`
  ? domain
  : never;

export function isDomain<DOMAIN extends ALL_DOMAINS>(
  entity: string,
  domain: DOMAIN | DOMAIN[],
): entity is PICK_ENTITY<DOMAIN> {
  const [test] = entity.split(".") as [DOMAIN, string];
  return [domain].flat().includes(test);
}

is.removeFn = (remove: () => void) => {
  const out = remove as RemoveCallback;
  out.remove = remove;
  return out;
};

export type RemoveCallback = { remove: () => void; (): void };

declare module "@digital-alchemy/core" {
  export interface IsIt {
    /**
     * Check to see if an entity matches
     */
    domain: typeof isDomain;
    removeFn: (remove: () => void) => RemoveCallback;
  }
}

export const PostConfigPriorities = {
  FETCH: 1,
  VALIDATE: -1,
} as const;

export type PICK_FROM_AREA<ID extends TAreaId, DOMAIN extends ALL_DOMAINS = ALL_DOMAINS> = Extract<
  REGISTRY_SETUP["area"][`_${ID}`],
  PICK_ENTITY<DOMAIN>
>;

export type PICK_FROM_LABEL<
  ID extends TLabelId,
  DOMAIN extends ALL_DOMAINS = ALL_DOMAINS,
> = Extract<REGISTRY_SETUP["label"][`_${ID}`], PICK_ENTITY<DOMAIN>>;

export type PICK_FROM_FLOOR<
  ID extends TFloorId,
  DOMAIN extends ALL_DOMAINS = ALL_DOMAINS,
> = Extract<REGISTRY_SETUP["floor"][`_${ID}`], PICK_ENTITY<DOMAIN>>;

export type PICK_FROM_DEVICE<
  ID extends TDeviceId,
  DOMAIN extends ALL_DOMAINS = ALL_DOMAINS,
> = Extract<REGISTRY_SETUP["device"][`_${ID}`], PICK_ENTITY<DOMAIN>>;

export type PICK_FROM_PLATFORM<
  ID extends TPlatformId,
  DOMAIN extends ALL_DOMAINS = ALL_DOMAINS,
> = Extract<REGISTRY_SETUP["platform"][`_${ID}`], PICK_ENTITY<DOMAIN>>;
