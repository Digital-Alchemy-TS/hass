/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable sonarjs/redundant-type-aliases */
/* eslint-disable @cspell/spellchecker */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable sonarjs/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-empty-object-type */

// @ts-nocheck
import { RequireAtLeastOne } from "type-fest";

import {
  AndroidNotificationData,
  AppleNotificationData,
  NotificationData,
  PICK_ENTITY,
} from "./helpers/index.mts";

type PICK_FROM_PLATFORM<ID extends TPlatformId, DOMAIN extends TRawDomains = TRawDomains> = Extract<
  REGISTRY_SETUP["platform"][`_${ID}`],
  PICK_ENTITY<DOMAIN>
>;

// #MARK: ENTITY_SETUP
export type ENTITY_SETUP = {
  "button.example": {
    state: string;
    entity_id: "button.example";
    attributes: {
      friendly_name: "Example button";
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
};

// #MARK: iCallService
export type iCallService = {
  // # MARK: automation
  automation: {
    /**
     * ### Reload
     *
     * > Reloads the automation configuration.
     */
    reload(service_data: {}): Promise<void>;
    /**
     * ### Toggle
     *
     * > Toggles (enable / disable) an automation.
     */
    toggle(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - automation
       * > ```
       */
      entity_id: PICK_ENTITY<"automation"> | PICK_ENTITY<"automation">[];
    }): Promise<void>;
    /**
     * ### Trigger
     *
     * > Triggers the actions of an automation.
     */
    trigger(service_data?: {
      /**
       * ## Skip conditions
       *
       * > Defines whether or not the conditions will be skipped.
       *
       * ### Default
       *
       * > ```json
       * > true
       * > ```
       */
      skip_condition?: boolean;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - automation
       * > ```
       */
      entity_id: PICK_ENTITY<"automation"> | PICK_ENTITY<"automation">[];
    }): Promise<void>;
    /**
     * ### Turn off
     *
     * > Disables an automation.
     */
    turn_off(service_data?: {
      /**
       * ## Stop actions
       *
       * > Stops currently running actions.
       *
       * ### Default
       *
       * > ```json
       * > true
       * > ```
       */
      stop_actions?: boolean;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - automation
       * > ```
       */
      entity_id: PICK_ENTITY<"automation"> | PICK_ENTITY<"automation">[];
    }): Promise<void>;
    /**
     * ### Turn on
     *
     * > Enables an automation.
     */
    turn_on(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - automation
       * > ```
       */
      entity_id: PICK_ENTITY<"automation"> | PICK_ENTITY<"automation">[];
    }): Promise<void>;
  };
  // # MARK: backup
  backup: {
    /**
     * ### Create backup
     *
     * > Creates a new backup.
     */
    create(service_data: {}): Promise<void>;
  };
  // # MARK: button
  button: {
    /**
     * ### Press
     *
     * > Press the button entity.
     */
    press(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - button
       * > ```
       */
      entity_id: PICK_ENTITY<"button"> | PICK_ENTITY<"button">[];
    }): Promise<void>;
  };
  // # MARK: calendar
  calendar: {
    /**
     * ### Create event
     *
     * > Adds a new calendar event.
     */
    create_event(service_data?: {
      /**
       * ## Description
       *
       * > A more complete description of the event than the one provided by the summary.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "description": "Meeting to provide technical review for 'Phoenix' design."
       * > }
       * > ```
       */
      description?: string;
      /**
       * ## End date
       *
       * > The date the all-day event should end (exclusive).
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "end_date": "2022-03-23"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > date: null
       * > ```
       */
      end_date?: unknown;
      /**
       * ## End time
       *
       * > The date and time the event should end.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "end_date_time": "2022-03-22 22:00:00"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > datetime: null
       * > ```
       */
      end_date_time?: unknown;
      /**
       * ## In
       *
       * > Days or weeks that you want to create the event in.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "in": "{\"days\": 2} or {\"weeks\": 2}"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * >
       * > ```
       */
      in?: unknown;
      /**
       * ## Location
       *
       * > The location of the event.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "location": "Conference Room - F123, Bldg. 002"
       * > }
       * > ```
       */
      location?: string;
      /**
       * ## Start date
       *
       * > The date the all-day event should start.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "start_date": "2022-03-22"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > date: null
       * > ```
       */
      start_date?: unknown;
      /**
       * ## Start time
       *
       * > The date and time the event should start.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "start_date_time": "2022-03-22 20:00:00"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > datetime: null
       * > ```
       */
      start_date_time?: unknown;
      /**
       * ## Summary
       *
       * > Defines the short summary or subject for the event.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "summary": "Department Party"
       * > }
       * > ```
       */
      summary: string;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - calendar
       * >     supported_features:
       * >       - 1
       * > ```
       */
      entity_id: PICK_ENTITY<"calendar"> | PICK_ENTITY<"calendar">[];
    }): Promise<void>;
    /**
     * ### Get events
     *
     * > Get events on a calendar within a time range.
     */
    get_events(service_data?: {
      /**
       * ## Duration
       *
       * > Returns active events from start_date_time until the specified duration.
       *
       * ## Selector
       *
       * > ```yaml
       * > duration: null
       * > ```
       */
      duration?: unknown;
      /**
       * ## End time
       *
       * > Returns active events before this time (exclusive). Cannot be used with 'duration'.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "end_date_time": "2022-03-22 22:00:00"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > datetime: null
       * > ```
       */
      end_date_time?: unknown;
      /**
       * ## Start time
       *
       * > Returns active events after this time (exclusive). When not set, defaults to now.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "start_date_time": "2022-03-22 20:00:00"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > datetime: null
       * > ```
       */
      start_date_time?: unknown;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - calendar
       * > ```
       */
      entity_id: PICK_ENTITY<"calendar"> | PICK_ENTITY<"calendar">[];
    }): Promise<void>;
    /**
     * ### List event
     *
     * > Lists events on a calendar within a time range.
     */
    list_events(service_data?: {
      /**
       * ## Duration
       *
       * > Returns active events from start_date_time until the specified duration.
       *
       * ## Selector
       *
       * > ```yaml
       * > duration: null
       * > ```
       */
      duration?: unknown;
      /**
       * ## End time
       *
       * > Returns active events before this time (exclusive). Cannot be used with 'duration'.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "end_date_time": "2022-03-22 22:00:00"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > datetime: null
       * > ```
       */
      end_date_time?: unknown;
      /**
       * ## Start time
       *
       * > Returns active events after this time (exclusive). When not set, defaults to now.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "start_date_time": "2022-03-22 20:00:00"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > datetime: null
       * > ```
       */
      start_date_time?: unknown;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - calendar
       * > ```
       */
      entity_id: PICK_ENTITY<"calendar"> | PICK_ENTITY<"calendar">[];
    }): Promise<void>;
  };
  // # MARK: cloud
  cloud: {
    /**
     * ### Remote connect
     *
     * > Makes the instance UI accessible from outside of the local network by using Home Assistant Cloud.
     */
    remote_connect(service_data: {}): Promise<void>;
    /**
     * ### Remote disconnect
     *
     * > Disconnects the Home Assistant UI from the Home Assistant Cloud. You will no longer be able to access your Home Assistant instance from outside your local network.
     */
    remote_disconnect(service_data: {}): Promise<void>;
  };
  // # MARK: conversation
  conversation: {
    /**
     * ### Process
     *
     * > Launches a conversation from a transcribed text.
     */
    process(service_data?: {
      /**
       * ## Agent
       *
       * > Conversation agent to process your request. The conversation agent is the brains of your assistant. It processes the incoming text commands.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "agent_id": "homeassistant"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > conversation_agent: null
       * > ```
       */
      agent_id?: unknown;
      /**
       * ## Conversation ID
       *
       * > ID of the conversation, to be able to continue a previous conversation
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "conversation_id": "my_conversation_1"
       * > }
       * > ```
       */
      conversation_id?: string;
      /**
       * ## Language
       *
       * > Language of text. Defaults to server language.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "language": "NL"
       * > }
       * > ```
       */
      language?: string;
      /**
       * ## Text
       *
       * > Transcribed text input.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "text": "Turn all lights on"
       * > }
       * > ```
       */
      text: string;
    }): Promise<void>;
    /**
     * ### Reload
     *
     * > Reloads the intent configuration.
     */
    reload(service_data?: {
      /**
       * ## Agent
       *
       * > Conversation agent to reload.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "agent_id": "homeassistant"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > conversation_agent: null
       * > ```
       */
      agent_id?: unknown;
      /**
       * ## Language
       *
       * > Language to clear cached intents for. Defaults to server language.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "language": "NL"
       * > }
       * > ```
       */
      language?: string;
    }): Promise<void>;
  };
  // # MARK: counter
  counter: {
    /**
     * ### Decrement
     *
     * > Decrements a counter.
     */
    decrement(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - counter
       * > ```
       */
      entity_id: PICK_ENTITY<"counter"> | PICK_ENTITY<"counter">[];
    }): Promise<void>;
    /**
     * ### Increment
     *
     * > Increments a counter.
     */
    increment(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - counter
       * > ```
       */
      entity_id: PICK_ENTITY<"counter"> | PICK_ENTITY<"counter">[];
    }): Promise<void>;
    /**
     * ### Reset
     *
     * > Resets a counter.
     */
    reset(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - counter
       * > ```
       */
      entity_id: PICK_ENTITY<"counter"> | PICK_ENTITY<"counter">[];
    }): Promise<void>;
    /**
     * ### Set
     *
     * > Sets the counter value.
     */
    set_value(service_data: {
      /**
       * ## Value
       *
       * > The new counter value the entity should be set to.
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: 0
       * >   max: 9223372036854776000
       * >   mode: box
       * > ```
       */
      value: number;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - counter
       * > ```
       */
      entity_id: PICK_ENTITY<"counter"> | PICK_ENTITY<"counter">[];
    }): Promise<void>;
  };
  // # MARK: ffmpeg
  ffmpeg: {
    /**
     * ### Restart
     *
     * > Sends a restart command to a ffmpeg based sensor.
     */
    restart(service_data?: {
      /**
       * ## Entity
       *
       * > Name of entity that will restart. Platform dependent.
       *
       * ## Selector
       *
       * > ```yaml
       * > entity:
       * >   integration: ffmpeg
       * >   domain: binary_sensor
       * > ```
       */
      entity_id?:
        | PICK_FROM_PLATFORM<"ffmpeg", "binary_sensor">
        | PICK_FROM_PLATFORM<"ffmpeg", "binary_sensor">[];
    }): Promise<void>;
    /**
     * ### Start
     *
     * > Sends a start command to a ffmpeg based sensor.
     */
    start(service_data?: {
      /**
       * ## Entity
       *
       * > Name of entity that will start. Platform dependent.
       *
       * ## Selector
       *
       * > ```yaml
       * > entity:
       * >   integration: ffmpeg
       * >   domain: binary_sensor
       * > ```
       */
      entity_id?:
        | PICK_FROM_PLATFORM<"ffmpeg", "binary_sensor">
        | PICK_FROM_PLATFORM<"ffmpeg", "binary_sensor">[];
    }): Promise<void>;
    /**
     * ### Stop
     *
     * > Sends a stop command to a ffmpeg based sensor.
     */
    stop(service_data?: {
      /**
       * ## Entity
       *
       * > Name of entity that will stop. Platform dependent.
       *
       * ## Selector
       *
       * > ```yaml
       * > entity:
       * >   integration: ffmpeg
       * >   domain: binary_sensor
       * > ```
       */
      entity_id?:
        | PICK_FROM_PLATFORM<"ffmpeg", "binary_sensor">
        | PICK_FROM_PLATFORM<"ffmpeg", "binary_sensor">[];
    }): Promise<void>;
  };
  // # MARK: frontend
  frontend: {
    /**
     * ### Reload themes
     *
     * > Reloads themes from the YAML-configuration.
     */
    reload_themes(service_data: {}): Promise<void>;
    /**
     * ### Set the default theme
     *
     * > Sets the default theme Home Assistant uses. Can be overridden by a user.
     */
    set_theme(service_data?: {
      /**
       * ## Mode
       *
       * > Theme mode.
       *
       * ### Default
       *
       * > ```json
       * > "light"
       * > ```
       */
      mode?: "dark" | "light";
      /**
       * ## Theme
       *
       * > Name of a theme.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "name": "default"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > theme:
       * >   include_default: true
       * > ```
       */
      name: unknown;
    }): Promise<void>;
  };
  // # MARK: homeassistant
  homeassistant: {
    /**
     * ### Check configuration
     *
     * > Checks the Home Assistant YAML-configuration files for errors. Errors will be shown in the Home Assistant logs.
     */
    check_config(service_data: {}): Promise<void>;
    /**
     * ### Reload all
     *
     * > Reload all YAML configuration that can be reloaded without restarting Home Assistant.
     */
    reload_all(service_data: {}): Promise<void>;
    /**
     * ### Reload config entry
     *
     * > Reloads the specified config entry.
     */
    reload_config_entry(service_data?: {
      /**
       * ## Config entry ID
       *
       * > The configuration entry ID of the entry to be reloaded.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "entry_id": "8955375327824e14ba89e4b29cc3ec9a"
       * > }
       * > ```
       */
      entry_id?: string;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - {}
       * > device:
       * >   - {}
       * > ```
       */
      entity_id: PICK_ENTITY | PICK_ENTITY[];
    }): Promise<void>;
    /**
     * ### Reload core configuration
     *
     * > Reloads the core configuration from the YAML-configuration.
     */
    reload_core_config(service_data: {}): Promise<void>;
    /**
     * ### Reload custom Jinja2 templates
     *
     * > Reloads Jinja2 templates found in the `custom_templates` folder in your config. New values will be applied on the next render of the template.
     */
    reload_custom_templates(service_data: {}): Promise<void>;
    /**
     * ### Restart
     *
     * > Restarts Home Assistant.
     */
    restart(service_data: {}): Promise<void>;
    /**
     * ### Save persistent states
     *
     * > Saves the persistent states immediately. Maintains the normal periodic saving interval.
     */
    save_persistent_states(service_data: {}): Promise<void>;
    /**
     * ### Set location
     *
     * > Updates the Home Assistant location.
     */
    set_location(service_data?: {
      /**
       * ## Elevation
       *
       * > Elevation of your location.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "elevation": "120"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   mode: box
       * >   step: any
       * > ```
       */
      elevation?: number;
      /**
       * ## Latitude
       *
       * > Latitude of your location.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "latitude": "32.87336"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   mode: box
       * >   min: -90
       * >   max: 90
       * >   step: any
       * > ```
       */
      latitude: number;
      /**
       * ## Longitude
       *
       * > Longitude of your location.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "longitude": "117.22743"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   mode: box
       * >   min: -180
       * >   max: 180
       * >   step: any
       * > ```
       */
      longitude: number;
    }): Promise<void>;
    /**
     * ### Stop
     *
     * > Stops Home Assistant.
     */
    stop(service_data: {}): Promise<void>;
    /**
     * ### Generic toggle
     *
     * > Generic service to toggle devices on/off under any domain.
     */
    toggle(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - {}
       * > ```
       */
      entity_id: PICK_ENTITY | PICK_ENTITY[];
    }): Promise<void>;
    /**
     * ### Generic turn off
     *
     * > Generic service to turn devices off under any domain.
     */
    turn_off(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - {}
       * > ```
       */
      entity_id: PICK_ENTITY | PICK_ENTITY[];
    }): Promise<void>;
    /**
     * ### Generic turn on
     *
     * > Generic service to turn devices on under any domain.
     */
    turn_on(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - {}
       * > ```
       */
      entity_id: PICK_ENTITY | PICK_ENTITY[];
    }): Promise<void>;
    /**
     * ### Update entity
     *
     * > Forces one or more entities to update its data.
     */
    update_entity(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - {}
       * > ```
       */
      entity_id: PICK_ENTITY | PICK_ENTITY[];
    }): Promise<void>;
  };
  // # MARK: input_boolean
  input_boolean: {
    /**
     * ### Reload
     *
     * > Reloads helpers from the YAML-configuration.
     */
    reload(service_data: {}): Promise<void>;
    /**
     * ### Toggle
     *
     * > Toggles the helper on/off.
     */
    toggle(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - input_boolean
       * > ```
       */
      entity_id: PICK_ENTITY<"input_boolean"> | PICK_ENTITY<"input_boolean">[];
    }): Promise<void>;
    /**
     * ### Turn off
     *
     * > Turns off the helper.
     */
    turn_off(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - input_boolean
       * > ```
       */
      entity_id: PICK_ENTITY<"input_boolean"> | PICK_ENTITY<"input_boolean">[];
    }): Promise<void>;
    /**
     * ### Turn on
     *
     * > Turns on the helper.
     */
    turn_on(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - input_boolean
       * > ```
       */
      entity_id: PICK_ENTITY<"input_boolean"> | PICK_ENTITY<"input_boolean">[];
    }): Promise<void>;
  };
  // # MARK: input_button
  input_button: {
    /**
     * ### Press
     *
     * > Mimics the physical button press on the device.
     */
    press(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - input_button
       * > ```
       */
      entity_id: PICK_ENTITY<"input_button"> | PICK_ENTITY<"input_button">[];
    }): Promise<void>;
    /**
     * ### Reload
     *
     * > Reloads helpers from the YAML-configuration.
     */
    reload(service_data: {}): Promise<void>;
  };
  // # MARK: input_datetime
  input_datetime: {
    /**
     * ### Reload
     *
     * > Reloads helpers from the YAML-configuration.
     */
    reload(service_data: {}): Promise<void>;
    /**
     * ### Set
     *
     * > Sets the date and/or time.
     */
    set_datetime(service_data?: {
      /**
       * ## Date
       *
       * > The target date.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "date": "\"2019-04-20\""
       * > }
       * > ```
       */
      date?: string;
      /**
       * ## Date & time
       *
       * > The target date & time.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "datetime": "\"2019-04-20 05:04:20\""
       * > }
       * > ```
       */
      datetime?: string;
      /**
       * ## Time
       *
       * > The target time.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "time": "\"05:04:20\""
       * > }
       * > ```
       */
      time?: string;
      /**
       * ## Timestamp
       *
       * > The target date & time, expressed by a UNIX timestamp.
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: 0
       * >   max: 9223372036854776000
       * >   mode: box
       * > ```
       */
      timestamp?: number;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - input_datetime
       * > ```
       */
      entity_id: PICK_ENTITY<"input_datetime"> | PICK_ENTITY<"input_datetime">[];
    }): Promise<void>;
  };
  // # MARK: input_number
  input_number: {
    /**
     * ### Decrement
     *
     * > Decrements the current value by 1 step.
     */
    decrement(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - input_number
       * > ```
       */
      entity_id: PICK_ENTITY<"input_number"> | PICK_ENTITY<"input_number">[];
    }): Promise<void>;
    /**
     * ### Increment
     *
     * > Increments the value by 1 step.
     */
    increment(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - input_number
       * > ```
       */
      entity_id: PICK_ENTITY<"input_number"> | PICK_ENTITY<"input_number">[];
    }): Promise<void>;
    /**
     * ### Reload
     *
     * > Reloads helpers from the YAML-configuration.
     */
    reload(service_data: {}): Promise<void>;
    /**
     * ### Set
     *
     * > Sets the value.
     */
    set_value(service_data: {
      /**
       * ## Value
       *
       * > The target value.
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: 0
       * >   max: 9223372036854776000
       * >   step: 0.001
       * >   mode: box
       * > ```
       */
      value: number;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - input_number
       * > ```
       */
      entity_id: PICK_ENTITY<"input_number"> | PICK_ENTITY<"input_number">[];
    }): Promise<void>;
  };
  // # MARK: input_select
  input_select: {
    /**
     * ### Reload
     *
     * > Reloads helpers from the YAML-configuration.
     */
    reload(service_data: {}): Promise<void>;
    /**
     * ### First
     *
     * > Selects the first option.
     */
    select_first(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - input_select
       * > ```
       */
      entity_id: PICK_ENTITY<"input_select"> | PICK_ENTITY<"input_select">[];
    }): Promise<void>;
    /**
     * ### Last
     *
     * > Selects the last option.
     */
    select_last(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - input_select
       * > ```
       */
      entity_id: PICK_ENTITY<"input_select"> | PICK_ENTITY<"input_select">[];
    }): Promise<void>;
    /**
     * ### Next
     *
     * > Select the next option.
     */
    select_next(service_data?: {
      /**
       * ## Cycle
       *
       * > If the option should cycle from the last to the first option on the list.
       *
       * ### Default
       *
       * > ```json
       * > true
       * > ```
       */
      cycle?: boolean;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - input_select
       * > ```
       */
      entity_id: PICK_ENTITY<"input_select"> | PICK_ENTITY<"input_select">[];
    }): Promise<void>;
    /**
     * ### Select
     *
     * > Selects an option.
     */
    select_option(service_data: {
      /**
       * ## Option
       *
       * > Option to be selected.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "option": "\"Item A\""
       * > }
       * > ```
       */
      option: string;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - input_select
       * > ```
       */
      entity_id: PICK_ENTITY<"input_select"> | PICK_ENTITY<"input_select">[];
    }): Promise<void>;
    /**
     * ### Previous
     *
     * > Selects the previous option.
     */
    select_previous(service_data?: {
      /**
       * ## Cycle
       *
       * > If the option should cycle from the last to the first option on the list.
       *
       * ### Default
       *
       * > ```json
       * > true
       * > ```
       */
      cycle?: boolean;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - input_select
       * > ```
       */
      entity_id: PICK_ENTITY<"input_select"> | PICK_ENTITY<"input_select">[];
    }): Promise<void>;
    /**
     * ### Set options
     *
     * > Sets the options.
     */
    set_options(service_data: {
      /**
       * ## Options
       *
       * > List of options.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "options": "[\"Item A\", \"Item B\", \"Item C\"]"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > object: null
       * > ```
       */
      options: unknown;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - input_select
       * > ```
       */
      entity_id: PICK_ENTITY<"input_select"> | PICK_ENTITY<"input_select">[];
    }): Promise<void>;
  };
  // # MARK: light
  light: {
    /**
     * ### Toggle
     *
     * > Toggles one or more lights, from on to off, or, off to on, based on their current state.
     */
    toggle(service_data?: {
      /**
       * ## Brightness value
       *
       * > Number indicating brightness, where 0 turns the light off, 1 is the minimum brightness, and 255 is the maximum brightness.
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: 0
       * >   max: 255
       * > ```
       */
      brightness?: number;
      /**
       * ## Brightness
       *
       * > Number indicating the percentage of full brightness, where 0 turns the light off, 1 is the minimum brightness, and 100 is the maximum brightness.
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: 0
       * >   max: 100
       * >   unit_of_measurement: '%'
       * > ```
       */
      brightness_pct?: number;
      /**
       * ## Color name
       *
       * > A human-readable color name.
       */
      color_name?:
        | "homeassistant"
        | "aliceblue"
        | "antiquewhite"
        | "aqua"
        | "aquamarine"
        | "azure"
        | "beige"
        | "bisque"
        | "blanchedalmond"
        | "blue"
        | "blueviolet"
        | "brown"
        | "burlywood"
        | "cadetblue"
        | "chartreuse"
        | "chocolate"
        | "coral"
        | "cornflowerblue"
        | "cornsilk"
        | "crimson"
        | "cyan"
        | "darkblue"
        | "darkcyan"
        | "darkgoldenrod"
        | "darkgray"
        | "darkgreen"
        | "darkgrey"
        | "darkkhaki"
        | "darkmagenta"
        | "darkolivegreen"
        | "darkorange"
        | "darkorchid"
        | "darkred"
        | "darksalmon"
        | "darkseagreen"
        | "darkslateblue"
        | "darkslategray"
        | "darkslategrey"
        | "darkturquoise"
        | "darkviolet"
        | "deeppink"
        | "deepskyblue"
        | "dimgray"
        | "dimgrey"
        | "dodgerblue"
        | "firebrick"
        | "floralwhite"
        | "forestgreen"
        | "fuchsia"
        | "gainsboro"
        | "ghostwhite"
        | "gold"
        | "goldenrod"
        | "gray"
        | "green"
        | "greenyellow"
        | "grey"
        | "honeydew"
        | "hotpink"
        | "indianred"
        | "indigo"
        | "ivory"
        | "khaki"
        | "lavender"
        | "lavenderblush"
        | "lawngreen"
        | "lemonchiffon"
        | "lightblue"
        | "lightcoral"
        | "lightcyan"
        | "lightgoldenrodyellow"
        | "lightgray"
        | "lightgreen"
        | "lightgrey"
        | "lightpink"
        | "lightsalmon"
        | "lightseagreen"
        | "lightskyblue"
        | "lightslategray"
        | "lightslategrey"
        | "lightsteelblue"
        | "lightyellow"
        | "lime"
        | "limegreen"
        | "linen"
        | "magenta"
        | "maroon"
        | "mediumaquamarine"
        | "mediumblue"
        | "mediumorchid"
        | "mediumpurple"
        | "mediumseagreen"
        | "mediumslateblue"
        | "mediumspringgreen"
        | "mediumturquoise"
        | "mediumvioletred"
        | "midnightblue"
        | "mintcream"
        | "mistyrose"
        | "moccasin"
        | "navajowhite"
        | "navy"
        | "navyblue"
        | "oldlace"
        | "olive"
        | "olivedrab"
        | "orange"
        | "orangered"
        | "orchid"
        | "palegoldenrod"
        | "palegreen"
        | "paleturquoise"
        | "palevioletred"
        | "papayawhip"
        | "peachpuff"
        | "peru"
        | "pink"
        | "plum"
        | "powderblue"
        | "purple"
        | "red"
        | "rosybrown"
        | "royalblue"
        | "saddlebrown"
        | "salmon"
        | "sandybrown"
        | "seagreen"
        | "seashell"
        | "sienna"
        | "silver"
        | "skyblue"
        | "slateblue"
        | "slategray"
        | "slategrey"
        | "snow"
        | "springgreen"
        | "steelblue"
        | "tan"
        | "teal"
        | "thistle"
        | "tomato"
        | "turquoise"
        | "violet"
        | "wheat"
        | "white"
        | "whitesmoke"
        | "yellow"
        | "yellowgreen";
      /**
       * ## Color temperature
       *
       * > Color temperature in mireds.
       *
       * ## Selector
       *
       * > ```yaml
       * > color_temp: null
       * > ```
       */
      color_temp?: unknown;
      /**
       * ## Effect
       *
       * > Light effect.
       */
      effect?: string;
      /**
       * ## Flash
       *
       * > Tell light to flash, can be either value short or long.
       */
      flash?: "long" | "short";
      /**
       * ## Hue/Sat color
       *
       * > Color in hue/sat format. A list of two integers. Hue is 0-360 and Sat is 0-100.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "hs_color": "[300, 70]"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > object: null
       * > ```
       */
      hs_color?: unknown;
      /**
       * ## Color temperature
       *
       * > Color temperature in Kelvin.
       *
       * ## Selector
       *
       * > ```yaml
       * > color_temp:
       * >   unit: kelvin
       * >   min: 2000
       * >   max: 6500
       * > ```
       */
      kelvin?: unknown;
      /**
       * ## Profile
       *
       * > Name of a light profile to use.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "profile": "relax"
       * > }
       * > ```
       */
      profile?: string;
      /**
       * ## Color
       *
       * > The color in RGB format. A list of three integers between 0 and 255 representing the values of red, green, and blue.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "rgb_color": "[255, 100, 100]"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > color_rgb: null
       * > ```
       */
      rgb_color?: unknown;
      /**
       * ## Transition
       *
       * > Duration it takes to get to next state.
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: 0
       * >   max: 300
       * >   unit_of_measurement: seconds
       * > ```
       */
      transition?: number;
      /**
       * ## White
       *
       * > Set the light to white mode.
       *
       * ## Selector
       *
       * > ```yaml
       * > constant:
       * >   value: true
       * >   label: Enabled
       * > ```
       */
      white?: unknown;
      /**
       * ## XY-color
       *
       * > Color in XY-format. A list of two decimal numbers between 0 and 1.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "xy_color": "[0.52, 0.43]"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > object: null
       * > ```
       */
      xy_color?: unknown;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - light
       * > ```
       */
      entity_id: PICK_ENTITY<"light"> | PICK_ENTITY<"light">[];
    }): Promise<void>;
    /**
     * ### Turn off
     *
     * > Turn off one or more lights.
     */
    turn_off(service_data?: {
      /**
       * ## Flash
       *
       * > Tell light to flash, can be either value short or long.
       */
      flash?: "long" | "short";
      /**
       * ## Transition
       *
       * > Duration it takes to get to next state.
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: 0
       * >   max: 300
       * >   unit_of_measurement: seconds
       * > ```
       */
      transition?: number;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - light
       * > ```
       */
      entity_id: PICK_ENTITY<"light"> | PICK_ENTITY<"light">[];
    }): Promise<void>;
    /**
     * ### Turn on
     *
     * > Turn on one or more lights and adjust properties of the light, even when they are turned on already.
     */
    turn_on(service_data?: {
      /**
       * ## Brightness value
       *
       * > Number indicating brightness, where 0 turns the light off, 1 is the minimum brightness, and 255 is the maximum brightness.
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: 0
       * >   max: 255
       * > ```
       */
      brightness?: number;
      /**
       * ## Brightness
       *
       * > Number indicating the percentage of full brightness, where 0 turns the light off, 1 is the minimum brightness, and 100 is the maximum brightness.
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: 0
       * >   max: 100
       * >   unit_of_measurement: '%'
       * > ```
       */
      brightness_pct?: number;
      /**
       * ## Brightness step value
       *
       * > Change brightness by an amount.
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: -225
       * >   max: 255
       * > ```
       */
      brightness_step?: number;
      /**
       * ## Brightness step
       *
       * > Change brightness by a percentage.
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: -100
       * >   max: 100
       * >   unit_of_measurement: '%'
       * > ```
       */
      brightness_step_pct?: number;
      /**
       * ## Color name
       *
       * > A human-readable color name.
       */
      color_name?:
        | "homeassistant"
        | "aliceblue"
        | "antiquewhite"
        | "aqua"
        | "aquamarine"
        | "azure"
        | "beige"
        | "bisque"
        | "blanchedalmond"
        | "blue"
        | "blueviolet"
        | "brown"
        | "burlywood"
        | "cadetblue"
        | "chartreuse"
        | "chocolate"
        | "coral"
        | "cornflowerblue"
        | "cornsilk"
        | "crimson"
        | "cyan"
        | "darkblue"
        | "darkcyan"
        | "darkgoldenrod"
        | "darkgray"
        | "darkgreen"
        | "darkgrey"
        | "darkkhaki"
        | "darkmagenta"
        | "darkolivegreen"
        | "darkorange"
        | "darkorchid"
        | "darkred"
        | "darksalmon"
        | "darkseagreen"
        | "darkslateblue"
        | "darkslategray"
        | "darkslategrey"
        | "darkturquoise"
        | "darkviolet"
        | "deeppink"
        | "deepskyblue"
        | "dimgray"
        | "dimgrey"
        | "dodgerblue"
        | "firebrick"
        | "floralwhite"
        | "forestgreen"
        | "fuchsia"
        | "gainsboro"
        | "ghostwhite"
        | "gold"
        | "goldenrod"
        | "gray"
        | "green"
        | "greenyellow"
        | "grey"
        | "honeydew"
        | "hotpink"
        | "indianred"
        | "indigo"
        | "ivory"
        | "khaki"
        | "lavender"
        | "lavenderblush"
        | "lawngreen"
        | "lemonchiffon"
        | "lightblue"
        | "lightcoral"
        | "lightcyan"
        | "lightgoldenrodyellow"
        | "lightgray"
        | "lightgreen"
        | "lightgrey"
        | "lightpink"
        | "lightsalmon"
        | "lightseagreen"
        | "lightskyblue"
        | "lightslategray"
        | "lightslategrey"
        | "lightsteelblue"
        | "lightyellow"
        | "lime"
        | "limegreen"
        | "linen"
        | "magenta"
        | "maroon"
        | "mediumaquamarine"
        | "mediumblue"
        | "mediumorchid"
        | "mediumpurple"
        | "mediumseagreen"
        | "mediumslateblue"
        | "mediumspringgreen"
        | "mediumturquoise"
        | "mediumvioletred"
        | "midnightblue"
        | "mintcream"
        | "mistyrose"
        | "moccasin"
        | "navajowhite"
        | "navy"
        | "navyblue"
        | "oldlace"
        | "olive"
        | "olivedrab"
        | "orange"
        | "orangered"
        | "orchid"
        | "palegoldenrod"
        | "palegreen"
        | "paleturquoise"
        | "palevioletred"
        | "papayawhip"
        | "peachpuff"
        | "peru"
        | "pink"
        | "plum"
        | "powderblue"
        | "purple"
        | "red"
        | "rosybrown"
        | "royalblue"
        | "saddlebrown"
        | "salmon"
        | "sandybrown"
        | "seagreen"
        | "seashell"
        | "sienna"
        | "silver"
        | "skyblue"
        | "slateblue"
        | "slategray"
        | "slategrey"
        | "snow"
        | "springgreen"
        | "steelblue"
        | "tan"
        | "teal"
        | "thistle"
        | "tomato"
        | "turquoise"
        | "violet"
        | "wheat"
        | "white"
        | "whitesmoke"
        | "yellow"
        | "yellowgreen";
      /**
       * ## Color temperature
       *
       * > Color temperature in mireds.
       *
       * ## Selector
       *
       * > ```yaml
       * > color_temp:
       * >   unit: mired
       * >   min: 153
       * >   max: 500
       * > ```
       */
      color_temp?: unknown;
      /**
       * ## Effect
       *
       * > Light effect.
       */
      effect?: string;
      /**
       * ## Flash
       *
       * > Tell light to flash, can be either value short or long.
       */
      flash?: "long" | "short";
      /**
       * ## Hue/Sat color
       *
       * > Color in hue/sat format. A list of two integers. Hue is 0-360 and Sat is 0-100.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "hs_color": "[300, 70]"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > object: null
       * > ```
       */
      hs_color?: unknown;
      /**
       * ## Color temperature
       *
       * > Color temperature in Kelvin.
       *
       * ## Selector
       *
       * > ```yaml
       * > color_temp:
       * >   unit: kelvin
       * >   min: 2000
       * >   max: 6500
       * > ```
       */
      kelvin?: unknown;
      /**
       * ## Profile
       *
       * > Name of a light profile to use.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "profile": "relax"
       * > }
       * > ```
       */
      profile?: string;
      /**
       * ## Color
       *
       * > The color in RGB format. A list of three integers between 0 and 255 representing the values of red, green, and blue.
       *
       * ## Selector
       *
       * > ```yaml
       * > color_rgb: null
       * > ```
       */
      rgb_color?: unknown;
      /**
       * ## RGBW-color
       *
       * > The color in RGBW format. A list of four integers between 0 and 255 representing the values of red, green, blue, and white.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "rgbw_color": "[255, 100, 100, 50]"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > object: null
       * > ```
       */
      rgbw_color?: unknown;
      /**
       * ## RGBWW-color
       *
       * > The color in RGBWW format. A list of five integers between 0 and 255 representing the values of red, green, blue, cold white, and warm white.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "rgbww_color": "[255, 100, 100, 50, 70]"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > object: null
       * > ```
       */
      rgbww_color?: unknown;
      /**
       * ## Transition
       *
       * > Duration it takes to get to next state.
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: 0
       * >   max: 300
       * >   unit_of_measurement: seconds
       * > ```
       */
      transition?: number;
      /**
       * ## White
       *
       * > Set the light to white mode.
       *
       * ## Selector
       *
       * > ```yaml
       * > constant:
       * >   value: true
       * >   label: Enabled
       * > ```
       */
      white?: unknown;
      /**
       * ## XY-color
       *
       * > Color in XY-format. A list of two decimal numbers between 0 and 1.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "xy_color": "[0.52, 0.43]"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > object: null
       * > ```
       */
      xy_color?: unknown;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - light
       * > ```
       */
      entity_id: PICK_ENTITY<"light"> | PICK_ENTITY<"light">[];
    }): Promise<void>;
  };
  // # MARK: input_text
  input_text: {
    /**
     * ### Reload
     *
     * > Reloads helpers from the YAML-configuration.
     */
    reload(service_data: {}): Promise<void>;
    /**
     * ### Set
     *
     * > Sets the value.
     */
    set_value(service_data: {
      /**
       * ## Value
       *
       * > The target value.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "value": "This is an example text"
       * > }
       * > ```
       */
      value: string;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - input_text
       * > ```
       */
      entity_id: PICK_ENTITY<"input_text"> | PICK_ENTITY<"input_text">[];
    }): Promise<void>;
  };
  // # MARK: logbook
  logbook: {
    /**
     * ### Log
     *
     * > Creates a custom entry in the logbook.
     */
    log(service_data?: {
      /**
       * ## Domain
       *
       * > Determines which icon is used in the logbook entry. The icon illustrates the integration domain related to this logbook entry.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "domain": "light"
       * > }
       * > ```
       */
      domain?: string;
      /**
       * ## Entity ID
       *
       * > Entity to reference in the logbook entry.
       *
       * ## Selector
       *
       * > ```yaml
       * > entity: null
       * > ```
       */
      entity_id?: PICK_ENTITY | PICK_ENTITY[];
      /**
       * ## Message
       *
       * > Message of the logbook entry.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "message": "is being used"
       * > }
       * > ```
       */
      message: string;
      /**
       * ## Name
       *
       * > Custom name for an entity, can be referenced using an `entity_id`.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "name": "Kitchen"
       * > }
       * > ```
       */
      name: string;
    }): Promise<void>;
  };
  // # MARK: logger
  logger: {
    /**
     * ### Set default level
     *
     * > Sets the default log level for integrations.
     */
    set_default_level(service_data?: {
      /**
       * ## Level
       *
       * > Default severity level for all integrations.
       */
      level?: "debug" | "info" | "warning" | "error" | "fatal" | "critical";
    }): Promise<void>;
    /**
     * ### Set level
     *
     * > Sets the log level for one or more integrations.
     */
    set_level(service_data: {}): Promise<void>;
  };
  // # MARK: button
  button: {
    /**
     * ### Press
     *
     * > Press the button entity.
     */
    press(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - button
       * > ```
       */
      entity_id: PICK_ENTITY<"button"> | PICK_ENTITY<"button">[];
    }): Promise<void>;
  };
  // # MARK: notify
  notify: {
    /**
     * ### Send a notification with notify
     *
     * > Sends a notification message using the notify service.
     */
    notify(service_data?: {
      /**
       * ## data
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "data": "platform specific"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > object: null
       * > ```
       */
      data?: NotificationData & (AndroidNotificationData | AppleNotificationData);
      /**
       * ## message
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "message": "The garage door has been open for 10 minutes."
       * > }
       * > ```
       */
      message: string;
      /**
       * ## target
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "target": "platform specific"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > object: null
       * > ```
       */
      target?: unknown;
      /**
       * ## title
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "title": "Your Garage Door Friend"
       * > }
       * > ```
       */
      title?: string;
    }): Promise<void>;
    /**
     * ### Send a persistent notification
     *
     * > Sends a notification that is visible in the **Notifications** panel.
     */
    persistent_notification(service_data?: {
      /**
       * ## Data
       *
       * > Some integrations provide extended functionality. For information on how to use _data_, refer to the integration documentation..
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "data": "platform specific"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > object: null
       * > ```
       */
      data?: NotificationData & (AndroidNotificationData | AppleNotificationData);
      /**
       * ## Message
       *
       * > Message body of the notification.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "message": "The garage door has been open for 10 minutes."
       * > }
       * > ```
       */
      message: string;
      /**
       * ## Title
       *
       * > Title of the notification.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "title": "Your Garage Door Friend"
       * > }
       * > ```
       */
      title?: string;
    }): Promise<void>;
  };
  // # MARK: persistent_notification
  persistent_notification: {
    /**
     * ### Create
     *
     * > Shows a notification on the **Notifications** panel.
     */
    create(service_data?: {
      /**
       * ## Message
       *
       * > Message body of the notification.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "message": "Please check your configuration.yaml."
       * > }
       * > ```
       */
      message: string;
      /**
       * ## Notification ID
       *
       * > ID of the notification. This new notification will overwrite an existing notification with the same ID.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "notification_id": "1234"
       * > }
       * > ```
       */
      notification_id?: string;
      /**
       * ## Title
       *
       * > Optional title of the notification.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "title": "Test notification"
       * > }
       * > ```
       */
      title?: string;
    }): Promise<void>;
    /**
     * ### Dismiss
     *
     * > Removes a notification from the **Notifications** panel.
     */
    dismiss(service_data: {
      /**
       * ## Notification ID
       *
       * > ID of the notification to be removed.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "notification_id": "1234"
       * > }
       * > ```
       */
      notification_id: string;
    }): Promise<void>;
    /**
     * ### Dismiss all
     *
     * > Removes all notifications from the **Notifications** panel.
     */
    dismiss_all(service_data: {}): Promise<void>;
  };
  // # MARK: person
  person: {
    /**
     * ### Reload
     *
     * > Reloads persons from the YAML-configuration.
     */
    reload(service_data: {}): Promise<void>;
  };
  // # MARK: recorder
  recorder: {
    /**
     * ### Disable
     *
     * > Stops the recording of events and state changes.
     */
    disable(service_data: {}): Promise<void>;
    /**
     * ### Enable
     *
     * > Starts the recording of events and state changes.
     */
    enable(service_data: {}): Promise<void>;
    /**
     * ### Purge
     *
     * > Starts purge task - to clean up old data from your database.
     */
    purge(service_data?: {
      /**
       * ## Apply filter
       *
       * > Apply `entity_id` and `event_type` filters in addition to time-based purge.
       *
       * ### Default
       *
       * > ```json
       * > false
       * > ```
       */
      apply_filter?: boolean;
      /**
       * ## Days to keep
       *
       * > Number of days to keep the data in the database. Starting today, counting backward. A value of `7` means that everything older than a week will be purged.
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: 0
       * >   max: 365
       * >   unit_of_measurement: days
       * > ```
       */
      keep_days?: number;
      /**
       * ## Repack
       *
       * > Attempt to save disk space by rewriting the entire database file.
       *
       * ### Default
       *
       * > ```json
       * > false
       * > ```
       */
      repack?: boolean;
    }): Promise<void>;
    /**
     * ### Purge entities
     *
     * > Starts a purge task to remove the data related to specific entities from your database.
     */
    purge_entities(service_data?: {
      /**
       * ## Domains to remove
       *
       * > List of domains for which the data needs to be removed from the recorder database.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "domains": "sun"
       * > }
       * > ```
       *
       * ### Default
       *
       * > ```json
       * > []
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > object: null
       * > ```
       */
      domains?: unknown;
      /**
       * ## Entity globs to remove
       *
       * > List of glob patterns used to select the entities for which the data is to be removed from the recorder database.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "entity_globs": "domain*.object_id*"
       * > }
       * > ```
       *
       * ### Default
       *
       * > ```json
       * > []
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > object: null
       * > ```
       */
      entity_globs?: unknown;
      /**
       * ## Days to keep
       *
       * > Number of days to keep the data for rows matching the filter. Starting today, counting backward. A value of `7` means that everything older than a week will be purged. The default of 0 days will remove all matching rows immediately.
       *
       * ### Default
       *
       * > ```json
       * > 0
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: 0
       * >   max: 365
       * >   unit_of_measurement: days
       * > ```
       */
      keep_days?: number;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - {}
       * > ```
       */
      entity_id: PICK_ENTITY | PICK_ENTITY[];
    }): Promise<void>;
  };
  // # MARK: scene
  scene: {
    /**
     * ### Apply
     *
     * > Activates a scene with configuration.
     */
    apply(service_data?: {
      /**
       * ## Entities state
       *
       * > List of entities and their target state.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "entities": "light.kitchen: \"on\"\nlight.ceiling:\n  state: \"on\"\n  brightness: 80\n"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > object: null
       * > ```
       */
      entities: unknown;
      /**
       * ## Transition
       *
       * > Time it takes the devices to transition into the states defined in the scene.
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: 0
       * >   max: 300
       * >   unit_of_measurement: seconds
       * > ```
       */
      transition?: number;
    }): Promise<void>;
    /**
     * ### Create
     *
     * > Creates a new scene.
     */
    create(service_data?: {
      /**
       * ## Entities state
       *
       * > List of entities and their target state. If your entities are already in the target state right now, use `snapshot_entities` instead.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "entities": "light.tv_back_light: \"on\"\nlight.ceiling:\n  state: \"on\"\n  brightness: 200\n"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > object: null
       * > ```
       */
      entities?: unknown;
      /**
       * ## Scene entity ID
       *
       * > The entity ID of the new scene.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "scene_id": "all_lights"
       * > }
       * > ```
       */
      scene_id: string;
      /**
       * ## Snapshot entities
       *
       * > List of entities to be included in the snapshot. By taking a snapshot, you record the current state of those entities. If you do not want to use the current state of all your entities for this scene, you can combine the `snapshot_entities` with `entities`.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "snapshot_entities": "- light.ceiling\n- light.kitchen\n"
       * > }
       * > ```
       */
      snapshot_entities?: PICK_ENTITY | PICK_ENTITY[];
    }): Promise<void>;
    /**
     * ### Delete
     *
     * > Deletes a dynamically created scene.
     */
    delete(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - integration: homeassistant
       * >     domain:
       * >       - scene
       * > ```
       */
      entity_id:
        | PICK_FROM_PLATFORM<"homeassistant", "scene">
        | PICK_FROM_PLATFORM<"homeassistant", "scene">[];
    }): Promise<void>;
    /**
     * ### Reload
     *
     * > Reloads the scenes from the YAML-configuration.
     */
    reload(service_data: {}): Promise<void>;
    /**
     * ### Activate
     *
     * > Activates a scene.
     */
    turn_on(service_data?: {
      /**
       * ## Transition
       *
       * > Time it takes the devices to transition into the states defined in the scene.
       *
       * ## Selector
       *
       * > ```yaml
       * > number:
       * >   min: 0
       * >   max: 300
       * >   unit_of_measurement: seconds
       * > ```
       */
      transition?: number;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - scene
       * > ```
       */
      entity_id: PICK_ENTITY<"scene"> | PICK_ENTITY<"scene">[];
    }): Promise<void>;
  };
  // # MARK: schedule
  schedule: {
    /**
     * ### Reload
     *
     * > Reloads schedules from the YAML-configuration.
     */
    reload(service_data: {}): Promise<void>;
  };
  // # MARK: script
  script: {
    /**
     * ### Reload
     *
     * > Reloads all the available scripts.
     */
    reload(service_data: {}): Promise<void>;
    /**
     * ### Toggle
     *
     * > Toggle a script. Starts it, if isn't running, stops it otherwise.
     */
    toggle(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - script
       * > ```
       */
      entity_id: PICK_ENTITY<"script"> | PICK_ENTITY<"script">[];
    }): Promise<void>;
    /**
     * ### Turn off
     *
     * > Stops a running script.
     */
    turn_off(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - script
       * > ```
       */
      entity_id: PICK_ENTITY<"script"> | PICK_ENTITY<"script">[];
    }): Promise<void>;
    /**
     * ### Turn on
     *
     * > Runs the sequence of actions defined in a script.
     */
    turn_on(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - script
       * > ```
       */
      entity_id: PICK_ENTITY<"script"> | PICK_ENTITY<"script">[];
    }): Promise<void>;
  };
  // # MARK: shopping_list
  shopping_list: {
    /**
     * ### Add item
     *
     * > Adds an item to the shopping list.
     */
    add_item(service_data: {
      /**
       * ## Name
       *
       * > The name of the item to add.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "name": "Beer"
       * > }
       * > ```
       */
      name: string;
    }): Promise<void>;
    /**
     * ### Clear completed items
     *
     * > Clears completed items from the shopping list.
     */
    clear_completed_items(service_data: {}): Promise<void>;
    /**
     * ### Complete all
     *
     * > Marks all items as completed in the shopping list (without removing them from the list).
     */
    complete_all(service_data: {}): Promise<void>;
    /**
     * ### Complete item
     *
     * > Marks the first item with matching name as completed in the shopping list.
     */
    complete_item(service_data: {
      /**
       * ## Name
       *
       * > The name of the item to mark as completed (without removing).
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "name": "Beer"
       * > }
       * > ```
       */
      name: string;
    }): Promise<void>;
    /**
     * ### Incomplete all
     *
     * > Marks all items as incomplete in the shopping list.
     */
    incomplete_all(service_data: {}): Promise<void>;
    /**
     * ### Incomplete item
     *
     * > Marks the first item with matching name as incomplete in the shopping list.
     */
    incomplete_item(service_data: {
      /**
       * ## Name
       *
       * > The name of the item to mark as incomplete.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "name": "Beer"
       * > }
       * > ```
       */
      name: string;
    }): Promise<void>;
    /**
     * ### Remove item
     *
     * > Removes the first item with matching name from the shopping list.
     */
    remove_item(service_data: {
      /**
       * ## Name
       *
       * > The name of the item to remove.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "name": "Beer"
       * > }
       * > ```
       */
      name: string;
    }): Promise<void>;
    /**
     * ### Sort all items
     *
     * > Sorts all items by name in the shopping list.
     */
    sort(service_data?: {
      /**
       * ## Sort reverse
       *
       * > Whether to sort in reverse (descending) order.
       *
       * ### Default
       *
       * > ```json
       * > false
       * > ```
       */
      reverse?: boolean;
    }): Promise<void>;
  };
  // # MARK: switch
  switch: {
    /**
     * ### Toggle
     *
     * > Toggles a switch on/off.
     */
    toggle(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - switch
       * > ```
       */
      entity_id: PICK_ENTITY<"switch"> | PICK_ENTITY<"switch">[];
    }): Promise<void>;
    /**
     * ### Turn off
     *
     * > Turns a switch off.
     */
    turn_off(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - switch
       * > ```
       */
      entity_id: PICK_ENTITY<"switch"> | PICK_ENTITY<"switch">[];
    }): Promise<void>;
    /**
     * ### Turn on
     *
     * > Turns a switch on.
     */
    turn_on(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - switch
       * > ```
       */
      entity_id: PICK_ENTITY<"switch"> | PICK_ENTITY<"switch">[];
    }): Promise<void>;
  };
  // # MARK: synapse
  synapse: {
    /**
     * ### reload
     *
     * > Ask synapse application to re-send the entity list. Sent to all connected by default
     */
    reload(service_data?: {
      /**
       * ## app
       *
       * > The name of the app to target for the reload. If omitted, targets all apps.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "app": "home_automation"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * >
       * > ```
       */
      app?: unknown;
    }): Promise<void>;
  };
  // # MARK: system_log
  system_log: {
    /**
     * ### Clear all
     *
     * > Clears all log entries.
     */
    clear(service_data: {}): Promise<void>;
    /**
     * ### Write
     *
     * > Write log entry.
     */
    write(service_data?: {
      /**
       * ## Level
       *
       * > Log level.
       *
       * ### Default
       *
       * > ```json
       * > "error"
       * > ```
       */
      level?: "debug" | "info" | "warning" | "error" | "critical";
      /**
       * ## Logger
       *
       * > Logger name under which to log the message. Defaults to `system_log.external`.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "logger": "mycomponent.myplatform"
       * > }
       * > ```
       */
      logger?: string;
      /**
       * ## Message
       *
       * > Message to log.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "message": "Something went wrong"
       * > }
       * > ```
       */
      message: string;
    }): Promise<void>;
  };
  // # MARK: timer
  timer: {
    /**
     * ### Cancel
     *
     * > Cancels a timer.
     */
    cancel(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - timer
       * > ```
       */
      entity_id: PICK_ENTITY<"timer"> | PICK_ENTITY<"timer">[];
    }): Promise<void>;
    /**
     * ### Change
     *
     * > Changes a timer.
     */
    change(service_data: {
      /**
       * ## Duration
       *
       * > Duration to add or subtract to the running timer.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "duration": "00:01:00, 60 or -60"
       * > }
       * > ```
       *
       * ### Default
       *
       * > ```json
       * > 0
       * > ```
       */
      duration: string;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - timer
       * > ```
       */
      entity_id: PICK_ENTITY<"timer"> | PICK_ENTITY<"timer">[];
    }): Promise<void>;
    /**
     * ### Finish
     *
     * > Finishes a timer.
     */
    finish(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - timer
       * > ```
       */
      entity_id: PICK_ENTITY<"timer"> | PICK_ENTITY<"timer">[];
    }): Promise<void>;
    /**
     * ### Pause
     *
     * > Pauses a timer.
     */
    pause(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - timer
       * > ```
       */
      entity_id: PICK_ENTITY<"timer"> | PICK_ENTITY<"timer">[];
    }): Promise<void>;
    /**
     * ### Reload
     *
     * > Reloads timers from the YAML-configuration.
     */
    reload(service_data: {}): Promise<void>;
    /**
     * ### Start
     *
     * > Starts a timer.
     */
    start(service_data?: {
      /**
       * ## Duration
       *
       * > Duration the timer requires to finish. [optional].
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "duration": "00:01:00 or 60"
       * > }
       * > ```
       */
      duration?: string;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - timer
       * > ```
       */
      entity_id: PICK_ENTITY<"timer"> | PICK_ENTITY<"timer">[];
    }): Promise<void>;
  };
  // # MARK: todo
  todo: {
    /**
     * ### Add to-do list item
     *
     * > Add a new to-do list item.
     */
    add_item(service_data?: {
      /**
       * ## Description
       *
       * > A more complete description of the to-do item than provided by the item name.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "description": "A more complete description of the to-do item than that provided by the summary."
       * > }
       * > ```
       */
      description?: string;
      /**
       * ## Due date
       *
       * > The date the to-do item is expected to be completed.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "due_date": "2023-11-17"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > date: null
       * > ```
       */
      due_date?: unknown;
      /**
       * ## Due date and time
       *
       * > The date and time the to-do item is expected to be completed.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "due_datetime": "2023-11-17 13:30:00"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > datetime: null
       * > ```
       */
      due_datetime?: unknown;
      /**
       * ## Item name
       *
       * > The name that represents the to-do item.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "item": "Submit income tax return"
       * > }
       * > ```
       */
      item: string;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - todo
       * >     supported_features:
       * >       - 1
       * > ```
       */
      entity_id: PICK_ENTITY<"todo"> | PICK_ENTITY<"todo">[];
    }): Promise<void>;
    /**
     * ### Get to-do list items
     *
     * > Get items on a to-do list.
     */
    get_items(service_data?: {
      /**
       * ## Status
       *
       * > Only return to-do items with the specified statuses. Returns not completed actions by default.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "status": "needs_action"
       * > }
       * > ```
       *
       * ### Default
       *
       * > ```json
       * > "needs_action"
       * > ```
       */
      status?: "needs_action" | "completed";
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - todo
       * > ```
       */
      entity_id: PICK_ENTITY<"todo"> | PICK_ENTITY<"todo">[];
    }): Promise<void>;
    /**
     * ### Remove all completed to-do list items
     *
     * > Remove all to-do list items that have been completed.
     */
    remove_completed_items(service_data: {
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - todo
       * >     supported_features:
       * >       - 2
       * > ```
       */
      entity_id: PICK_ENTITY<"todo"> | PICK_ENTITY<"todo">[];
    }): Promise<void>;
    /**
     * ### Remove a to-do list item
     *
     * > Remove an existing to-do list item by its name.
     */
    remove_item(service_data: {
      /**
       * ## Item name
       *
       * > The name for the to-do list items.
       */
      item: string;
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - todo
       * >     supported_features:
       * >       - 2
       * > ```
       */
      entity_id: PICK_ENTITY<"todo"> | PICK_ENTITY<"todo">[];
    }): Promise<void>;
    /**
     * ### Update to-do list item
     *
     * > Update an existing to-do list item based on its name.
     */
    update_item(service_data?: {
      /**
       * ## Description
       *
       * > A more complete description of the to-do item than provided by the item name.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "description": "A more complete description of the to-do item than that provided by the summary."
       * > }
       * > ```
       */
      description?: string;
      /**
       * ## Due date
       *
       * > The date the to-do item is expected to be completed.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "due_date": "2023-11-17"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > date: null
       * > ```
       */
      due_date?: unknown;
      /**
       * ## Due date and time
       *
       * > The date and time the to-do item is expected to be completed.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "due_datetime": "2023-11-17 13:30:00"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > datetime: null
       * > ```
       */
      due_datetime?: unknown;
      /**
       * ## Item name
       *
       * > The name for the to-do list item.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "item": "Submit income tax return"
       * > }
       * > ```
       */
      item: string;
      /**
       * ## Rename item
       *
       * > The new name of the to-do item
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "rename": "Something else"
       * > }
       * > ```
       */
      rename?: string;
      /**
       * ## Set status
       *
       * > A status or confirmation of the to-do item.
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "status": "needs_action"
       * > }
       * > ```
       */
      status?: "needs_action" | "completed";
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - todo
       * >     supported_features:
       * >       - 4
       * > ```
       */
      entity_id: PICK_ENTITY<"todo"> | PICK_ENTITY<"todo">[];
    }): Promise<void>;
  };
  // # MARK: tts
  tts: {
    /**
     * ### Clear TTS cache
     *
     * > Removes all cached text-to-speech files and purges the memory.
     */
    clear_cache(service_data: {}): Promise<void>;
    /**
     * ### Say a TTS message with cloud
     *
     * > Say something using text-to-speech on a media player with cloud.
     */
    cloud_say(service_data?: {
      /**
       * ## cache
       *
       * ### Default
       *
       * > ```json
       * > false
       * > ```
       */
      cache?: boolean;
      /**
       * ## entity_id
       */
      entity_id: PICK_ENTITY<"media_player"> | PICK_ENTITY<"media_player">[];
      /**
       * ## language
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "language": "ru"
       * > }
       * > ```
       */
      language?: string;
      /**
       * ## message
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "message": "My name is hanna"
       * > }
       * > ```
       */
      message: string;
      /**
       * ## options
       *
       * ### Example
       *
       * > ```json
       * > {
       * >   "options": "platform specific"
       * > }
       * > ```
       *
       * ## Selector
       *
       * > ```yaml
       * > object: null
       * > ```
       */
      options?: unknown;
    }): Promise<void>;
    /**
     * ### Speak
     *
     * > Speaks something using text-to-speech on a media player.
     */
    speak(
      service_data?: {
        /**
         * ## Cache
         *
         * > Stores this message locally so that when the text is requested again, the output can be produced more quickly.
         *
         * ### Default
         *
         * > ```json
         * > true
         * > ```
         */
        cache?: boolean;
        /**
         * ## Language
         *
         * > Language to use for speech generation.
         *
         * ### Example
         *
         * > ```json
         * > {
         * >   "language": "ru"
         * > }
         * > ```
         */
        language?: string;
        /**
         * ## Media player entity
         *
         * > Media players to play the message.
         */
        media_player_entity_id: PICK_ENTITY<"media_player"> | PICK_ENTITY<"media_player">[];
        /**
         * ## Message
         *
         * > The text you want to convert into speech so that you can listen to it on your device.
         *
         * ### Example
         *
         * > ```json
         * > {
         * >   "message": "My name is hanna"
         * > }
         * > ```
         */
        message: string;
        /**
         * ## Options
         *
         * > A dictionary containing integration-specific options.
         *
         * ### Example
         *
         * > ```json
         * > {
         * >   "options": "platform specific"
         * > }
         * > ```
         *
         * ## Selector
         *
         * > ```yaml
         * > object: null
         * > ```
         */
        options?: unknown;
      } & RequireAtLeastOne<{
        /**
         * Assisted definition
         * > ```yaml
         * > entity:
         * >   - domain:
         * >       - tts
         * > ```
         */
        entity_id: PICK_ENTITY<"tts"> | PICK_ENTITY<"tts">[];
      }>,
    ): Promise<void>;
  };
  // # MARK: zone
  zone: {
    /**
     * ### Reload
     *
     * > Reloads zones from the YAML-configuration.
     */
    reload(service_data: {}): Promise<void>;
  };
};

