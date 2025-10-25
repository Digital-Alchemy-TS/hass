/* eslint-disable sort-keys-fix/sort-keys-fix */

import type { ALL_DOMAINS } from "../user.mts";

/**
 * homeassistant/components/light/const.py
 */
export const LIGHT = {
  EFFECT: 4,
  FLASH: 8,
  TRANSITION: 32,
} as const;

/**
 * homeassistant/components/vacuum/__init__.py
 */
export const VACUUM = {
  /**
   * Deprecated
   */
  TURN_ON: 1,
  /**
   * Deprecated
   */
  TURN_OFF: 2,
  PAUSE: 4,
  STOP: 8,
  RETURN_HOME: 16,
  FAN_SPEED: 32,
  BATTERY: 64,
  /**
   * Deprecated
   */
  STATUS: 128,
  SEND_COMMAND: 256,
  LOCATE: 512,
  CLEAN_SPOT: 1024,
  MAP: 2048,
  STATE: 4096,
  START: 8192,
} as const;

/**
 * homeassistant/components/water_heater/__init__.py
 */
export const WATER_HEATER = {
  TARGET_TEMPERATURE: 1,
  OPERATION_MODE: 2,
  AWAY_MODE: 4,
  ON_OFF: 8,
} as const;

/**
 * homeassistant/components/valve/__init__.py
 */
export const VALVE = {
  OPEN: 1,
  CLOSE: 2,
  SET_POSITION: 4,
  STOP: 8,
} as const;

/**
 * homeassistant/components/weather/const.py
 */
export const WEATHER = {
  FORECAST_DAILY: 1,
  FORECAST_HOURLY: 2,
  FORECAST_TWICE_DAILY: 4,
} as const;

/**
 * homeassistant/components/ai_task/const.py
 */
export const AI_TASK = {
  ATTACHMENTS: 2,
} as const;

/**
 * homeassistant/components/switch/__init__.py
 */
export const SWITCH = {
  TURN_ON: 1,
  TURN_OFF: 2,
} as const;

/**
 * homeassistant/components/cover/__init__.py
 */
export const COVER = {
  OPEN: 1,
  CLOSE: 2,
  SET_POSITION: 4,
  STOP: 8,
  OPEN_TILT: 16,
  CLOSE_TILT: 32,
  STOP_TILT: 64,
  SET_TILT_POSITION: 128,
} as const;

/**
 * homeassistant/components/fan/__init__.py
 */
export const FAN = {
  SET_SPEED: 1,
  OSCILLATE: 2,
  DIRECTION: 4,
  PRESET_MODE: 8,
  TURN_OFF: 16,
  TURN_ON: 32,
} as const;

/**
 * homeassistant/components/climate/const.py
 */
export const CLIMATE = {
  TARGET_TEMPERATURE: 1,
  TARGET_TEMPERATURE_RANGE: 2,
  TARGET_HUMIDITY: 4,
  FAN_MODE: 8,
  PRESET_MODE: 16,
  SWING_MODE: 32,
  TURN_OFF: 128,
  TURN_ON: 256,
  SWING_HORIZONTAL_MODE: 512,
} as const;

/**
 * homeassistant/components/media_player/const.py
 */
export const MEDIA_PLAYER = {
  PAUSE: 1,
  SEEK: 2,
  VOLUME_SET: 4,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,
  TURN_ON: 128,
  TURN_OFF: 256,
  PLAY_MEDIA: 512,
  VOLUME_STEP: 1024,
  SELECT_SOURCE: 2048,
  STOP: 4096,
  CLEAR_PLAYLIST: 8192,
  PLAY: 16384,
  SHUFFLE_SET: 32768,
  SELECT_SOUND_MODE: 65536,
  BROWSE_MEDIA: 131072,
  REPEAT_SET: 262144,
  GROUPING: 524288,
  MEDIA_ANNOUNCE: 1048576,
  MEDIA_ENQUEUE: 2097152,
  SEARCH_MEDIA: 4194304,
} as const;

