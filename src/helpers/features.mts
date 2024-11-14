/* eslint-disable @typescript-eslint/no-magic-numbers */
// * This file contains enums to match ones in python in home assistant core python code
// Most things are 1-1, with some minor corrections made in transcribing

/**
 * Supported features of the light entity.
 */
export enum LightEntityFeature {
  flash = 8,
  transition = 32,
  effect = 4,
}
/**
 * Possible light color modes.
 */
export enum ColorMode {
  /** Ambiguous color mode */
  UNKNOWN = "unknown",
  /** Must be the only supported mode */
  ONOFF = "onoff",
  /** Must be the only supported mode */
  BRIGHTNESS = "brightness",
  COLOR_TEMP = "color_temp",
  HS = "hs",
  XY = "xy",
  RGB = "rgb",
  RGBW = "rgbw",
  RGBWW = "rgbww",
  /** Must *NOT* be the only supported mode */
  WHITE = "white",
}

export const COLOR_MODES_COLOR = new Set([
  ColorMode.HS,
  ColorMode.RGB,
  ColorMode.RGBW,
  ColorMode.RGBWW,
  ColorMode.XY,
]);

export const COLOR_MODES_BRIGHTNESS = new Set([
  ColorMode.BRIGHTNESS,
  ColorMode.COLOR_TEMP,
  ColorMode.HS,
  ColorMode.XY,
  ColorMode.RGB,
  ColorMode.RGBW,
  ColorMode.RGBWW,
  ColorMode.WHITE,
]);

export const VALID_COLOR_MODES = new Set([...COLOR_MODES_BRIGHTNESS.values(), ColorMode.ONOFF]);

/**
 * Supported features of the fan entity.
 */
export enum FanEntityFeature {
  SET_SPEED = 1,
  OSCILLATE = 2,
  DIRECTION = 4,
  PRESET_MODE = 8,
}

/**
 * Device class for buttons.
 */
export enum ButtonDeviceClass {
  IDENTIFY = "identify",
  RESTART = "restart",
  UPDATE = "update",
}

/**
 * Code formats for the Alarm Control Panel.
 */
export enum CodeFormat {
  TEXT = "text",
  NUMBER = "number",
}

/**
 * Supported features of the alarm control panel entity.
 */
export enum AlarmControlPanelEntityFeature {
  ARM_HOME = 1,
  ARM_AWAY = 2,
  ARM_NIGHT = 4,
  TRIGGER = 8,
  ARM_CUSTOM_BYPASS = 16,
  ARM_VACATION = 32,
}

/**
 * Device class for binary sensors.
 */
export enum BinarySensorDeviceClass {
  /** On means low, Off means normal */
  BATTERY = "battery",

  /** On means charging, Off means not charging */
  BATTERY_CHARGING = "battery_charging",

  /** On means carbon monoxide detected, Off means no carbon monoxide (clear) */
  CO = "carbon_monoxide",

  /** On means cold, Off means normal */
  COLD = "cold",

  /** On means connected, Off means disconnected */
  CONNECTIVITY = "connectivity",

  /** On means open, Off means closed */
  DOOR = "door",

  /** On means open, Off means closed */
  GARAGE_DOOR = "garage_door",

  /** On means gas detected, Off means no gas (clear) */
  GAS = "gas",

  /** On means hot, Off means normal */
  HEAT = "heat",

  /** On means light detected, Off means no light */
  LIGHT = "light",

  /** On means open (unlocked), Off means closed (locked) */
  LOCK = "lock",

  /** On means wet, Off means dry */
  MOISTURE = "moisture",

  /** On means motion detected, Off means no motion (clear) */
  MOTION = "motion",

  /** On means moving, Off means not moving (stopped) */
  MOVING = "moving",

  /** On means occupied, Off means not occupied (clear) */
  OCCUPANCY = "occupancy",

  /** On means open, Off means closed */
  OPENING = "opening",

  /** On means plugged in, Off means unplugged */
  PLUG = "plug",

  /** On means power detected, Off means no power */
  POWER = "power",

  /** On means home, Off means away */
  PRESENCE = "presence",

  /** On means problem detected, Off means no problem (OK) */
  PROBLEM = "problem",

  /** On means running, Off means not running */
  RUNNING = "running",

  /** On means unsafe, Off means safe */
  SAFETY = "safety",

  /** On means smoke detected, Off means no smoke (clear) */
  SMOKE = "smoke",

  /** On means sound detected, Off means no sound (clear) */
  SOUND = "sound",

  /** On means tampering detected, Off means no tampering (clear) */
  TAMPER = "tamper",

  /** On means update available, Off means up-to-date */
  UPDATE = "update",

  /** On means vibration detected, Off means no vibration */
  VIBRATION = "vibration",

  /** On means open, Off means closed */
  WINDOW = "window",
}

/**
 * Supported features of the calendar entity.
 */