// #MARK: REGISTRY_SETUP
export type REGISTRY_SETUP = {
  area: {
    _test: "switch.living_room_mood_lights";
    _living_room: "switch.living_room_mood_lights";
    _kitchen: "switch.kitchen_cabinets";
    _bedroom: "switch.bedroom_lamp" | "light.bedroom_ceiling_fan";
  };
  platform: {
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
      | "switch.porch_light";
    _holiday: "calendar.united_states_tx";
  };
  label: {
    _synapse:
      | "binary_sensor.hass_e2e_online"
      | "sensor.magic"
      | "binary_sensor.toggles"
      | "switch.bedroom_lamp"
      | "switch.kitchen_cabinets"
      | "switch.living_room_mood_lights"
      | "switch.porch_light";
    _test: never;
  };
  floor: {
    _downstairs: "switch.kitchen_cabinets" | "switch.living_room_mood_lights";
    _upstairs: "switch.bedroom_lamp";
  };
  device: {
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
  };
};

// #MARK: TAreaId
export type TAreaId = "living_room" | "kitchen" | "bedroom" | "test";

// #MARK: TDeviceId
export type TDeviceId = "308e39cf50a9fc6c30b4110724ed1f2e" | "e58841e47cf86097b310316e55d6bb12";

// #MARK: TFloorId
export type TFloorId = "downstairs" | "upstairs";

