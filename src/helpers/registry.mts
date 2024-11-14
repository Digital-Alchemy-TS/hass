import { TAreaId, TDeviceId, TFloorId, TLabelId, TPlatformId, TZoneId } from "../dynamic.mts";
import { ANY_ENTITY } from "./utility.mts";

export type LabelOptions = {
  name: string;
  icon: string;
  color: string;
};

export type EditLabelOptions = {
  entity: ANY_ENTITY;
  label: TLabelId;
};

export type EditAliasOptions = {
  entity: ANY_ENTITY;
  alias: string;
};

export type LabelDefinition = {
  color: string;
  description?: string;
  icon: string;
  label_id: TLabelId;
  name: string;
};

export type ToggleExpose = {
  assistants: string | string[];
  entity_ids: ANY_ENTITY | ANY_ENTITY[];
  should_expose: boolean;
};

export type SensorUnitOfMeasurement =
  | "h"
  | "min"
  | "s"
  | "d"
  | "K"
  | "°C"
  | "°F"
  | "cm"
  | "in"
  | "mm"
  | "VA"
  | "L"
  | "gal"
  | "m³"
  | "ft³"
  | "CCF"
  | "kg"
  | "g"
  | "mg"
  | "µg"
  | "oz"
  | "lb"
  | "st"
  | "ft/s"
  | "km/h"
  | "kn"
  | "m/s"
  | "mph"
  | "in/d"
  | "in/h"
  | "mm/d"
  | "V"
  | "mV"
  | "dB"
  | "dBm"
  | "mL"
  | "fl. oz."
  | "dBA"
  | "cbar"
  | "bar"
  | "hPa"
  | "inHg"
  | "kPa"
  | "mbar"
  | "Pa"
  | "psi"
  | "var"
  | "%"
  | "None"
  | "W"
  | "kW"
  | "µg/m³"
  | "lx"
  | "W/m²"
  | "BTU/(h⋅ft²)"
  | "Hz"
  | "kHz"
  | "MHz"
  | "GHz"
  | "Wh"
  | "kWh"
  | "MWh"
  | "MJ"
  | "GJ"
  | "km"
  | "m"
  | "mi"
  | "yd"
  | "bit/s"
  | "kbit/s"
  | "Mbit/s"
  | "Gbit/s"
  | "B/s"
  | "kB/s"
  | "MB/s"
  | "GB/s"
  | "KiB/s"
  | "MiB/s"
  | "GiB/s"
  | "bit"
  | "kbit"
  | "Mbit"
  | "Gbit"
  | "B"
  | "kB"
  | "MB"
  | "GB"
  | "TB"
  | "PB"
  | "EB"
  | "ZB"
  | "YB"
  | "KiB"
  | "MiB"
  | "GiB"
  | "TiB"
  | "PiB"
  | "EiB"
  | "ZiB"
  | "YiB"
  | "A"
  | "mA"
  | "ppm";

export type EntityRegistryItem<ENTITY extends ANY_ENTITY> = {
  area_id?: TAreaId;
  categories: object;
  config_entry_id?: string;
  device_id?: TDeviceId;
  disabled_by?: string;
  entity_category?: string;
  entity_id: ENTITY;
  has_entity_name: boolean;
  hidden_by?: string;
  icon?: string;
  id: string;
  labels: TLabelId[];
  name?: string;
  options: {
    conversation: {
      should_expose?: boolean;
    };
    sensor?: {
      display_precision?: number;
      unit_of_measurement?: SensorUnitOfMeasurement;
    };
  };
  original_name: string;
  platform: TPlatformId;
  translation_key?: string;
  unique_id: string;
  aliases: string[];
  capabilities?: string;
  device_class?: string;
  original_device_class?: string;
  original_icon?: string;
};

export const UPDATE_REGISTRY = "config/entity_registry/update";

export type UpdateCoreOptions = {
  currency: string;
  elevation: number;
  unit_system: string;
  update_units: boolean;
  time_zone: string;
  location_name: string;
  language: string;
  country: string;
};

export type ZoneOptions = {
  latitude: number;
  longitude: number;
  name: string;
  icon: string;
  passive: boolean;
};

export type ZoneDetails = ZoneOptions & { id: TZoneId };

export interface ManifestItem {
  domain: string;
  name: string;
  codeowners: string[];
  config_flow?: boolean;
  documentation?: string;
  iot_class?: IotClass;
  loggers?: string[];
  requirements?: string[];
  is_built_in: boolean;
  integration_type?: IntegrationType;
  quality_scale?: QualityScale;
  dependencies?: string[];
  dhcp?: DHCP[];
  after_dependencies?: string[];
  single_config_entry?: boolean;
  bluetooth?: Bluetooth[];
  version?: string;
  homekit?: Homekit;
  zeroconf?: Array<ZeroconfClass | string>;
  ssdp?: SSDP[];
  issue_tracker?: string;
}

export interface Bluetooth {
  manufacturer_id: number;
  service_uuid?: string;
  manufacturer_data_start?: number[];
}

export interface DHCP {
  registered_devices?: boolean;
  hostname?: string;
  macaddress?: string;
}

export interface Homekit {
  models: string[];
}

export enum IntegrationType {
  Device = "device",
  Entity = "entity",
  Helper = "helper",
  Hub = "hub",
  Service = "service",
  System = "system",
}

export enum IotClass {
  Calculated = "calculated",
  CloudPolling = "cloud_polling",
  CloudPush = "cloud_push",
  LocalPolling = "local_polling",
  LocalPush = "local_push",
}

export enum QualityScale {
  Internal = "internal",
  Platinum = "platinum",
}

export interface SSDP {
  manufacturer: string;
  modelDescription: string;
}

export interface ZeroconfClass {
  type: string;
  properties?: Properties;
}

export interface Properties {
  mdl?: string;
  SYSTYPE?: string;
}

export type FloorCreate = {
  name: string;
  level: number;
  aliases?: string[];
};

export type FloorDetails = FloorCreate & {
  floor_id: TFloorId;
};
