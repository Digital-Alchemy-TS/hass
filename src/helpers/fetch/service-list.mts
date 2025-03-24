import { LiteralUnion } from "type-fest";
import { ALL_DOMAINS, TPlatformId } from "../../user.mts";
import { ColorMode } from "../features.mts";

export interface ServiceListSelectorTarget {
  domain?: ALL_DOMAINS;
  integration?: TPlatformId;
  multiple?: boolean;
}

export interface ServiceListSelector {
  addon?: null;
  backup_location?: null;
  boolean?: null;
  color_rgb?: null;
  color_temp?: { unit: "kelvin"; min: number; max: number };
  conversation_agent?: null;
  date?: null;
  datetime?: null;
  entity?: ServiceListSelectorTarget;
  icon?: null;
  number?: {
    max: number;
    min: number;
    mode?: string;
    step?: number;
    unit_of_measurement: string;
  };
  object?: null;
  select?: {
    custom_value?: boolean;
    multiple?: boolean;
    options: Record<"label" | "value", string>[] | string[];
  };
  text?: null | { type: "password" };
  theme?: { include_defaults?: boolean };
  time?: null;
}

export interface ServiceListFilter {
  supported_features?: number[]
  supported_color_modes?: LiteralUnion<`${ColorMode}`,string>[]
}

export interface ServiceListFieldDescription {
  advanced?: boolean;
  default?: unknown;
  description?: string;
  example?: string | number;
  filter?: ServiceListFilter
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
