
// Comes from https://www.home-assistant.io/integrations/weather/#action-weatherget_forecasts

export type WeatherCondition =
  | "clear-night"
  | "cloudy"
  | "fog"
  | "hail"
  | "lightning"
  | "lightning-rainy"
  | "partlycloudy"
  | "pouring"
  | "rainy"
  | "snowy"
  | "snowy-rainy"
  | "sunny"
  | "windy"
  | "windy-variant"
  | "exceptional";

export interface WeatherGetForecasts {
  /**
   * Time of the forcasted conditions.
   * Format is YYYY-MM-DDTHH:mm:ss+zz:zz
   */
  datetime: string;
  /**
   * Only set for <code>twice_daily</code> forecasts
   */
  is_daytime: boolean;
  /**
   * The apparent (feels-like) temperature in the unit indicated by the <code>temperature_unite</code> state attribute.
   */
  apparent_temperature: number;
  /**
   * The cloud coverage in %.
   */
  cloud_coverage: number;
  /**
   * The weather condition
   */
  condition: WeatherCondition;
  /**
   * The dew point temperature in the unit indicated by the <code>temperature_unite</code> state attribute.
   */
  dew_point: number;
/**
 * The relative humidity in %.
 */
  humidity: number;
  /**
   * The probability of precipitation in %;
   */
  precipitation_probability: number;
  /**
   * The precipitation amount in the unit indicated by the <code>precipitation_unit</code> state attribute.
   */
  precipitation: number;
  /**
   * The air pressure in the unit indicated by the <code>pressure_unit</code> state attribute.
   */
  pressure: number;
  /**
   * The temperature in the unit indicated by the <code>temperature_unite</code> state attribute. If <code>templow</code> is also provided this is the higher temperature.
   */
  temperature: number;
  /**
   * The lower temperature in the unit indicated by the <code>temperature_unite</code> state attribute.
   */
  templow: number;
  /**
   * The UV index.
   */
  uv_index: number;
  /**
   * The wind bearing in azimuth angle (degrees) or 1-3 letter cardinal direction
   */
  wind_bearing: number | string;
  /**
   * The wind gust speed in the unit indicated by the <code>wind_speed_unit</code> state attribute.
   */
  wind_gust_speed: number;
  /**
   * The wind speed in the unit indicated by the <code>wind_speed_unit</code> state attribute.
   */
  wind_speed: number;
}