// #MARK: TLabelId
export type TLabelId = "synapse" | "test";

// #MARK: TZoneId
export type TZoneId = string;

// #MARK: TRawEntityIds
export type TRawEntityIds =
  | "person.digital_alchemy"
  | "zone.home"
  | "sun.sun"
  | "sensor.sun_next_dawn"
  | "sensor.sun_next_dusk"
  | "button.example"
  | "sensor.sun_next_midnight"
  | "sensor.sun_next_noon"
  | "light.bedroom_ceiling_fan"
  | "scene.games_room_auto"
  | "sensor.sun_next_rising"
  | "sensor.sun_next_setting"
  | "todo.shopping_list"
  | "tts.google_en_com"
  | "binary_sensor.hass_e2e_online"
  | "sensor.magic"
  | "binary_sensor.toggles"
  | "switch.bedroom_lamp"
  | "switch.kitchen_cabinets"
  | "switch.living_room_mood_lights"
  | "switch.porch_light"
  | "calendar.united_states_tx";

// #MARK: TPlatformId
export type TPlatformId =
  | "sun"
  | "person"
  | "shopping_list"
  | "google_translate"
  | "synapse"
  | "holiday";

// #MARK: TRawDomains
export type TRawDomains =
  | "person"
  | "zone"
  | "sun"
  | "light"
  | "scene"
  | "button"
  | "sensor"
  | "todo"
  | "tts"
  | "binary_sensor"
  | "switch"
  | "calendar";

