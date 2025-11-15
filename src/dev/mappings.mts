declare module "../user.mts" {
  export interface HassUniqueIdMapping {
    "5622d76001a335e3ea893c4d60d31b3d-next_dawn": "sensor.sun_next_dawn";
    "5622d76001a335e3ea893c4d60d31b3d-next_dusk": "sensor.sun_next_dusk";
    "5622d76001a335e3ea893c4d60d31b3d-next_midnight": "sensor.sun_next_midnight";
    "5622d76001a335e3ea893c4d60d31b3d-next_noon": "sensor.sun_next_noon";
    "5622d76001a335e3ea893c4d60d31b3d-next_rising": "sensor.sun_next_rising";
    "5622d76001a335e3ea893c4d60d31b3d-next_setting": "sensor.sun_next_setting";
    "5622d76001a335e3ea893c4d60d31b3d-solar_elevation": "sensor.sun_solar_elevation";
    "6d8acf36200c5ff8d2d9bb1b1f1dbe00c7eb5b7540103fd90c9a035f82967431": "button.start_white_noise";
    "5622d76001a335e3ea893c4d60d31b3d-solar_azimuth": "sensor.sun_solar_azimuth";
    "5622d76001a335e3ea893c4d60d31b3d-solar_rising": "sensor.sun_solar_rising";
    digital_alchemy: "person.digital_alchemy";
    "6acd101923c0460fc31bad82c4efa140": "todo.shopping_list";
    "4a7fc2592d3a98e0eed8cbc73e839c1c": "tts.google_en_com";
    hass_e2e_is_online: "binary_sensor.hass_e2e_online";
    e1806fdc93296bbd5ab42967003cd38729ff9ba6cfeefc3e15a03ad01ac894fe: "sensor.magic";
    a6e8373221727e197144ba689d7606d4be6f609f2fd0fd8e17516548780465ab: "binary_sensor.toggles";
    "413eb6d69bbec134a07a6d32effd3c3763955e611f43256600cca40725276816": "switch.bedroom_lamp";
    "06d5a22e681ee9c668f8563bd3108853fb053c43342131782afe989090c4ced9": "switch.kitchen_cabinets";
    "27b4fc99f35bbdd1a07173caff5b52f86e3bc342db96f48427e47980b0fb6b49": "switch.living_room_mood_lights";
    "8eb8c1f8c760e97cfa49a0a29cd6891313a1e9a45dd046a556a9f317778cf50a": "switch.porch_light";
    "05ecbbc6111791b6baacbbb60397db14": "calendar.united_states_tx";
    date_example_unique_id: "date.example";
    datetime_example_unique_id: "datetime.example";
    lock_example_unique_id: "lock.example";
    number_example_unique_id: "number.example";
    select_example_unique_id: "select.example";
    text_example_unique_id: "text.example";
    time_example_unique_id: "time.example";
    light_test_light_unique_id: "light.test_light";
    todo_test_todo_unique_id: "todo.test_todo";
    climate_test_climate_unique_id: "climate.test_climate";
    unsupported_test_unique_id: "unsupported.test";
  }

  export interface HassZoneMapping {
    test: true;
  }

  export interface HassDomainMapping {
    automation: "automation.example";
    binary_sensor:
      | "binary_sensor.bedroom_window"
      | "binary_sensor.garage_door"
      | "binary_sensor.hass_e2e_online"
      | "binary_sensor.toggles";
    button: "button.example";
    calendar: "calendar.united_states_tx";
    climate: "climate.hallway_thermostat" | "climate.test_room" | "climate.test_climate";
    date: "date.example";
    datetime: "datetime.example";
    light:
      | "light.bedroom_ceiling_fan"
      | "light.bedroom_light"
      | "light.kitchen_lamp"
      | "light.test_light";
    lock: "lock.example";
    number: "number.example";
    person: "person.digital_alchemy";
    scene: "scene.games_room_auto";
    select: "select.example";
    sensor:
      | "sensor.bedroom_disabled_temp"
      | "sensor.floor_test_disabled"
      | "sensor.kitchen_disabled_temp"
      | "sensor.label_test_disabled"
      | "sensor.living_room_disabled_temp"
      | "sensor.living_room_temperature"
      | "sensor.magic"
      | "sensor.sun_next_dawn"
      | "sensor.sun_next_dusk"
      | "sensor.sun_next_midnight"
      | "sensor.sun_next_noon"
      | "sensor.sun_next_rising"
      | "sensor.sun_next_setting"
      | "sensor.sun_solar_azimuth"
      | "sensor.sun_solar_elevation"
      | "sensor.sun_solar_rising";
    sun: "sun.sun";
    switch:
      | "switch.bedroom_lamp"
      | "switch.kitchen_cabinets"
      | "switch.living_room_mood_lights"
      | "switch.porch_light";
    text: "text.example";
    time: "time.example";
    todo: "todo.shopping_list" | "todo.test_todo";
    tts: "tts.google_en_com";
    unsupported: "unsupported.test";
    zone: "zone.home";
  }

  export interface HassPlatformMapping {
    _sun:
      | "sensor.sun_next_dawn"
      | "sensor.sun_next_dusk"
      | "sensor.sun_next_midnight"
      | "sensor.sun_next_noon"
      | "sensor.sun_next_rising"
      | "sensor.sun_next_setting"
      | "sensor.sun_solar_elevation"
      | "sensor.sun_solar_azimuth"
      | "sensor.sun_solar_rising";
    _person: "person.digital_alchemy";
    _shopping_list: "todo.shopping_list";
    _google_translate: "tts.google_en_com";
    _synapse:
      | "binary_sensor.hass_e2e_online"
      | "sensor.magic"
      | "button.example"
      | "binary_sensor.toggles"
      | "switch.bedroom_lamp"
      | "switch.kitchen_cabinets"
      | "switch.living_room_mood_lights"
      | "switch.porch_light"
      | "light.test_light"
      | "todo.test_todo"
      | "climate.test_climate"
      | "unsupported.test";
    _holiday: "calendar.united_states_tx";
  }

  export interface HassDeviceMapping {
    _308e39cf50a9fc6c30b4110724ed1f2e:
      | "sensor.sun_next_dawn"
      | "sensor.sun_next_dusk"
      | "sensor.sun_next_midnight"
      | "sensor.sun_next_noon"
      | "sensor.sun_next_rising"
      | "sensor.sun_next_setting"
      | "button.example"
      | "sensor.sun_solar_elevation"
      | "sensor.sun_solar_azimuth"
      | "sensor.sun_solar_rising";
    _e58841e47cf86097b310316e55d6bb12: "calendar.united_states_tx";
  }

  export interface HassAreaMapping {
    _test: "switch.living_room_mood_lights";
    _living_room: "switch.living_room_mood_lights";
    _kitchen: "switch.kitchen_cabinets";
    _bedroom: "switch.bedroom_lamp" | "light.bedroom_ceiling_fan" | "light.bedroom_light";
  }

  export interface HassLabelMapping {
    _synapse:
      | "binary_sensor.hass_e2e_online"
      | "sensor.magic"
      | "binary_sensor.toggles"
      | "switch.bedroom_lamp"
      | "switch.kitchen_cabinets"
      | "switch.living_room_mood_lights"
      | "switch.porch_light"
      | "light.test_light"
      | "todo.test_todo"
      | "climate.test_climate"
      | "unsupported.test";
    _test: never;
  }

  export interface HassFloorMapping {
    _downstairs: "switch.kitchen_cabinets" | "switch.living_room_mood_lights";
    _upstairs: "switch.bedroom_lamp";
  }

  export interface HassThemeMapping {
    "(DO NOT USE/MODIFY)=== LCARS variables": true;
    "(DO NOT USE/MODIFY)=== Base customizations": true;
    "(DO NOT USE/MODIFY)=== card-mod CSS": true;
    "LCARS Default": true;
    "LCARS Classic": true;
    "LCARS Nemesis Blue": true;
    "LCARS Lower Decks I": true;
    "LCARS Lower Decks II": true;
    "LCARS Romulus": true;
    "LCARS Kronos": true;
    "LCARS Cardassia": true;
    "LCARS Zeldaar": true;
    "LCARS Modern": true;
    "LCARS Picard I": true;
    "LCARS Picard II": true;
    "LCARS Red Alert": true;
    "LCARS TNG": true;
    "LCARS TNGbuttons": true;
    "LCARS Transporter": true;
    "LCARS Navigation": true;
    "LCARS 25C": true;
    "LCARS 25C (Red Alert)": true;
    "LCARS 25C (Yellow Alert)": true;
    "LCARS 25C (Blue Alert)": true;
    "LCARS Breen": true;
    "Minimal Ninja": "light" | "dark";
  }

  export interface HassConfigEntryMapping {
    "01JJJ3NAS9JAW1SESXZRHG7YH7": { title: "Sun"; domain: "sun" };
    "01JJJ3NAVSK3WCDRZQADJVMDRH": { title: "Supervisor"; domain: "hassio" };
    "01JJJ3NAVSPAHW2THWYBHM1X8F": {
      title: "Intel Corporate 0a2b (7C:2A:31:0C:B1:9B)";
      domain: "bluetooth";
    };
    "01JJJ4TT048V3TMDZHN29D3X5D": { title: "Shopping list"; domain: "shopping_list" };
    "01JJJ4TT0BD1GFQQSGN295AH7G": {
      title: "Google Translate text-to-speech";
      domain: "google_translate";
    };
    "01JJJ4TT1VM15JJQ1YXC6MJKRF": { title: "Radio Browser"; domain: "radio_browser" };
  }
}
