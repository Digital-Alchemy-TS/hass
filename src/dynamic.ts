/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @cspell/spellchecker */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
// @ts-nocheck
import { PICK_ENTITY } from "./helpers";

type PICK_FROM_PLATFORM<
  ID extends TPlatformId,
  DOMAIN extends TRawDomains = TRawDomains,
> = Extract<REGISTRY_SETUP["platform"][`_${ID}`], PICK_ENTITY<DOMAIN>>;

// #MARK: ENTITY_SETUP
export const ENTITY_SETUP = {
  binary_sensor: {
    hass_e2e_online: {
      attributes: {
        friendly_name: "hass_e2e online",
      },
      entity_id: "binary_sensor.hass_e2e_online",
      last_changed: "2024-05-01T23:01:44.812474+00:00",
      context: {
        id: "01HWV68XQCWCA6DPV7QN6B11R8",
        parent_id: null,
        user_id: null,
      },
      state: "on",
      last_reported: "2024-05-01T23:01:44.812474+00:00",
      last_updated: "2024-05-01T23:01:44.812474+00:00",
    },
    toggles: {
      attributes: {
        "Managed By": "hass_e2e",
        friendly_name: "toggles",
        icon: "mdi:toggle-switch-variant-off",
      },
      entity_id: "binary_sensor.toggles",
      last_changed: "2024-05-01T23:01:59.325631+00:00",
      context: {
        id: "01HWV69BWXX0EMASCYWG9XHYBV",
        parent_id: null,
        user_id: null,
      },
      state: "off",
      last_reported: "2024-05-01T23:01:59.325631+00:00",
      last_updated: "2024-05-01T23:01:59.325631+00:00",
    },
  },
  person: {
    digital_alchemy: {
      attributes: {
        device_trackers: [],
        editable: true,
        friendly_name: "digital-alchemy",
        id: "digital_alchemy",
        user_id: "4dd1cf7e93e94f3fbaf419501f9a3d59",
      },
      context: {
        id: "01HWV5P32NTRFVKB5TWZR050SG",
        parent_id: null,
        user_id: null,
      },
      entity_id: "person.digital_alchemy",
      last_changed: "2024-05-01T22:51:27.701166+00:00",
      last_reported: "2024-05-01T22:51:27.701396+00:00",
      last_updated: "2024-05-01T22:51:27.701166+00:00",
      state: "unknown",
    },
  },
  sensor: {
    sun_next_dawn: {
      attributes: {
        device_class: "timestamp",
        friendly_name: "Sun Next dawn",
      },
      context: {
        id: "01HWV5PGN9K3WCDRZQADJVMDRH",
        parent_id: null,
        user_id: null,
      },
      entity_id: "sensor.sun_next_dawn",
      last_changed: "2024-05-01T22:51:41.609579+00:00",
      last_reported: "2024-05-01T22:51:41.609579+00:00",
      last_updated: "2024-05-01T22:51:41.609579+00:00",
      state: "2024-05-02T03:26:53+00:00",
    },
    magic: {
      entity_id: "sensor.magic",
      state: "50",
      attributes: {
        "Managed By": "hass_e2e",
        icon: "mdi:satellite-uplink",
        friendly_name: "magic",
      },
      last_changed: "2024-05-01T23:01:44.813217+00:00",
      last_reported: "2024-05-01T23:01:44.813217+00:00",
      last_updated: "2024-05-01T23:01:44.813217+00:00",
      context: {
        id: "01HWV68XQDEZQMGKTKDVG12NFE",
        parent_id: null,
        user_id: null,
      },
    },
    sun_next_dusk: {
      attributes: {
        device_class: "timestamp",
        friendly_name: "Sun Next dusk",
      },
      entity_id: "sensor.sun_next_dusk",
      context: {
        id: "01HWV5PGNA8DTYRM3NJ9RA8MWG",
        parent_id: null,
        user_id: null,
      },
      last_changed: "2024-05-01T22:51:41.610181+00:00",
      last_reported: "2024-05-01T22:51:41.610181+00:00",
      state: "2024-05-02T19:49:14+00:00",
      last_updated: "2024-05-01T22:51:41.610181+00:00",
    },
    sun_next_midnight: {
      attributes: {
        device_class: "timestamp",
        friendly_name: "Sun Next midnight",
      },
      entity_id: "sensor.sun_next_midnight",
      context: {
        id: "01HWV8A5SWKXXSKXAYK1VZ401B",
        parent_id: null,
        user_id: null,
      },
      last_changed: "2024-05-01T23:37:23.004639+00:00",
      last_reported: "2024-05-01T23:37:23.004639+00:00",
      state: "2024-05-02T23:37:17+00:00",
      last_updated: "2024-05-01T23:37:23.004639+00:00",
    },
    sun_next_noon: {
      attributes: {
        device_class: "timestamp",
        friendly_name: "Sun Next noon",
      },
      entity_id: "sensor.sun_next_noon",
      context: {
        id: "01HWV5PGNAJC17N1C0FW2738EX",
        parent_id: null,
        user_id: null,
      },
      last_changed: "2024-05-01T22:51:41.610338+00:00",
      last_reported: "2024-05-01T22:51:41.610338+00:00",
      state: "2024-05-02T11:37:25+00:00",
      last_updated: "2024-05-01T22:51:41.610338+00:00",
    },
    sun_next_rising: {
      attributes: {
        device_class: "timestamp",
        friendly_name: "Sun Next rising",
      },
      entity_id: "sensor.sun_next_rising",
      context: {
        id: "01HWV5PGNAF25ESYKV9K0EFXXG",
        parent_id: null,
        user_id: null,
      },
      last_changed: "2024-05-01T22:51:41.610407+00:00",
      last_reported: "2024-05-01T22:51:41.610407+00:00",
      state: "2024-05-02T04:07:11+00:00",
      last_updated: "2024-05-01T22:51:41.610407+00:00",
    },
    sun_next_setting: {
      attributes: {
        device_class: "timestamp",
        friendly_name: "Sun Next setting",
      },
      entity_id: "sensor.sun_next_setting",
      context: {
        id: "01HWV5PGNABNXC3KSBH487VZ35",
        parent_id: null,
        user_id: null,
      },
      last_changed: "2024-05-01T22:51:41.610467+00:00",
      last_reported: "2024-05-01T22:51:41.610467+00:00",
      state: "2024-05-02T19:08:39+00:00",
      last_updated: "2024-05-01T22:51:41.610467+00:00",
    },
  },
  sun: {
    sun: {
      attributes: {
        next_dawn: "2024-05-02T03:26:53.682544+00:00",
        next_dusk: "2024-05-02T19:49:14.518121+00:00",
        next_midnight: "2024-05-02T23:37:17+00:00",
        elevation: -22.15,
        next_noon: "2024-05-02T11:37:25+00:00",
        azimuth: 359.99,
        next_rising: "2024-05-02T04:07:11.617514+00:00",
        friendly_name: "Sun",
        next_setting: "2024-05-02T19:08:39.868356+00:00",
        rising: true,
      },
      context: {
        id: "01HWV8A5SVJ1QHYFT5MJBAC43N",
        parent_id: null,
        user_id: null,
      },
      entity_id: "sun.sun",
      last_changed: "2024-05-01T22:51:05.526268+00:00",
      last_reported: "2024-05-01T23:37:23.003978+00:00",
      last_updated: "2024-05-01T23:37:23.003978+00:00",
      state: "below_horizon",
    },
  },
  switch: {
    bedroom_lamp: {
      attributes: {
        "Managed By": "hass_e2e",
        friendly_name: "bedroom_lamp",
      },
      context: {
        id: "01HWV6F85B042WZZDCQZVBPHXV",
        parent_id: null,
        user_id: "4dd1cf7e93e94f3fbaf419501f9a3d59",
      },
      entity_id: "switch.bedroom_lamp",
      last_changed: "2024-05-01T23:05:12.108917+00:00",
      last_reported: "2024-05-01T23:05:12.108917+00:00",
      last_updated: "2024-05-01T23:05:12.108917+00:00",
      state: "off",
    },
    kitchen_cabinets: {
      attributes: {
        "Managed By": "hass_e2e",
        friendly_name: "kitchen_cabinets",
      },
      context: {
        id: "01HWV6F85B042WZZDCQZVBPHXV",
        parent_id: null,
        user_id: "4dd1cf7e93e94f3fbaf419501f9a3d59",
      },
      entity_id: "switch.kitchen_cabinets",
      last_changed: "2024-05-01T23:05:12.109259+00:00",
      last_reported: "2024-05-01T23:05:12.109259+00:00",
      last_updated: "2024-05-01T23:05:12.109259+00:00",
      state: "off",
    },
    living_room_mood_lights: {
      attributes: {
        "Managed By": "hass_e2e",
        friendly_name: "living_room_mood_lights",
      },
      context: {
        id: "01HWV6F85B042WZZDCQZVBPHXV",
        parent_id: null,
        user_id: "4dd1cf7e93e94f3fbaf419501f9a3d59",
      },
      entity_id: "switch.living_room_mood_lights",
      last_changed: "2024-05-01T23:05:12.109188+00:00",
      last_reported: "2024-05-01T23:05:12.109188+00:00",
      last_updated: "2024-05-01T23:05:12.109188+00:00",
      state: "off",
    },
    porch_light: {
      attributes: {
        "Managed By": "hass_e2e",
        friendly_name: "porch_light",
      },
      context: {
        id: "01HWV6F85B042WZZDCQZVBPHXV",
        parent_id: null,
        user_id: "4dd1cf7e93e94f3fbaf419501f9a3d59",
      },
      entity_id: "switch.porch_light",
      last_changed: "2024-05-01T23:05:12.109093+00:00",
      last_reported: "2024-05-01T23:05:12.109093+00:00",
      last_updated: "2024-05-01T23:05:12.109093+00:00",
      state: "off",
    },
  },
  todo: {
    shopping_list: {
      attributes: {
        friendly_name: "Shopping List",
        supported_features: 15,
      },
      context: {
        id: "01HWV5PGTV7D14QE96K8JP81YB",
        parent_id: null,
        user_id: null,
      },
      entity_id: "todo.shopping_list",
      last_changed: "2024-05-01T22:51:41.787493+00:00",
      last_reported: "2024-05-01T22:51:41.788855+00:00",
      last_updated: "2024-05-01T22:51:41.787493+00:00",
      state: "0",
    },
  },
  tts: {
    google_en_com: {
      attributes: {
        friendly_name: "Google en com",
      },
      context: {
        id: "01HWV5PGVBKJXG1JETDP9QA7P4",
        parent_id: null,
        user_id: null,
      },
      entity_id: "tts.google_en_com",
      last_changed: "2024-05-01T22:51:41.803208+00:00",
      last_reported: "2024-05-01T22:51:41.804626+00:00",
      last_updated: "2024-05-01T22:51:41.803208+00:00",
      state: "unknown",
    },
  },
  zone: {
    home: {
      attributes: {
        latitude: 52.373_133_9,
        longitude: 4.890_314_7,
        radius: 100,
        passive: false,
        persons: [],
        editable: true,
        icon: "mdi:home",
        friendly_name: "Home",
      },
      entity_id: "zone.home",
      last_changed: "2024-05-01T22:51:05.475652+00:00",
      state: "0",
      context: {
        id: "01HWV5PGN6S5B586JJ7VFH10SX",
        parent_id: null,
        user_id: null,
      },
      last_reported: "2024-05-01T22:51:41.606270+00:00",
      last_updated: "2024-05-01T22:51:41.606270+00:00",
    },
  },
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
      entity_id:
        | PICK_ENTITY<"input_datetime">
        | PICK_ENTITY<"input_datetime">[];
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
      data?: unknown;
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
      data?: unknown;
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
    speak(service_data?: {
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
      media_player_entity_id:
        | PICK_ENTITY<"media_player">
        | PICK_ENTITY<"media_player">[];
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
      /**
       * Assisted definition
       * > ```yaml
       * > entity:
       * >   - domain:
       * >       - tts
       * > ```
       */
      entity_id: PICK_ENTITY<"tts"> | PICK_ENTITY<"tts">[];
    }): Promise<void>;
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
    _living_room: "switch.living_room_mood_lights";
    _kitchen: "switch.kitchen_cabinets";
    _bedroom: "switch.bedroom_lamp";
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
      | "binary_sensor.toggles"
      | "switch.bedroom_lamp"
      | "switch.kitchen_cabinets"
      | "switch.living_room_mood_lights"
      | "switch.porch_light";
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
      | "sensor.sun_solar_elevation"
      | "sensor.sun_solar_azimuth"
      | "sensor.sun_solar_rising";
  };
};

