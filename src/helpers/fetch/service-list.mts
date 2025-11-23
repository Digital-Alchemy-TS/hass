import type { LiteralUnion } from "type-fest";

import type { ALL_DOMAINS, PICK_ENTITY, TPlatformId } from "../../user.mts";
import type { SupportedCountries } from "../countries.mts";
import type { ColorMode } from "../features.mts";
import type { SupportedLanguages } from "../languages.mts";

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
    /** The name of the addon */
    name?: string;
    /** The slug identifier of the addon */
    slug?: string;
  };
  area: {
    /** Device filter selector(s) to filter areas by device */
    device?: DeviceFilterSelector | DeviceFilterSelector[];
    /** Entity filter selector(s) to filter areas by entity */
    entity?: EntityFilterSelector | EntityFilterSelector[];
    /** Whether multiple areas can be selected */
    multiple?: boolean;
  };
  attribute: {
    /** The entity ID to get attributes from */
    entity_id?: PICK_ENTITY;
    /** List of attribute names to hide from the selector */
    hide_attributes?: string[];
  };
  assist_pipeline: null;
  backup_location: null;
  boolean: null;
  color_rgb: null;
  color_temp: {
    /** The unit of measurement for color temperature */
    unit?: "kelvin" | "mired";
    /** Minimum color temperature value */
    min?: number;
    /** Maximum color temperature value */
    max?: number;
    /** Maximum color temperature in mireds */
    max_mireds?: number;
    /** Minimum color temperature in mireds */
    min_mireds?: number;
  };
  condition: null;
  config_entry: {
    /** The integration platform ID */
    integration: TPlatformId;
  };
  constant: {
    /** Display label for the constant value */
    label?: string;
    /** The constant value */
    value: string | number | boolean;
    /** Translation key for the label */
    translation_key?: string;
  };
  conversation_agent: {
    /** Language code for the conversation agent */
    language?: string;
  };
  country: {
    /** Country code(s) to include in the selector */
    countries?: SupportedCountries | SupportedCountries[];
    /** Whether to disable sorting of countries */
    no_sort?: boolean;
  };
  date: null;
  datetime: null;
  device: LegacyDeviceSelector & {
    /** Whether multiple devices can be selected */
    multiple?: boolean;
    /** Device filter selector(s) to filter devices */
    filter?: DeviceFilterSelector | DeviceFilterSelector[];
    /** Entity filter selector(s) to filter devices by their entities */
    entity?: EntityFilterSelector | EntityFilterSelector[];
  };
  duration: {
    /** Whether to enable day selection in duration input */
    enable_day?: boolean;
    /** Whether to enable millisecond precision in duration input */
    enable_millisecond?: boolean;
    /** Whether to allow negative duration values */
    allow_negative?: boolean;
  };
  entity: LegacyEntitySelector & {
    /** Whether multiple entities can be selected */
    multiple?: boolean;
    /** Whether entities can be reordered */
    reorder?: boolean;
    /** Entity filter selector(s) to filter entities */
    filter?: EntityFilterSelector | EntityFilterSelector[];
  } & (
      | {
          /** Entity ID(s) to exclude from the selector */
          exclude_entities?: PICK_ENTITY | PICK_ENTITY[];
          include_entities: never;
        }
      | {
          /** Entity ID(s) to include in the selector */
          include_entities?: PICK_ENTITY | PICK_ENTITY[];
          exclude_entities: never;
        }
    );
  file: {
    /** MIME type(s) or file extension(s) to accept */
    accept: string;
  };
  floor: {
    /** Entity filter selector(s) to filter floors by entity */
    entity?: EntityFilterSelector | EntityFilterSelector[];
    /** Device filter selector(s) to filter floors by device */
    device?: DeviceFilterSelector | DeviceFilterSelector[];
    /** Whether multiple floors can be selected */
    multiple?: boolean;
  };
  icon: {
    /** Placeholder text for the icon selector */
    placeholder?: string;
  };
  label: {
    /** Whether multiple labels can be selected */
    multiple?: boolean;
  };
  language: {
    /** Language code(s) to include in the selector */
    languages?: SupportedLanguages | SupportedLanguages[];
    /** Whether to display native language names */
    native_name?: boolean;
    /** Whether to disable sorting of languages */
    no_sort?: boolean;
  };
  location: {
    /** Whether to include radius selection */
    radius?: boolean;
    /** Icon to display for the location selector */
    icon?: string;
  };
  media: {
    /** MIME type(s) or file extension(s) to accept */
    accept?: string | string[];
  };
  number: {
    /** Minimum value allowed */
    min?: number;
    /** Maximum value allowed */
    max?: number;
    /** Input mode: "box" for text input or "slider" for slider control */
    mode?: "box" | "slider";
    /** Translation key for the number field */
    translation_key?: string;
    /** Step value for increment/decrement, or "any" for no step */
    step?: number | "any";
    /** Unit of measurement to display */
    unit_of_measurement?: string;
  };
  object: {
    /** Field definitions for the object structure */
    fields?: Record<
      string,
      {
        selector: ServiceListSelector;
        required?: boolean;
        label?: string;
      }
    >;
    /** Whether multiple objects can be selected */
    multiple?: boolean;
    /** Field name to use as the label for each object */
    label_field?: string;
    /** Field name to use as the description for each object */
    description_field?: string;
    /** Translation key for the object selector */
    translation_key?: string;
  };
  qr_code: {
    /** Data to encode in the QR code */
    data: string;
    /** Scale factor for the QR code size */
    scale?: number;
    /** Error correction level: L (low), M (medium), Q (quartile), H (high) */
    error_correction_level?: "L" | "M" | "Q" | "H";
  };
  select: {
    /** Available options for selection */
    options: (string | { label: string; value: string })[];
    /** Whether multiple options can be selected */
    multiple?: boolean;
    /** Whether custom values can be entered */
    custom_value?: boolean;
    /** Display mode: "dropdown" or "list" */
    mode?: "dropdown" | "list";
    /** Translation key for the select field */
    translation_key?: string;
    /** Whether to sort the options */
    sort?: boolean;
  };
  state: {
    /** Entity ID to get states from */
    entity_id?: PICK_ENTITY;
    /** Whether multiple states can be selected */
    multiple?: boolean;
    /** List of state values to hide from the selector */
    hide_states?: string[];
  };
  statistic: {
    /** Whether multiple statistics can be selected */
    multiple?: boolean;
  };
  target: {
    /** Entity filter selector(s) to filter targets by entity */
    entity?: EntityFilterSelector | EntityFilterSelector[];
    /** Device filter selector(s) to filter targets by device */
    device?: DeviceFilterSelector | DeviceFilterSelector[];
  };
  template: null;
  text: {
    /** HTML input type for the text field */
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
    /** Autocomplete attribute value */
    autocomplete?: string;
    /** Whether the text input should be multiline */
    multiline?: boolean;
    /** Prefix text to display before the input */
    prefix?: string;
    /** Suffix text to display after the input */
    suffix?: string;
    /** Whether multiple text values can be entered */
    multiple?: boolean;
  };
  theme: {
    /** Whether to include default themes in the selector */
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