export type TUniqueIDMapping = {
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
};
export type TUniqueId =
  | "5622d76001a335e3ea893c4d60d31b3d-next_dawn"
  | "5622d76001a335e3ea893c4d60d31b3d-next_dusk"
  | "5622d76001a335e3ea893c4d60d31b3d-next_midnight"
  | "5622d76001a335e3ea893c4d60d31b3d-next_noon"
  | "5622d76001a335e3ea893c4d60d31b3d-next_rising"
  | "5622d76001a335e3ea893c4d60d31b3d-next_setting"
  | "5622d76001a335e3ea893c4d60d31b3d-solar_elevation"
  | "5622d76001a335e3ea893c4d60d31b3d-solar_azimuth"
  | "5622d76001a335e3ea893c4d60d31b3d-solar_rising"
  | "digital_alchemy"
  | "6acd101923c0460fc31bad82c4efa140"
  | "4a7fc2592d3a98e0eed8cbc73e839c1c"
  | "hass_e2e_is_online"
  | "e1806fdc93296bbd5ab42967003cd38729ff9ba6cfeefc3e15a03ad01ac894fe"
  | "a6e8373221727e197144ba689d7606d4be6f609f2fd0fd8e17516548780465ab"
  | "413eb6d69bbec134a07a6d32effd3c3763955e611f43256600cca40725276816"
  | "06d5a22e681ee9c668f8563bd3108853fb053c43342131782afe989090c4ced9"
  | "27b4fc99f35bbdd1a07173caff5b52f86e3bc342db96f48427e47980b0fb6b49"
  | "8eb8c1f8c760e97cfa49a0a29cd6891313a1e9a45dd046a556a9f317778cf50a"
  | "05ecbbc6111791b6baacbbb60397db14";