export enum CalendarEntityFeature {
  CREATE_EVENT = 1,
  DELETE_EVENT = 2,
  UPDATE_EVENT = 4,
}

/**
 * Supported features of the camera entity.
 */
export enum CameraEntityFeature {
  ON_OFF = 1,
  STREAM = 2,
}

/**
 * Camera stream type.
 *
 * A camera that supports CAMERA_SUPPORT_STREAM may have a single stream
 * type which is used to inform the frontend which player to use.
 * Streams with RTSP sources typically use the stream component which uses
 * HLS for display. WebRTC streams use the home assistant core for a signal
 * path to initiate a stream, but the stream itself is between the client and
 * device.
 */
export enum StreamType {
  HLS = "hls",
  WEB_RTC = "web_rtc",
}

/**
 * HVAC mode for climate devices.
 */
export enum HVACMode {
  /** All activity disabled / Device is off/standby */
  OFF = "off",

  /** Heating */
  HEAT = "heat",

  /** Cooling */
  COOL = "cool",

  /** The device supports heating/cooling to a range */
  HEAT_COOL = "heat_cool",

  /** The temperature is set based on a schedule, learned behavior, AI or some
   * other related mechanism. User is not able to adjust the temperature */
  AUTO = "auto",

  /** Device is in Dry/Humidity mode */
  DRY = "dry",

  /** Only the fan is on, not fan and another mode like cool */
  FAN_ONLY = "fan_only",
}

/**
 * HVAC action for climate devices.
 */
export enum HVACAction {
  COOLING = "cooling",
  DRYING = "drying",
  FAN = "fan",
  HEATING = "heating",
  IDLE = "idle",
  OFF = "off",
  PREHEATING = "preheating",
}

/**
 * Supported features of the climate entity.
 */
export enum ClimateEntityFeature {
  TARGET_TEMPERATURE = 1,
  TARGET_TEMPERATURE_RANGE = 2,
  TARGET_HUMIDITY = 4,
  FAN_MODE = 8,
  PRESET_MODE = 16,
  SWING_MODE = 32,
  AUX_HEAT = 64,
  TURN_OFF = 128,
  TURN_ON = 256,
}

/**
 * Device class for cover.
 */
export enum CoverDeviceClass {
  /** Refer to the cover dev docs for device class descriptions */
  AWNING = "awning",
  BLIND = "blind",
  CURTAIN = "curtain",
  DAMPER = "damper",
  DOOR = "door",
  GARAGE = "garage",
  GATE = "gate",
  SHADE = "shade",
  SHUTTER = "shutter",
  WINDOW = "window",
}

/**
 * Supported features of the cover entity.
 */
export enum CoverEntityFeature {
  OPEN = 1,
  CLOSE = 2,
  SET_POSITION = 4,
  STOP = 8,
  OPEN_TILT = 16,
  CLOSE_TILT = 32,
  STOP_TILT = 64,
  SET_TILT_POSITION = 128,
}
/**
 * Device class for humidifiers.
 */
export enum HumidifierDeviceClass {
  HUMIDIFIER = "humidifier",
  DEHUMIDIFIER = "dehumidifier",
}
/**
 * Actions for humidifier devices.
 */
export enum HumidifierAction {
  HUMIDIFYING = "humidifying",
  DRYING = "drying",
  IDLE = "idle",
  OFF = "off",
}

/**
 * Supported features of the alarm control panel entity.
 */
export enum HumidifierEntityFeature {
  MODES = 1,
}

/**
 * Activity state of lawn mower devices.
 */
export enum LawnMowerActivity {
  /** Device is in error state, needs assistance. */
  ERROR = "error",

  /** Paused during activity. */
  PAUSED = "paused",

  /** Device is mowing. */
  MOWING = "mowing",

  /** Device is docked. */
  DOCKED = "docked",
}

/**
 * Supported features of the lawn mower entity.
 */
export enum LawnMowerEntityFeature {
  START_MOWING = 1,
  PAUSE = 2,
  DOCK = 4,
}

/**
 * Supported features of the lock entity.
 */
export enum LockEntityFeature {
  OPEN = 1,
}

/**
 * Enqueue types for playing media.
 */
export enum MediaPlayerEnqueue {
  /** Add given media item to end of the queue */
  ADD = "add",
  /** Play the given media item next, keep queue */
  NEXT = "next",
  /** Play the given media item now, keep queue */
  PLAY = "play",
  /** Play the given media item now, clear queue */
  REPLACE = "replace",
}

/**
 * State of media player entities.
 */
export enum MediaPlayerState {
  OFF = "off",
  ON = "on",
  IDLE = "idle",
  PLAYING = "playing",
  PAUSED = "paused",
  STANDBY = "standby",
  BUFFERING = "buffering",
}

/**
 * Media class for media player entities.
 */
