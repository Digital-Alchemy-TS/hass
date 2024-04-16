import { TAreaId, TDeviceId, TLabelId } from "../dynamic";
import { ENTITY_STATE, PICK_ENTITY } from "./utility.helper";

export enum HassEvents {
  state_changed = "state_changed",
  hue_event = "hue_event",
}

export interface HassEntityContext {
  id: string;
  parent_id: string;
  user_id: string;
}

type GenericEntityAttributes = {
  /**
   * Entity groups
   */
  entity_id?: PICK_ENTITY[];
  /**
   * Human readable name
   */
  friendly_name?: string;
};

export interface GenericEntityDTO<
  ATTRIBUTES extends object = GenericEntityAttributes,
  STATE extends unknown = string,
  CONTEXT extends HassEntityContext = HassEntityContext,
> {
  attributes: ATTRIBUTES;
  context: CONTEXT;
  // ! DO NOT TIE THIS `PICK_ENTITY` BACK TO ALL_DOMAINS
  // Causes circular references, which results in entity definitions always being `any`
  entity_id: PICK_ENTITY;
  last_changed: string;
  last_updated: string;
  state: STATE;
}

export interface EventData<ID extends PICK_ENTITY = PICK_ENTITY> {
  entity_id?: ID;
  event?: number;
  id?: string;
  new_state?: ENTITY_STATE<ID>;
  old_state?: ENTITY_STATE<ID>;
}
export type EntityUpdateEvent<
  ID extends PICK_ENTITY = PICK_ENTITY,
  CONTEXT extends HassEntityContext = HassEntityContext,
> = {
  context: CONTEXT;
  data: EventData<ID>;
  event_type: HassEvents;
  origin: "local";
  result?: string;
  time_fired: Date;
  variables: Record<string, unknown>;
};

export interface EntityDetails {
  area_id: TAreaId;
  categories: Categories;
  config_entry_id: null | string;
  device_id: TDeviceId;
  disabled_by: string | null;
  entity_category: string | null;
  entity_id: PICK_ENTITY;
  has_entity_name: boolean;
  hidden_by: string | null;
  icon: null;
  id: string;
  labels: TLabelId[];
  name: null | string;
  options: Options;
  original_name: null | string;
  platform: TPlatform;
  translation_key: null | string;
  unique_id: string;
}

export interface Categories {}

export interface Options {
  conversation: Conversation;
  "sensor.private"?: SensorPrivate;
  sensor?: Sensor;
}

export interface Conversation {
  should_expose: boolean;
}

export interface Sensor {
  suggested_display_precision?: number;
  display_precision?: null;
}

export interface SensorPrivate {
  suggested_unit_of_measurement: string;
}

export type TPlatform = string;
