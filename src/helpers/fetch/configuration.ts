import { TAreaId, TFloorId, TLabelId } from "../../dynamic";

export interface HassUnitSystem {
  length: "mi";
  mass: "lb";
  pressure: "psi";
  temperature: "°F";
  volume: "gal";
}

export interface HassConfig {
  allowlist_external_dirs: string[];
  allowlist_external_urls: string[];
  components: string[];
  config_dir: string;
  config_source: string;
  currency: string;
  elevation: number;
  external_url: string;
  internal_url: string;
  latitude: number;
  location_name: string;
  longitude: number;
  safe_mode: string;
  state: string;
  time_zone: string;
  unit_system: HassUnitSystem;
  version: string;
  whitelist_external_dirs: string[];
}

export type CheckConfigResult =
  | {
      errors: null;
      result: "valid";
    }
  | {
      errors: string;
      result: "invalid";
    };

export type AreaDetails = AreaCreate & {
  area_id: TAreaId;
};

export type AreaCreate = {
  floor_id?: TFloorId;
  aliases?: string[];
  icon?: string;
  labels?: TLabelId[];
  name: string;
  picture?: string;
};

export interface ConfigEntry {
  entry_id: string;
  domain: string;
  title: string;
  source: string;
  state: State;
  supports_options: boolean;
  supports_remove_device: boolean;
  supports_unload: boolean;
  supports_reconfigure: boolean;
  pref_disable_new_entities: boolean;
  pref_disable_polling: boolean;
  disabled_by: null;
  reason: null | string;
}

export enum State {
  Loaded = "loaded",
  NotLoaded = "not_loaded",
  SetupRetry = "setup_retry",
}