export enum MediaClass {
  ALBUM = "album",
  APP = "app",
  ARTIST = "artist",
  CHANNEL = "channel",
  COMPOSER = "composer",
  CONTRIBUTING_ARTIST = "contributing_artist",
  DIRECTORY = "directory",
  EPISODE = "episode",
  GAME = "game",
  GENRE = "genre",
  IMAGE = "image",
  MOVIE = "movie",
  MUSIC = "music",
  PLAYLIST = "playlist",
  PODCAST = "podcast",
  SEASON = "season",
  TRACK = "track",
  TV_SHOW = "tv_show",
  URL = "url",
  VIDEO = "video",
}

/**
 * Media type for media player entities.
 */
export enum MediaType {
  ALBUM = "album",
  APP = "app",
  APPS = "apps",
  ARTIST = "artist",
  CHANNEL = "channel",
  CHANNELS = "channels",
  COMPOSER = "composer",
  CONTRIBUTING_ARTIST = "contributing_artist",
  EPISODE = "episode",
  GAME = "game",
  GENRE = "genre",
  IMAGE = "image",
  MOVIE = "movie",
  MUSIC = "music",
  PLAYLIST = "playlist",
  PODCAST = "podcast",
  SEASON = "season",
  TRACK = "track",
  TVSHOW = "tvshow",
  URL = "url",
  VIDEO = "video",
}

/**
 * Repeat mode for media player entities.
 */
export enum RepeatMode {
  ALL = "all",
  OFF = "off",
  ONE = "one",
}

/**
 * Supported features of the media player entity.
 */
export enum MediaPlayerEntityFeature {
  PAUSE = 1,
  SEEK = 2,
  VOLUME_SET = 4,
  VOLUME_MUTE = 8,
  PREVIOUS_TRACK = 16,
  NEXT_TRACK = 32,
  TURN_ON = 128,
  TURN_OFF = 256,
  PLAY_MEDIA = 512,
  VOLUME_STEP = 1024,
  SELECT_SOURCE = 2048,
  STOP = 4096,
  CLEAR_PLAYLIST = 8192,
  PLAY = 16_384,
  SHUFFLE_SET = 32_768,
  SELECT_SOUND_MODE = 65_536,
  BROWSE_MEDIA = 131_072,
  REPEAT_SET = 262_144,
  GROUPING = 524_288,
  MEDIA_ANNOUNCE = 1_048_576,
  MEDIA_ENQUEUE = 2_097_152,
}

/**
 * Supported features of a notify entity.
 */
export enum NotifyEntityFeature {
  TITLE = 1,
}

/**
 * Supported features of the remote entity.
 */
export enum RemoteEntityFeature {
  LEARN_COMMAND = 1,
  DELETE_COMMAND = 2,
  ACTIVITY = 4,
}

/**
 * Supported features of the siren entity.
 */
export enum SirenEntityFeature {
  TURN_ON = 1,
  TURN_OFF = 2,
  TONES = 4,
  VOLUME_SET = 8,
  DURATION = 16,
}

/**
 * Device class for switches.
 */
export enum SwitchDeviceClass {
  OUTLET = "outlet",
  SWITCH = "switch",
}

/**
 * Supported features of the vacuum entity.
 */
export enum VacuumEntityFeature {
  TURN_ON = 1, // Deprecated, not supported by StateVacuumEntity
  TURN_OFF = 2, // Deprecated, not supported by StateVacuumEntity
  PAUSE = 4,
  STOP = 8,
  RETURN_HOME = 16,
  FAN_SPEED = 32,
  BATTERY = 64,
  STATUS = 128, // Deprecated, not supported by StateVacuumEntity
  SEND_COMMAND = 256,
  LOCATE = 512,
  CLEAN_SPOT = 1024,
  MAP = 2048,
  STATE = 4096, // Must be set by vacuum platforms derived from StateVacuumEntity
  START = 8192,
}

/**
 * Device class for valve.
 */
export enum ValveDeviceClass {
  WATER = "water",
  GAS = "gas",
}

/**
 * Supported features of the valve entity.
 */
export enum ValveEntityFeature {
  OPEN = 1,
  CLOSE = 2,
  SET_POSITION = 4,
  STOP = 8,
}

/**
 * Supported features of the water heater entity.
 */
export enum WaterHeaterEntityFeature {
  TARGET_TEMPERATURE = 1,
  OPERATION_MODE = 2,
  AWAY_MODE = 4,
  ON_OFF = 8,
}

/**
 * Supported features of the weather entity.
 */
export enum WeatherEntityFeature {
  FORECAST_DAILY = 1,
  FORECAST_HOURLY = 2,
  FORECAST_TWICE_DAILY = 4,
}

/**
 * Device class for update.
 */
export enum UpdateDeviceClass {
  FIRMWARE = "firmware",
}

/**
 * Supported features of the update entity.
 */
export enum UpdateEntityFeature {
  INSTALL = 1,
  SPECIFIC_VERSION = 2,
  PROGRESS = 4,
  BACKUP = 8,
  RELEASE_NOTES = 16,
}
