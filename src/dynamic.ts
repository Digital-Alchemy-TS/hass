/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @cspell/spellchecker */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
// @ts-nocheck
import { PICK_ENTITY } from "./helpers";

export type TFloorId = "example_floor" | "example_floor_2";
export type TAreaId = "example_area" | "empty_area";
export type TLabelId = "example_label" | "example_label_2";
export type TDeviceId = "example_device" | "example_device_2";
export type TPlatformId = "synapse" | "sun";
export type TZoneId = string & { zone: true };

// ## THIS FILE IS INTENDED TO BE REPLACED
//
// ! IF YOU STILL SEE THIS IN YOUR `node_modules`, run `npx type-writer`
//
// The purpose it to represent the configuration of Home Assistant
//
// - entities, with their available attributes & states
// - services, and what parameters they take
//
// This information is TYPES ONLY, and is used to add type safety to
// methods exported from this library through the use of utility types that
// take advantage of this information
//
// A post-install hook will regenerate these with real values.
//
// The service definition is the switch, light, scene domains from a previously generated file.
// These are required to make typescript happy for internal library definitions

// #MARK: ENTITY_SETUP
export const ENTITY_SETUP = {
  binary_sensor: {
    example_binary_sensor: {
      attributes: { friendly_name: "Example binary sensor" },
      context: { id: "abc123", parent_id: null, user_id: null },
      entity_id: "binary_sensor.example_binary_sensor",
      last_changed: "2024-01-01T01:01:01.000000+00:00",
      last_updated: "2024-01-01T01:01:01.000000+00:00",
      state: "on",
    },
  },
  button: {
    example_button: {
      attributes: { friendly_name: "Example button" },
      context: { id: "abc123", parent_id: null, user_id: null },
      entity_id: "button.example_button",
      last_changed: "2024-01-01T01:01:01.000000+00:00",
    },
  },
  calendar: {
    example_calendar: {
      attributes: { friendly_name: "Example calendar", offset_reached: false },
      context: { id: "abc123", parent_id: null, user_id: null },
      entity_id: "calendar.example_calendar",
      last_changed: "2024-01-01T01:01:01.000000+00:00",
      last_updated: "2024-01-01T01:01:01.000000+00:00",
      state: "off",
    },
  },
  light: {
    example_light: {
      attributes: {
        brightness: 255,
        color_mode: "color_temp",
        color_temp: 253,
        color_temp_kelvin: 3952,
        dynamics: "none",
        friendly_name: "Example light",
        hs_color: [26.835, 35.746],
        max_color_temp_kelvin: 6535,
        max_mireds: 500,
        min_color_temp_kelvin: 2000,
        min_mireds: 153,
        mode: "normal",
        rgb_color: [255, 204, 163],
        supported_color_modes: ["color_temp", "xy"],
        supported_features: 40,
        xy_color: [0.424, 0.366],
      },
      context: { id: "abc123", parent_id: null, user_id: null },
      entity_id: "light.example_light",
      last_changed: "2024-01-01T01:01:01.000000+00:00",
      last_updated: "2024-01-01T01:01:01.000000+00:00",
      state: "on",
    },
  },
  scene: {
    example_scene: {
      attributes: { friendly_name: "Example scene" },
      context: { id: "abc123", parent_id: null, user_id: null },
      entity_id: "scene.example_scene",
      last_changed: "2024-01-01T01:01:01.000000+00:00",
      last_updated: "2024-01-01T01:01:01.000000+00:00",
      state: "2024-01-01T01:01:01.000000+00:00",
    },
  },
  sensor: {
    example_sensor: {
      attributes: { friendly_name: "Example sensor" },
      context: { id: "abc123", parent_id: null, user_id: null },
      entity_id: "sensor.example_sensor",
      last_changed: "2024-01-01T01:01:01.000000+00:00",
      last_updated: "2024-01-01T01:01:01.000000+00:00",
      state: "High",
    },
  },
  switch: {
    example_switch: {
      attributes: { friendly_name: "Example switch" },
      context: { id: "abc123", parent_id: null, user_id: null },
      entity_id: "switch.example_switch",
      last_changed: "2024-01-01T01:01:01.000000+00:00",
      last_updated: "2024-01-01T01:01:01.000000+00:00",
      state: "off",
    },
  },
} as const;

export type TRawDomains =
  | "binary_sensor"
  | "button"
  | "calendar"
  | "light"
  | "scene"
  | "sensor"
  | "switch";

export type TRawEntityIds =
  | "binary_sensor.example_binary_sensor"
  | "button.example_button"
  | "calendar.example_calendar"
  | "light.example_light"
  | "scene.example_scene"
  | "sensor.example_sensor"
  | "switch.example_switch";

export type REGISTRY_SETUP = {
  platform: {
    _synapse: "switch.example_switch";
    _sun: "sun.sun";
  };
  area: {
    _example_area: "sensor.example_sensor";
    _empty_area: never;
  };
  label: {
    _example_label_2: "switch.example_switch";
    _example_label: "switch.example_switch";
  };
  floor: {
    _example_floor_2: "button.example_button" | "button.example_button";
    _example_floor: "button.example_button" | "button.example_button";
  };
  device: {
    _example_device_2: "button.example_button" | "button.example_button";
    _example_device: "button.example_button" | "button.example_button";
  };
};

export type iCallService = {
  switch: {
    turn_off(service_data: { entity_id: string | string[] }): Promise<void>;
    turn_on(service_data: { entity_id: string | string[] }): Promise<void>;
    toggle(service_data: { entity_id: string | string[] }): Promise<void>;
  };
  light: {
    turn_on(service_data: {
      transition?: number;
      rgb_color?: unknown;
      rgbw_color?: Record<string, unknown> | unknown[];
      rgbww_color?: Record<string, unknown> | unknown[];
      color_name?: "homeassistant" | "yellowgreen";
      hs_color?: Record<string, unknown> | unknown[];
      xy_color?: Record<string, unknown> | unknown[];
      color_temp?: unknown;
      kelvin?: number;
      brightness?: number;
      brightness_pct?: number;
      brightness_step?: number;
      brightness_step_pct?: number;
      white?: unknown;
      profile?: string;
      flash?: "long" | "short";
      effect?: string;
      entity_id: string | string[];
    }): Promise<void>;
    turn_off(service_data: {
      transition?: number;
      flash?: "long" | "short";
      entity_id: string | string[];
    }): Promise<void>;
    toggle(service_data: {
      transition?: number;
      rgb_color?: unknown;
      color_name?: "homeassistant" | "yellowgreen";
      hs_color?: Record<string, unknown> | unknown[];
      xy_color?: Record<string, unknown> | unknown[];
      color_temp?: unknown;
      kelvin?: number;
      brightness?: number;
      brightness_pct?: number;
      white?: unknown;
      profile?: string;
      flash?: "long" | "short";
      effect?: string;
      entity_id: string | string[];
    }): Promise<void>;
  };
  scene: {
    reload(service_data: {}): Promise<void>;
    apply(service_data: {
      entities: Partial<Record<PICK_ENTITY, unknown>> | unknown[];
      transition?: number;
    }): Promise<void>;
    create(service_data: {
      scene_id: string;
      entities?: Record<string, unknown> | unknown[];
      snapshot_entities?: string;
    }): Promise<void>;
    turn_on(service_data: {
      transition?: number;
      entity_id: string | string[];
    }): Promise<void>;
  };
};
