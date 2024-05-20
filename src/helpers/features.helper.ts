/* eslint-disable @typescript-eslint/no-magic-numbers */
/**
 * This file contains enums to match ones in python in home assistant core python code
 */

// * homeassistant/components/light/__init__.py
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
export const VALID_COLOR_MODES = new Set([
  ...COLOR_MODES_BRIGHTNESS.values(),
  ColorMode.ONOFF,
]);
export enum ColorValueFields {
  ATTR_RGB_COLOR = "rgb_color",
  ATTR_RGBW_COLOR = "rgbw_color",
  ATTR_RGBWW_COLOR = "rgbww_color",
  ATTR_XY_COLOR = "xy_color",
  ATTR_HS_COLOR = "hs_color",
  ATTR_COLOR_TEMP_KELVIN = "color_temp_kelvin",
  ATTR_MIN_COLOR_TEMP_KELVIN = "min_color_temp_kelvin",
  ATTR_MAX_COLOR_TEMP_KELVIN = "max_color_temp_kelvin",
  ATTR_COLOR_NAME = "color_name",
  ATTR_WHITE = "white",
}
export enum BrightnessValueFields {
  ATTR_BRIGHTNESS = "brightness",
  ATTR_BRIGHTNESS_PCT = "brightness_pct",
  ATTR_BRIGHTNESS_STEP = "brightness_step",
  ATTR_BRIGHTNESS_STEP_PCT = "brightness_step_pct",
}
