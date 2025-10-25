import type { LiteralUnion } from "type-fest";

import type { ALL_DOMAINS, PICK_ENTITY, TPlatformId } from "../../user.mts";
import type { ColorMode } from "../features.mts";

export type EntityFilterSelector = {
  integration?: TPlatformId;
  domain?: ALL_DOMAINS | ALL_DOMAINS[];
  device_class?: string | string[];
  supported_features?: string | string[];
};

export type DeviceFilterSelector = {
  integration?: TPlatformId;
  manufacturer?: string;
  model?: string;
  model_id?: string;
};

export type LegacyEntitySelector = {
  integration?: TPlatformId;
  domain?: ALL_DOMAINS | ALL_DOMAINS[];
  device_class?: string | string[];
  supported_features?: string | string[];
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
    device?: DeviceFilterSelector | DeviceFilterSelector[];
    entity?: EntityFilterSelector | EntityFilterSelector[];
    multiple?: boolean;
  };
  attribute: {
    entity_id?: PICK_ENTITY;
    hide_attributes?: string[];
  };
  assist_pipeline: null;
  backup_location: null;
  boolean: null;
  color_rgb: null;
  color_temp: {
    unit?: "kelvin" | "mired";
    min?: number;
    max?: number;
    max_mireds?: number;
    min_mireds?: number;
  };
  condition: null;
  config_entry: {
    integration: TPlatformId;
  };
  constant: {
    label?: string;
    value: string | number | boolean;
    translation_key?: string;
  };
  conversation_agent: {
    language?: string;
  };
  country: {
    countries?: string | string[];
    no_sort?: boolean;
  };
  date: null;
  datetime: null;
  device: LegacyDeviceSelector & {
    multiple?: boolean;
    filter?: DeviceFilterSelector | DeviceFilterSelector[];
    entity?: EntityFilterSelector | EntityFilterSelector[];
  };
  duration: {
    enable_day?: boolean;
    enable_millisecond?: boolean;
    allow_negative?: boolean;
  };
  entity: LegacyEntitySelector & {
    exclude_entities?: PICK_ENTITY | PICK_ENTITY[];
    include_entities?: PICK_ENTITY | PICK_ENTITY[];
    multiple?: boolean;
    reorder?: boolean;
    filter?: EntityFilterSelector | EntityFilterSelector[];
  };
  file: {
    accept: string;
  };
  floor: {
    entity?: EntityFilterSelector | EntityFilterSelector[];
    device?: DeviceFilterSelector | DeviceFilterSelector[];
    multiple?: boolean;
  };
  icon: {
    placeholder?: string;
  };
  label: {
    multiple?: boolean;
  };
  language: {
    languages?: string | string[];
    native_name?: boolean;
    no_sort?: boolean;
  };
  location: {
    radius?: boolean;
    icon?: string;
  };
  media: {
    accept?: string | string[];
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
    fields?: Record<
      string,
      {
        selector: ServiceListSelector;
        required?: boolean;
        label?: string;
      }
    >;
    multiple?: boolean;
    label_field?: string;
    description_field?: string;
    translation_key?: string;
  };
  qr_code: {
    data: string;
    scale?: number;
    error_correction_level?: "L" | "M" | "Q" | "H";
  };
  select: {
    options: (string | { label: string; value: string })[];
    multiple?: boolean;
    custom_value?: boolean;
    mode?: "dropdown" | "list";
    translation_key?: string;
    sort?: boolean;
  };
  state: {
    entity_id?: PICK_ENTITY;
    multiple?: boolean;
    hide_states?: string[];
  };
  statistic: {
    multiple?: boolean;
  };
  target: {
    entity?: EntityFilterSelector | EntityFilterSelector[];
    device?: DeviceFilterSelector | DeviceFilterSelector[];
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
    autocomplete?: string;
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
  attribute?: Record<string, string[]>;
  supported_features?: number[];
  supported_color_modes?: LiteralUnion<`${ColorMode}`, string>[];
}
export interface ServiceListFieldDescription<
  TYPE extends keyof ServiceListSelector = keyof ServiceListSelector,
> {
  fields?: Record<string, ServiceListFieldDescription>;
  target?: ServiceListServiceTarget;
  response?: ResponseOptional;
  advanced?: boolean;
  default?: unknown;
  description?: string;
  example?: string | number;
  filter?: ServiceListFilter;
  name?: string;
  required?: boolean;
  /**
   * The `selector` field is a discriminated union that ensures only one key of `ServiceListSelector`
   * can be present at a time. This mapped type enforces mutual exclusivity at the type level,
   * so that only a single selector type is allowed for each field description.
   */
  selector?: {
    [K in TYPE]: { [P in K]: ServiceListSelector[P] } & { [P in Exclude<TYPE, K>]?: never };
  }[TYPE];
}

export interface ServiceListServiceTarget {
  entity?: EntityFilterSelector | EntityFilterSelector[];
  device?: DeviceFilterSelector | DeviceFilterSelector[];
}

export interface ServiceListField {
  description?: string;
  fields?: Record<string, ServiceListFieldDescription>;
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
