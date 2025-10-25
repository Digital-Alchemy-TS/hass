/* eslint-disable sort-keys-fix/sort-keys-fix */

import type { ALL_DOMAINS } from "../user.mts";

// Light Features (from homeassistant/components/light/const.py)
export const LIGHT = {
  SUPPORT_EFFECT: 4,
  SUPPORT_FLASH: 8,
  SUPPORT_TRANSITION: 32,
} as const;

// Vacuum Features (from homeassistant/components/vacuum/__init__.py)
export const VACUUM = {
  SUPPORT_TURN_ON: 1, // Deprecated
  SUPPORT_TURN_OFF: 2, // Deprecated
  SUPPORT_PAUSE: 4,
  SUPPORT_STOP: 8,
  SUPPORT_RETURN_HOME: 16,
  SUPPORT_FAN_SPEED: 32,
  SUPPORT_BATTERY: 64,
  SUPPORT_STATUS: 128, // Deprecated
  SUPPORT_SEND_COMMAND: 256,
  SUPPORT_LOCATE: 512,
  SUPPORT_CLEAN_SPOT: 1024,
  SUPPORT_MAP: 2048,
  SUPPORT_STATE: 4096,
  SUPPORT_START: 8192,
} as const;

// Water Heater Features (from homeassistant/components/water_heater/__init__.py)
export const WATER_HEATER = {
  SUPPORT_TARGET_TEMPERATURE: 1,
  SUPPORT_OPERATION_MODE: 2,
  SUPPORT_AWAY_MODE: 4,
  SUPPORT_ON_OFF: 8,
} as const;

// Valve Features (from homeassistant/components/valve/__init__.py)
export const VALVE = {
  SUPPORT_OPEN: 1,
  SUPPORT_CLOSE: 2,
  SUPPORT_SET_POSITION: 4,
  SUPPORT_STOP: 8,
} as const;

// Weather Features (from homeassistant/components/weather/const.py)
export const WEATHER = {
  SUPPORT_FORECAST_DAILY: 1,
  SUPPORT_FORECAST_HOURLY: 2,
  SUPPORT_FORECAST_TWICE_DAILY: 4,
} as const;

// AI Task Features (from homeassistant/components/ai_task/const.py)
export const AI_TASK = {
  SUPPORT_ATTACHMENTS: 2,
} as const;

// Switch Features (from homeassistant/components/switch/__init__.py)
export const SWITCH = {
  SUPPORT_TURN_ON: 1,
  SUPPORT_TURN_OFF: 2,
} as const;

// Cover Features (from homeassistant/components/cover/__init__.py)
export const COVER = {
  SUPPORT_OPEN: 1,
  SUPPORT_CLOSE: 2,
  SUPPORT_SET_POSITION: 4,
  SUPPORT_STOP: 8,
  SUPPORT_OPEN_TILT: 16,
  SUPPORT_CLOSE_TILT: 32,
  SUPPORT_STOP_TILT: 64,
  SUPPORT_SET_TILT_POSITION: 128,
} as const;

// Fan Features (from homeassistant/components/fan/__init__.py)
export const FAN = {
  SUPPORT_SET_SPEED: 1,
  SUPPORT_OSCILLATE: 2,
  SUPPORT_DIRECTION: 4,
  SUPPORT_PRESET_MODE: 8,
  SUPPORT_TURN_OFF: 16,
  SUPPORT_TURN_ON: 32,
} as const;

// Climate Features (from homeassistant/components/climate/const.py)
export const CLIMATE = {
  SUPPORT_TARGET_TEMPERATURE: 1,
  SUPPORT_TARGET_TEMPERATURE_RANGE: 2,
  SUPPORT_TARGET_HUMIDITY: 4,
  SUPPORT_FAN_MODE: 8,
  SUPPORT_PRESET_MODE: 16,
  SUPPORT_SWING_MODE: 32,
  SUPPORT_TURN_OFF: 128,
  SUPPORT_TURN_ON: 256,
  SUPPORT_SWING_HORIZONTAL_MODE: 512,
} as const;

// Media Player Features (from homeassistant/components/media_player/const.py)
export const MEDIA_PLAYER = {
  SUPPORT_PAUSE: 1,
  SUPPORT_SEEK: 2,
  SUPPORT_VOLUME_SET: 4,
  SUPPORT_VOLUME_MUTE: 8,
  SUPPORT_PREVIOUS_TRACK: 16,
  SUPPORT_NEXT_TRACK: 32,
  SUPPORT_TURN_ON: 128,
  SUPPORT_TURN_OFF: 256,
  SUPPORT_PLAY_MEDIA: 512,
  SUPPORT_VOLUME_STEP: 1024,
  SUPPORT_SELECT_SOURCE: 2048,
  SUPPORT_STOP: 4096,
  SUPPORT_CLEAR_PLAYLIST: 8192,
  SUPPORT_PLAY: 16384,
  SUPPORT_SHUFFLE_SET: 32768,
  SUPPORT_SELECT_SOUND_MODE: 65536,
  SUPPORT_BROWSE_MEDIA: 131072,
  SUPPORT_REPEAT_SET: 262144,
  SUPPORT_GROUPING: 524288,
  SUPPORT_MEDIA_ANNOUNCE: 1048576,
  SUPPORT_MEDIA_ENQUEUE: 2097152,
  SUPPORT_SEARCH_MEDIA: 4194304,
} as const;

// Camera Features (from homeassistant/components/camera/__init__.py)
export const CAMERA = {
  SUPPORT_ON_OFF: 1,
  SUPPORT_STREAM: 2,
} as const;