/**
 * homeassistant/components/camera/__init__.py
 */
export const CAMERA = {
  ON_OFF: 1,
  STREAM: 2,
} as const;

/**
 * homeassistant/components/lock/__init__.py
 */
export const LOCK = {
  OPEN: 1,
} as const;

/**
 * homeassistant/components/alarm_control_panel/__init__.py
 */
export const ALARM_CONTROL_PANEL = {
  ARM_HOME: 1,
  ARM_AWAY: 2,
  ARM_NIGHT: 4,
  ARM_VACATION: 8,
  ARM_CUSTOM_BYPASS: 16,
} as const;

/**
 * homeassistant/components/binary_sensor/__init__.py
 */
export const BINARY_SENSOR = {
  TURN_ON: 1,
  TURN_OFF: 2,
} as const;

/**
 * homeassistant/components/sensor/__init__.py
 */
export const SENSOR = {
  TURN_ON: 1,
  TURN_OFF: 2,
} as const;

/**
 * homeassistant/components/update/const.py
 */
export const UPDATE = {
  INSTALL: 1,
  SPECIFIC_VERSION: 2,
  PROGRESS: 4,
  BACKUP: 8,
  RELEASE_NOTES: 16,
} as const;

/**
 * homeassistant/components/button/__init__.py
 */
export const BUTTON = {
  TURN_ON: 1,
  TURN_OFF: 2,
} as const;

/**
 * homeassistant/components/number/__init__.py
 */
export const NUMBER = {
  TURN_ON: 1,
  TURN_OFF: 2,
} as const;

/**
 * homeassistant/components/select/__init__.py
 */
export const SELECT = {
  TURN_ON: 1,
  TURN_OFF: 2,
} as const;

/**
 * homeassistant/components/siren/const.py
 */
export const SIREN = {
  TURN_ON: 1,
  TURN_OFF: 2,
  TONES: 4,
  VOLUME_SET: 8,
  DURATION: 16,
} as const;

/**
 * homeassistant/components/text/__init__.py
 */
export const TEXT = {
  TURN_ON: 1,
  TURN_OFF: 2,
} as const;

/**
 * homeassistant/components/todo/const.py
 */
export const TODO_LIST = {
  CREATE_TODO_ITEM: 1,
  DELETE_TODO_ITEM: 2,
  UPDATE_TODO_ITEM: 4,
  MOVE_TODO_ITEM: 8,
  SET_DUE_DATE_ON_ITEM: 16,
  SET_DUE_DATETIME_ON_ITEM: 32,
  SET_DESCRIPTION_ON_ITEM: 64,
} as const;

/**
 * homeassistant/components/humidifier/const.py
 */
export const HUMIDIFIER = {
  MODES: 1,
} as const;

/**
 * homeassistant/components/remote/__init__.py
 */
export const REMOTE = {
  LEARN_COMMAND: 1,
  DELETE_COMMAND: 2,
  ACTIVITY: 4,
} as const;

/**
 * homeassistant/components/notify/__init__.py
 */
export const NOTIFY = {
  TITLE: 1,
} as const;

/**
 * Registry for other library logic to take advantage of
 */
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
} as const;

export type SUPPORTED_FEATURES = typeof SUPPORTED_FEATURES;
export type SupportedFeatureDomains = Extract<keyof SUPPORTED_FEATURES, string>;
export type UsedSupportedFeatureDomains = Extract<Lowercase<SupportedFeatureDomains>, ALL_DOMAINS>;

export type SupportedFeatures<DOMAIN extends SupportedFeatureDomains = SupportedFeatureDomains> =
  `${DOMAIN}.${Extract<keyof SUPPORTED_FEATURES[DOMAIN], string>}`;
export type SupportedEntityFeatures<
  DOMAIN extends UsedSupportedFeatureDomains = UsedSupportedFeatureDomains,
> = `${Uppercase<DOMAIN>}.${Extract<keyof SUPPORTED_FEATURES[Uppercase<DOMAIN>], string>}`;
