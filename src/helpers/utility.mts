import { is, TBlackHole } from "@digital-alchemy/core";
import { Dayjs } from "dayjs";
import { Get } from "type-fest";

import {
  ALL_DOMAINS,
  ANY_ENTITY,
  HassEntitySetupMapping,
  iCallService,
  PICK_ENTITY,
  TRawEntityIds,
} from "../user.mts";
import { HassEntityContext } from "./entity-state.mts";

// ? Casting by domain turns things from "equiv to ANY_ENTITY" to "scene.*" type generics
// These are no longer valid comparisons against ANY_ENTITY though
// ? The extract converts those generic types back into real entity ids to make types valid again

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
  HassEntitySetupMapping,
  `${ENTITY_ID}.${PROP}`
>;

/**
 * Type definitions to match a specific entity.
 */
export type ENTITY_STATE<ENTITY_ID extends TRawEntityIds> = Omit<
  HassEntitySetupMapping[ENTITY_ID],
  "state" | "context" | "last_changed" | "last_updated" | "entity_id" | "attributes"
> & {
  last_reported: Dayjs;
  last_changed: Dayjs;
  last_updated: Dayjs;
  attributes: ENTITY_PROP<ENTITY_ID, "attributes">;
  entity_id: ENTITY_ID;
  state: ENTITY_PROP<ENTITY_ID, "state">;
  context: HassEntityContext;
};

/**
 * Union of all services with callable methods
 */
export type ALL_SERVICE_DOMAINS = keyof iCallService;

export function isDomain<DOMAIN extends ALL_DOMAINS>(
  entity: string,
  domain: DOMAIN | DOMAIN[],
): entity is PICK_ENTITY<DOMAIN> {
  const [test] = entity.split(".") as [DOMAIN, string];
  return [domain].flat().includes(test);
}

export type RemoveCallback = { remove: () => void; (): void };

declare module "@digital-alchemy/core" {
  export interface IsIt {
    /**
     * Check to see if an entity matches
     */
    domain: typeof isDomain;
  }
}

export const PostConfigPriorities = {
  FETCH: 1,
  VALIDATE: -1,
} as const;