// #MARK: TAreaId
export type TAreaId = "living_room" | "kitchen" | "bedroom";

// #MARK: TDeviceId
export type TDeviceId = "308e39cf50a9fc6c30b4110724ed1f2e";

// #MARK: TFloorId
export type TFloorId = "downstairs" | "upstairs";

// #MARK: TLabelId
export type TLabelId = "synapse";

// #MARK: TZoneId
export type TZoneId = string;

// #MARK: TRawEntityIds
export type TRawEntityIds =
  | "zone.home"
  | "sun.sun"
  | "sensor.sun_next_dawn"
  | "sensor.sun_next_dusk"
  | "sensor.sun_next_midnight"
  | "sensor.sun_next_noon"
  | "sensor.sun_next_rising"
  | "sensor.sun_next_setting"
  | "person.digital_alchemy"
  | "todo.shopping_list"
  | "tts.google_en_com"
  | "binary_sensor.hass_e2e_online"
  | "sensor.magic"
  | "binary_sensor.toggles"
  | "switch.bedroom_lamp"
  | "switch.kitchen_cabinets"
  | "switch.living_room_mood_lights"
  | "switch.porch_light";

// #MARK: TPlatformId
export type TPlatformId =
  | "sun"
  | "person"
  | "shopping_list"
  | "google_translate"
  | "synapse";

// #MARK: TRawDomains
export type TRawDomains =
  | "zone"
  | "sun"
  | "sensor"
  | "person"
  | "todo"
  | "tts"
  | "binary_sensor"
  | "switch";