// Lock Features (from homeassistant/components/lock/__init__.py)
export const LOCK = {
  SUPPORT_OPEN: 1,
} as const;

// Alarm Control Panel Features (from homeassistant/components/alarm_control_panel/__init__.py)
export const ALARM_CONTROL_PANEL = {
  SUPPORT_ARM_HOME: 1,
  SUPPORT_ARM_AWAY: 2,
  SUPPORT_ARM_NIGHT: 4,
  SUPPORT_ARM_VACATION: 8,
  SUPPORT_ARM_CUSTOM_BYPASS: 16,
} as const;

// Binary Sensor Features (from homeassistant/components/binary_sensor/__init__.py)
export const BINARY_SENSOR = {
  SUPPORT_TURN_ON: 1,
  SUPPORT_TURN_OFF: 2,
} as const;

// Sensor Features (from homeassistant/components/sensor/__init__.py)
export const SENSOR = {
  SUPPORT_TURN_ON: 1,
  SUPPORT_TURN_OFF: 2,
} as const;

// Update Features (from homeassistant/components/update/const.py)
export const UPDATE = {
  SUPPORT_INSTALL: 1,
  SUPPORT_SPECIFIC_VERSION: 2,
  SUPPORT_PROGRESS: 4,
  SUPPORT_BACKUP: 8,
  SUPPORT_RELEASE_NOTES: 16,
} as const;

// Button Features (from homeassistant/components/button/__init__.py)
export const BUTTON = {
  SUPPORT_TURN_ON: 1,
  SUPPORT_TURN_OFF: 2,
} as const;

// Number Features (from homeassistant/components/number/__init__.py)
export const NUMBER = {
  SUPPORT_TURN_ON: 1,
  SUPPORT_TURN_OFF: 2,
} as const;

// Select Features (from homeassistant/components/select/__init__.py)
export const SELECT = {
  SUPPORT_TURN_ON: 1,
  SUPPORT_TURN_OFF: 2,
} as const;

// Siren Features (from homeassistant/components/siren/const.py)
export const SIREN = {
  SUPPORT_TURN_ON: 1,
  SUPPORT_TURN_OFF: 2,
  SUPPORT_TONES: 4,
  SUPPORT_VOLUME_SET: 8,
  SUPPORT_DURATION: 16,
} as const;

// Text Features (from homeassistant/components/text/__init__.py)
export const TEXT = {
  SUPPORT_TURN_ON: 1,
  SUPPORT_TURN_OFF: 2,
} as const;

// Todo List Features (from homeassistant/components/todo/const.py)
export const TODO_LIST = {
  SUPPORT_CREATE_TODO_ITEM: 1,
  SUPPORT_DELETE_TODO_ITEM: 2,
  SUPPORT_UPDATE_TODO_ITEM: 4,
  SUPPORT_MOVE_TODO_ITEM: 8,
  SUPPORT_SET_DUE_DATE_ON_ITEM: 16,
  SUPPORT_SET_DUE_DATETIME_ON_ITEM: 32,
  SUPPORT_SET_DESCRIPTION_ON_ITEM: 64,
} as const;

// Humidifier Features (from homeassistant/components/humidifier/const.py)
export const HUMIDIFIER = {
  SUPPORT_MODES: 1,
} as const;

// Remote Features (from homeassistant/components/remote/__init__.py)
export const REMOTE = {
  SUPPORT_LEARN_COMMAND: 1,
  SUPPORT_DELETE_COMMAND: 2,
  SUPPORT_ACTIVITY: 4,
} as const;

// Notify Features (from homeassistant/components/notify/__init__.py)
export const NOTIFY = {
  SUPPORT_TITLE: 1,
} as const;

export const SUPPORTED_FEATURES = {
  AI_TASK,
  ALARM_CONTROL_PANEL,
  BINARY_SENSOR,
  BUTTON,
  CAMERA,
  CLIMATE,
  COVER,
  FAN,
  HUMIDIFIER,
  LIGHT,
  LOCK,
  MEDIA_PLAYER,
  NOTIFY,
  NUMBER,
  REMOTE,
  SELECT,
  SENSOR,
  SIREN,
  SWITCH,
  TEXT,
  TODO_LIST,
  UPDATE,
  VACUUM,
  VALVE,
  WATER_HEATER,
  WEATHER,
};

// <
//     DOMAIN extends UsedSupportedFeatureDomains = UsedSupportedFeatureDomains,
//   >(
//     input: PICK_ENTITY<DOMAIN> | ByIdProxy<PICK_ENTITY<DOMAIN>>,
//   ): `${Uppercase<DOMAIN>}.${Extract<keyof SUPPORTED_FEATURES[Uppercase<DOMAIN>], string>}`

export type SUPPORTED_FEATURES = typeof SUPPORTED_FEATURES;
export type SupportedFeatureDomains = Extract<keyof SUPPORTED_FEATURES, string>;
export type UsedSupportedFeatureDomains = Extract<Lowercase<SupportedFeatureDomains>, ALL_DOMAINS>;

export type SupportedFeatures<DOMAIN extends SupportedFeatureDomains = SupportedFeatureDomains> =
  `${DOMAIN}.${Extract<keyof SUPPORTED_FEATURES[DOMAIN], string>}`;
export type SupportedEntityFeatures<
  DOMAIN extends UsedSupportedFeatureDomains = UsedSupportedFeatureDomains,
> = `${Uppercase<DOMAIN>}.${Extract<keyof SUPPORTED_FEATURES[Uppercase<DOMAIN>], string>}`;
