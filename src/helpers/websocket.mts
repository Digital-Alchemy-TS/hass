import type { TBlackHole, TContext } from "@digital-alchemy/core";
import type { Dayjs } from "dayjs";

import type { ALL_DOMAINS, ANY_ENTITY, PICK_ENTITY } from "../user.mts";
import type { HassSocketMessageTypes } from "./constants.mts";
import type { EntityUpdateEvent } from "./entity-state.mts";
import type { ENTITY_STATE } from "./utility.mts";

export interface SignRequestResponse {
  path: string;
}

export interface SocketMessageDTO {
  error?: Record<string, unknown>;
  event?: EntityUpdateEvent;
  id: string | number;
  message?: string;
  result?: Record<string, unknown> | Array<unknown>;
  type: `${HassSocketMessageTypes}`;
}

export type SocketSubscribeOptions<EVENT extends string> = {
  event_type: EVENT;
  context: TContext;
  exec: (data: SocketSubscribeData<EVENT>) => TBlackHole;
};

export type SocketSubscribeData<EVENT extends string> = {
  event_type: EVENT;
};

export interface SendSocketMessageDTO {
  access_token?: string;
  disabled_by?: "user";
  domain?: string;
  hidden_by?: "user";
  service?: string;
  service_data?: unknown;
  type: string;
}

export interface UpdateEntityMessageDTO<DOMAIN extends ALL_DOMAINS = ALL_DOMAINS> {
  area_id?: string;
  disabled_by?: "user";
  entity_id: PICK_ENTITY<DOMAIN>;
  hidden_by?: "user";
  icon?: string;
  name: string;
  new_entity_id: PICK_ENTITY<DOMAIN>;
  type: "config/entity_registry/update";
}

export interface RemoveEntityMessageDTO {
  entity_id: ANY_ENTITY;
  type: "config/entity_registry/remove";
}

export interface FindRelatedDTO {
  item_id: string;
  item_type: string;
  type: "search/related";
}

export interface RegistryGetDTO {
  entity_id: string;
  type: "config/entity_registry/get";
}

export interface RenderTemplateDTO {
  template: string;
  timeout: number;
  type: "render_template";
}

export interface SubscribeTriggerDTO {
  trigger: Record<string, unknown>;
  type: "subscribe_trigger";
}

export interface UnsubscribeEventsDTO {
  subscription: number;
  type: "unsubscribe_events";
}

export interface SignPathDTO {
  path: string;
  type: "auth/sign_path";
}

export interface RemoveBackupDTO {
  slug: string;
  type: "backup/remove";
}

export interface EntityHistoryDTO<ENTITIES extends ANY_ENTITY[] = ANY_ENTITY[]> {
  end_time: Date | string | Dayjs;
  entity_ids: ENTITIES;
  minimal_response?: boolean;
  no_attributes?: boolean;
  start_time: Date | string | Dayjs;
  type: "history/history_during_period";
}

export type EntityHistoryResult<
  ENTITY extends ANY_ENTITY = ANY_ENTITY,
  ATTRIBUTES extends object = object,
> = Pick<ENTITY_STATE<ENTITY> & { attributes: ATTRIBUTES }, "attributes" | "state"> & {
  date: Date;
};

export type OnHassEventCallback<T = object> = (event: T) => TBlackHole;

export type OnHassEventOptions<T = object> = {
  context: TContext;
  exec: OnHassEventCallback<T>;
  event: string;
  once?: boolean;
};
