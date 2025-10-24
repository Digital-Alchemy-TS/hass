import type { LiteralUnion } from "type-fest";

import type { ALL_DOMAINS, PICK_ENTITY, TPlatformId } from "../../user.mts";
import type { ColorMode } from "../features.mts";

export type EntityFilterSelector = {
  integration: TPlatformId;
  domain: string;
  device_class: string;
  supported_features: string[];
};

export type DeviceFilterSelector = {
  integration: TPlatformId;
  manufacturer: string;
  model: string;
  model_id: string;
};

export type LegacyEntitySelector = {
  integration?: TPlatformId;
  domain?: string[];
  device_class?: string[];
  supported_features: string[];
};

export type LegacyDeviceSelector = {
  integration?: TPlatformId;
  manufacturer?: string;
  model?: string;
};

export interface ServiceListSelector {
  action: null;
  addon: {
    name?: string;
    slug?: string;
  };
  area: {
    device?: DeviceFilterSelector[];
    entity?: EntityFilterSelector[];
    multiple?: boolean;
  };
  attribute: {
    entity_id?: PICK_ENTITY;
    hide_attributes?: string[];
  };
  assist_pipeline: null;
  backup_location?: null;
  boolean?: null;
  color_rgb?: null;
  color_temp?: {
    unit?: "kelvin" | "mired";
    min?: number;
    max?: number;
    max_mireds?: number;
    min_mireds?: number;
  };
  config_entry: {
    integration: TPlatformId;
  };
  constant: {
    label?: string;
    value: string | number | boolean;
    translation_key?: string;
  };
  conversation_agent?: {
    language?: string;
  };
  country: {
    countries?: string[];
    no_sort?: boolean;
  };
  date: null;
  datetime: null;
  device: LegacyDeviceSelector & {
    multiple?: boolean;
    filter?: DeviceFilterSelector[];
    entity?: EntityFilterSelector[];
  };
  duration: {
    enable_day?: boolean;
    enable_millisecond?: boolean;
    allow_negative?: boolean;
  };
  entity: LegacyEntitySelector & {
    exclude_entities: string[];
    include_entities: string[];
    multiple?: boolean;
    reorder?: boolean;
    filter: EntityFilterSelector[];
  };
  file: {
    accept: string;
  };
  floor: {
    entity?: EntityFilterSelector[];
    device?: DeviceFilterSelector[];
    multiple?: boolean;
  };
  icon: {
    placeholder?: string;
  };
  label: {
    multiple?: boolean;
  };
  language: {
    languages?: string[];
    native_name?: boolean;
    no_sort?: boolean;
  };
  location: {
    radius?: boolean;
    icon?: string;
  };
  media: {
    accept: string[];
  };
  number: {
    min?: number;
    max?: number;
    mode?: "box" | "slider";
    translation_key?: string;
    step?: number | "any";
    unit_of_measurement?: string;
  };
  object: {
    label_field?: string;
    description_field?: string;
    translation_key?: string;
    multiple?: boolean;
    // fields?: recursive
  };
  qr_code: {
    data: string;
    scale?: number;
    error_correction_level?: unknown;
  };
  select: {
    custom_value: boolean;
    multiple?: boolean;
    options: string[] | { label: string; value: string }[];
    mode?: "dropdown" | "list";
    translation_key: string;
  };
  state: {
    multiple?: boolean;
    hide_states?: string[];
    entity_id?: string;
  };
  statistic: {
    multiple?: true;
  };
  target: {
    entity?: EntityFilterSelector[];
    device?: DeviceFilterSelector[];
  };
  template: null;
  text: {
    type?:
      | "color"
      | "date"
      | "datetime-local"
      | "email"
      | "month"
      | "number"
      | "password"
      | "search"
      | "tel"
      | "text"
      | "time"
      | "url"
      | "week";
    autocomplete: string;
    multiline?: boolean;
    prefix?: string;
    suffix?: string;
    multiple?: boolean;
  };
  theme: {
    include_defaults?: boolean;
  };
  time: null;
  trigger: null;
}

export interface ServiceListFilter {
  supported_features?: number[];
  supported_color_modes?: LiteralUnion<`${ColorMode}`, string>[];
}

export interface ServiceListFieldDescription {
  advanced?: boolean;
  default?: unknown;
  description?: string;
  example?: string | number;
  filter?: ServiceListFilter;
  name?: string;
  required?: boolean;
  selector?: ServiceListSelector;
}

export type ServiceListEntityTarget = {
  domain?: ALL_DOMAINS[];
  integration?: TPlatformId;
  supported_features?: number[];
};

export interface ServiceListServiceTarget {
  device?: { integration?: string };
  entity?: ServiceListEntityTarget[];
  integration?: string;
}

export interface ServiceListField {
  description?: string;
  fields: Record<string, ServiceListFieldDescription>;
  name?: string;
  target?: ServiceListServiceTarget;
  response?: ResponseOptional;
}

export interface ResponseOptional {
  optional?: boolean;
}

export interface HassServiceDTO {
  domain: ALL_DOMAINS;
  services: Record<string /* via .name */, ServiceListField>;
}
