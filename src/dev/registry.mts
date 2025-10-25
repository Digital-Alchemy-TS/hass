/* eslint-disable @cspell/spellchecker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { CLIMATE, LIGHT, TODO } from "../helpers/supported-features.mts";

declare module "../user.mts" {
  export interface HassEntitySetupMapping {
    "button.example": {
      state: string;
      entity_id: "button.example";
      attributes: { friendly_name: "Example button" };
    };
    "date.example": {
      state: "2024-01-15";
      entity_id: "date.example";
      attributes: {
        friendly_name: "Example date";
        icon: "mdi:calendar";
      };
    };
    "datetime.example": {
      state: "2024-01-15T14:30:00";
      entity_id: "datetime.example";
      attributes: {
        friendly_name: "Example datetime";
        icon: "mdi:calendar-clock";
      };
    };
    "lock.example": {
      state: "locked";
      entity_id: "lock.example";
      attributes: {
        friendly_name: "Example lock";
        icon: "mdi:lock";
        supported_features: 3;
      };
    };
    "number.example": {
      state: "25.5";
      entity_id: "number.example";
      attributes: {
        friendly_name: "Example number";
        icon: "mdi:numeric";
        min: 0;
        max: 100;
        step: 0.5;
        mode: "slider";
        unit_of_measurement: "°C";
      };
    };
    "select.example": {
      state: "option1";
      entity_id: "select.example";
      attributes: {
        friendly_name: "Example select";
        icon: "mdi:format-list-bulleted";
        options: ["option1", "option2", "option3"];
      };
    };
    "text.example": {
      state: "Hello World";
      entity_id: "text.example";
      attributes: {
        friendly_name: "Example text";
        icon: "mdi:text";
        max: 100;
        min: 0;
        mode: "text";
        pattern: null;
      };
    };
    "time.example": {
      state: "14:30:00";
      entity_id: "time.example";
      attributes: {
        friendly_name: "Example time";
        icon: "mdi:clock";
      };
    };
    "binary_sensor.hass_e2e_online": {
      attributes: {
        friendly_name: "hass_e2e online";
        restored: true;
        supported_features: 0;
      };
      context: {
        id: "01HWXTSCSBGW129NV7WY8MMG1E";
        parent_id: null;
        user_id: null;
      };
      entity_id: "binary_sensor.hass_e2e_online";

      state: "unavailable";
    };
    "binary_sensor.toggles": {
      attributes: {
        friendly_name: "toggles";
        icon: "mdi:toggle-switch-variant-off";
        restored: true;
        supported_features: 0;
      };
      context: {
        id: "01HWXTSCSB43FF1R6FX0QEE4Z6";
        parent_id: null;
        user_id: null;
      };
      entity_id: "binary_sensor.toggles";
      state: "unavailable";
    };
    "calendar.united_states_tx": {
      attributes: {
        all_day: true;
        description: "";
        end_time: "2024-05-28 00:00:00";
        friendly_name: "United States, TX";
        location: "United States, TX";
        message: "Memorial Day";
        start_time: "2024-05-27 00:00:00";
      };
      context: {
        id: "01HWXTYEEFBB7QQC1CSM6PAR36";
        parent_id: null;
        user_id: null;
      };
      entity_id: "calendar.united_states_tx";
      state: "off";
    };
    "light.bedroom_ceiling_fan": {
      attributes: {
        brightness: null;
        color_mode: null;
        color_temp: null;
        color_temp_kelvin: null;
        friendly_name: "Bedroom Ceiling Fan";
        hs_color: null;
        icon: "mdi:lightbulb-group";
        max_color_temp_kelvin: 6535;
        max_mireds: 500;
        min_color_temp_kelvin: 2000;
        min_mireds: 153;
        rgb_color: null;
        supported_color_modes: ["color_temp", "xy"];
        supported_features: 40;
        xy_color: null;
      };
      context: {
        id: "01HX722Y1JFS6KN2MDERK0VJ2D";
        parent_id: null;
        user_id: null;
      };
      entity_id: "light.bedroom_ceiling_fan";
      state: "off";
    };
    "person.digital_alchemy": {
      attributes: {
        device_trackers: [];
        editable: true;
        friendly_name: "digital-alchemy";
        id: "digital_alchemy";
        user_id: "4dd1cf7e93e94f3fbaf419501f9a3d59";
      };
      context: {
        id: "01HWXTSCSBRKJ9T2KV1JNER5KQ";
        parent_id: null;
        user_id: null;
      };
      entity_id: "person.digital_alchemy";
      state: "unknown";
    };
    "scene.games_room_auto": {
      attributes: {
        "Managed By": "home_automation";
        friendly_name: "bedroom off";
      };
      context: {
        id: "01HWXW289S8HP5MSGNNTNB2CBG";
        parent_id: null;
        user_id: null;
      };
      entity_id: "scene.games_room_auto";
      state: "unknown";
    };
    "sensor.magic": {
      attributes: {
        friendly_name: "magic";
        icon: "mdi:satellite-uplink";
        restored: true;
        supported_features: 0;
      };
      context: {
        id: "01HWXTSCSBW34BP3R20RJ09CVZ";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.magic";
      state: string;
    };
    "sensor.sun_next_dawn": {
      attributes: {
        device_class: "timestamp";
        friendly_name: "Sun Next dawn";
      };
      context: {
        id: "01HWXTS8W1SRTPT5K1XM0G491X";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.sun_next_dawn";

      state: "2024-05-03T03:24:45+00:00";
    };
    "sensor.sun_next_dusk": {
      attributes: {
        device_class: "timestamp";
        friendly_name: "Sun Next dusk";
      };
      context: {
        id: "01HWXTS8W1S95P1MVHDGHSQEB2";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.sun_next_dusk";
      state: "2024-05-03T19:51:10+00:00";
    };
    "sensor.sun_next_midnight": {
      attributes: {
        device_class: "timestamp";
        friendly_name: "Sun Next midnight";
      };
      context: {
        id: "01HWXTS8W1YQCPA3WZ69Y9JSPD";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.sun_next_midnight";
      state: "2024-05-03T23:37:12+00:00";
    };
    "sensor.sun_next_noon": {
      attributes: {
        device_class: "timestamp";
        friendly_name: "Sun Next noon";
      };
      context: {
        id: "01HWXTS8W28MVV48CQ31JB2WKC";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.sun_next_noon";
      state: "2024-05-03T11:37:19+00:00";
    };
    "sensor.sun_next_rising": {
      attributes: {
        device_class: "timestamp";
        friendly_name: "Sun Next rising";
      };
      context: {
        id: "01HWXTS8W2MMADKGWE4A5BMH51";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.sun_next_rising";
      state: "2024-05-03T04:05:17+00:00";
    };
    "sensor.sun_next_setting": {
      attributes: {
        device_class: "timestamp";
        friendly_name: "Sun Next setting";
      };
      context: {
        id: "01HWXTS8W24KWTHR2B6V32NCXG";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.sun_next_setting";
      state: "2024-05-03T19:10:21+00:00";
    };
    "sun.sun": {
      attributes: {
        azimuth: 0.35;
        elevation: -21.86;
        friendly_name: "Sun";
        next_dawn: "2024-05-03T03:24:45.747945+00:00";
        next_dusk: "2024-05-03T19:51:10.358970+00:00";
        next_midnight: "2024-05-03T23:37:12+00:00";
        next_noon: "2024-05-03T11:37:19+00:00";
        next_rising: "2024-05-03T04:05:17.926549+00:00";
        next_setting: "2024-05-03T19:10:21.280558+00:00";
        rising: true;
      };
      context: {
        id: "01HWXTS8W1J2TDGMN7KKNWP8DV";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sun.sun";
      state: "below_horizon";
    };
    "switch.bedroom_lamp": {
      attributes: {
        friendly_name: "bedroom_lamp";
        restored: true;
        supported_features: 0;
      };
      context: {
        id: "01HWXTSCSB7BK003CH3AYYVXCB";
        parent_id: null;
        user_id: null;
      };
      entity_id: "switch.bedroom_lamp";
      state: "unavailable";
    };
    "switch.kitchen_cabinets": {
      attributes: {
        friendly_name: "kitchen_cabinets";
        restored: true;
        supported_features: 0;
      };
      context: {
        id: "01HWXTSCSBM9Y3SRQTFJ5CVK6H";
        parent_id: null;
        user_id: null;
      };
      entity_id: "switch.kitchen_cabinets";
      state: "unavailable";
    };
    "switch.living_room_mood_lights": {
      attributes: {
        friendly_name: "living_room_mood_lights";
        restored: true;
        supported_features: 0;
      };
      context: {
        id: "01HWXTSCSBS5B586JJ7VFH10SX";
        parent_id: null;
        user_id: null;
      };
      entity_id: "switch.living_room_mood_lights";

      state: "unavailable";
    };
    "switch.porch_light": {
      attributes: {
        friendly_name: "porch_light";
        restored: true;
        supported_features: 0;
      };
      context: {
        id: "01HWXTSCSBFTSZR1M5XAK7XSR8";
        parent_id: null;
        user_id: null;
      };
      entity_id: "switch.porch_light";
      state: string;
    };
    "todo.shopping_list": {
      attributes: {
        friendly_name: "Shopping List";
        supported_features: 15;
      };
      context: {
        id: "01HWXTS8X3D417XC4YJTG8QJWB";
        parent_id: null;
        user_id: null;
      };
      entity_id: "todo.shopping_list";
      state: "0";
    };
    "tts.google_en_com": {
      attributes: {
        friendly_name: "Google en com";
      };
      context: {
        id: "01HWXTS8XMPQ236CDJ6X7C6E60";
        parent_id: null;
        user_id: null;
      };
      entity_id: "tts.google_en_com";
      state: "unknown";
    };
    "zone.home": {
      attributes: {
        editable: true;
        friendly_name: "Home";
        icon: "mdi:home";
        latitude: 52.373_133_9;
        longitude: 4.890_314_7;
        passive: false;
        persons: [];
        radius: 100;
      };
      context: {
        id: "01HWXTS8GMB4ZW20P8MGMX0QSN";
        parent_id: null;
        user_id: null;
      };
      entity_id: "zone.home";
      state: "0";
    };
    "binary_sensor.bedroom_window": {
      attributes: {
        id: "digital_alchemy";
        user_id: "4dd1cf7e93e94f3fbaf419501f9a3d59";
        friendly_name: "Bedroom Window Sensor";
      };
      context: {
        id: "01HWXTSCSBRKJ9T2KV1JNER5KQ";
        parent_id: null;
        user_id: null;
      };
      entity_id: "binary_sensor.bedroom_window";
      state: "on";
    };
    "binary_sensor.garage_door": {
      attributes: {
        device_class: "door";
        friendly_name: "Garage Door Sensor";
      };
      context: {
        id: "05FGHIJKLMNO4PQR5STUV6789WX";
        parent_id: null;
        user_id: null;
      };
      entity_id: "binary_sensor.garage_door";
      state: "off";
    };
    "climate.hallway_thermostat": {
      attributes: {
        current_temperature: 22;
        target_temperature: 20;
        hvac_mode: "cool";
        friendly_name: "Hallway Thermostat";
        supported_features: 1;
      };
      context: {
        id: "04MNOPQRSTUV8WX9YZABCDE123";
        parent_id: null;
        user_id: null;
      };
      entity_id: "climate.hallway_thermostat";
      state: "cool";
    };
    "climate.test_room": {
      attributes: {
        id: "digital_alchemy";
        user_id: "4dd1cf7e93e94f3fbaf419501f9a3d59";
        friendly_name: "Test Room Climate";
      };
      context: {
        id: "01HWXTSCSBRKJ9T2KV1JNER5KQ";
        parent_id: null;
        user_id: null;
      };
      entity_id: "climate.test_room";
      state: "cooling";
    };
    "light.bedroom_light": {
      attributes: {
        brightness: 255;
        friendly_name: "Bedroom Light";
        supported_features: 41;
      };
      context: {
        id: "03UVWXYZABCDE123FGHI456JKL7";
        parent_id: null;
        user_id: null;
      };
      entity_id: "light.bedroom_light";
      state: "on";
    };
    "light.kitchen_lamp": {
      attributes: {
        id: "digital_alchemy";
        user_id: "4dd1cf7e93e94f3fbaf419501f9a3d59";
        friendly_name: "Kitchen Lamp";
      };
      context: {
        id: "01HWXTSCSBRKJ9T2KV1JNER5KQ";
        parent_id: null;
        user_id: null;
      };
      entity_id: "light.kitchen_lamp";
      state: "off";
    };
    "sensor.bedroom_disabled_temp": {
      attributes: {
        id: "digital_alchemy";
        user_id: "disabled_test_3";
        friendly_name: "Bedroom Disabled Temp";
      };
      context: {
        id: "ctx3";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.bedroom_disabled_temp";
      state: "unknown";
    };
    "sensor.floor_test_disabled": {
      attributes: {
        id: "digital_alchemy";
        user_id: "disabled_test_4";
        friendly_name: "Floor Test Disabled";
      };
      context: {
        id: "ctx4";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.floor_test_disabled";
      state: "unknown";
    };
    "sensor.kitchen_disabled_temp": {
      attributes: {
        id: "digital_alchemy";
        user_id: "disabled_test_2";
        friendly_name: "Kitchen Disabled Temp";
      };
      context: {
        id: "ctx2";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.kitchen_disabled_temp";
      state: "unknown";
    };
    "sensor.label_test_disabled": {
      attributes: {
        id: "digital_alchemy";
        user_id: "disabled_test_5";
        friendly_name: "Label Test Disabled";
      };
      context: {
        id: "ctx5";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.label_test_disabled";
      state: "unknown";
    };
    "sensor.living_room_disabled_temp": {
      attributes: {
        id: "digital_alchemy";
        user_id: "disabled_test_1";
        friendly_name: "Living Room Disabled Temp";
      };
      context: {
        id: "ctx1";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.living_room_disabled_temp";
      state: "unknown";
    };
    "sensor.living_room_temperature": {
      attributes: {
        id: "digital_alchemy";
        user_id: "4dd1cf7e93e94f3fbaf419501f9a3d59";
        friendly_name: "Living Room Temperature";
      };
      context: {
        id: "01HWXTSCSBRKJ9T2KV1JNER5KQ";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.living_room_temperature";
      state: "unavailable";
    };
    "sensor.sun_solar_azimuth": {
      attributes: {
        device_class: "angle";
        friendly_name: "Sun Solar azimuth";
        unit_of_measurement: "°";
      };
      context: {
        id: "01HWXTS8W2MMADKGWE4A5BMH51";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.sun_solar_azimuth";
      state: "0.35";
    };
    "sensor.sun_solar_elevation": {
      attributes: {
        device_class: "angle";
        friendly_name: "Sun Solar elevation";
        unit_of_measurement: "°";
      };
      context: {
        id: "01HWXTS8W1J2TDGMN7KKNWP8DV";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.sun_solar_elevation";
      state: "-21.86";
    };
    "sensor.sun_solar_rising": {
      attributes: {
        device_class: "timestamp";
        friendly_name: "Sun Solar rising";
      };
      context: {
        id: "01HWXTS8W2MMADKGWE4A5BMH51";
        parent_id: null;
        user_id: null;
      };
      entity_id: "sensor.sun_solar_rising";
      state: "2024-05-03T04:05:17+00:00";
    };
    "light.test_light": {
      attributes: { supported_features: LIGHT.EFFECT | LIGHT.FLASH | LIGHT.TRANSITION };
      entity_id: "light.test_light";
      state: "on";
    };
    "todo.test_todo": {
      attributes: {
        supported_features:
          | TODO.CREATE_TODO_ITEM
          | TODO.DELETE_TODO_ITEM
          | TODO.UPDATE_TODO_ITEM
          | TODO.MOVE_TODO_ITEM;
      };
      entity_id: "todo.test_todo";
      state: "0";
    };
    "climate.test_climate": {
      attributes: { supported_features: CLIMATE.TARGET_TEMPERATURE };
      entity_id: "climate.test_climate";
      state: "cool";
    };
    "unsupported.test": {
      attributes: { supported_features: 1 };
      entity_id: "unsupported.test";
      state: "on";
    };
  }
}
