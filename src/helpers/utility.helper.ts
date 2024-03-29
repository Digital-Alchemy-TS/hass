import { is, TBlackHole } from "@digital-alchemy/core";
import { Get } from "type-fest";

import { ENTITY_SETUP, iCallService } from "../dynamic";
import { HassEntityContext } from ".";

/**
 * Pick any valid entity, optionally limiting by domain
 */
export type PICK_ENTITY<DOMAIN extends ALL_DOMAINS = ALL_DOMAINS> = {
  [key in DOMAIN]: `${key}.${keyof (typeof ENTITY_SETUP)[key] & string}`;
}[DOMAIN];

/**
 * Pick any valid entity, optionally limiting by domain
 */
export type PICK_SERVICE<
  DOMAIN extends ALL_SERVICE_DOMAINS = ALL_SERVICE_DOMAINS,
> = {
  [key in DOMAIN]: `${key}.${keyof iCallService[key] & string}`;
}[DOMAIN];

export type PICK_SERVICE_PARAMETERS<SERVICE extends PICK_SERVICE> =
  Get<iCallService, SERVICE> extends (
    serviceParams: infer ServiceParams,
  ) => TBlackHole
    ? ServiceParams
    : never;

export function entity_split(
  entity: { entity_id: PICK_ENTITY } | PICK_ENTITY,
): [ALL_DOMAINS, string] {
  if (is.object(entity)) {
    entity = entity.entity_id;
  }
  return entity.split(".") as [ALL_DOMAINS, string];
}
/**
 * Extract the domain from an entity with type safety
 */
export function domain(
  entity: { entity_id: PICK_ENTITY } | PICK_ENTITY,
): ALL_DOMAINS {
  if (is.object(entity)) {
    entity = entity.entity_id;
  }
  return entity_split(entity).shift() as ALL_DOMAINS;
}

/**
 * Type definitions to match a specific entity.
 */
export type ENTITY_STATE<ENTITY_ID extends PICK_ENTITY> = Omit<
  Get<typeof ENTITY_SETUP, ENTITY_ID>,
  "state" | "context" | "last_changed" | "last_updated"
> & {
  last_changed: string;
  last_updated: string;
  state: string;
  context: HassEntityContext;
};

/**
 * Union of all domains that contain entities
 */
export type ALL_DOMAINS = keyof typeof ENTITY_SETUP;

/**
 * Union of all services with callable methods
 */
export type ALL_SERVICE_DOMAINS = keyof iCallService;

export type GetDomain<ENTITY extends PICK_ENTITY> =
  ENTITY extends `${infer domain}.${string}` ? domain : never;

is.domain = <DOMAIN extends ALL_DOMAINS>(
  entity: string,
  domain: DOMAIN,
): entity is PICK_ENTITY<DOMAIN> => {
  const [test] = entity.split(".");
  return test === domain;
};

declare module "@digital-alchemy/core" {
  export interface IsIt {
    domain: <DOMAIN extends ALL_DOMAINS>(
      entity: string,
      domain: DOMAIN,
    ) => entity is PICK_ENTITY<DOMAIN>;
  }
}
export const PostConfigPriorities = {
  FETCH: 1,
  VALIDATE: 2,
} as const;
