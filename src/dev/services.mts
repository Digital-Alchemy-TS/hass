/* eslint-disable sonarjs/class-name */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import type {
  AndroidNotificationData,
  AppleNotificationData,
  NotificationData,
} from "../helpers/index.mts";

declare module "../user.mts" {
  export interface iCallService {
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
    // # MARK: zone
    zone: {
      /**
       * ### Reload
       *
       * > Reloads zones from the YAML-configuration.
       */
      reload(service_data: {}): Promise<void>;
    };
  }
}
