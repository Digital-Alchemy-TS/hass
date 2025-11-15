import { CreateLibrary } from "@digital-alchemy/core";

import {
  AddonService,
  Area,
  Backup,
  CallProxy,
  Configure,
  Device,
  EntityManager,
  EventsService,
  FetchAPI,
  FetchInternals,
  Floor,
  HassDiagnosticsService,
  HassFeatureService,
  IDByExtension,
  Label,
  ReferenceService,
  Registry,
  WebsocketAPI,
  Zone,
} from "./services/index.mts";

export const LIB_HASS = CreateLibrary({
  configuration: {
    /**
     * Where to reach Home Assistant at
     *
     * Will auto detect inside an addon
     */
    BASE_URL: {
      default: "http://homeassistant.local:8123",
      description: "Url to reach Home Assistant at",
      type: "string",
    },

    /**
     * Setting this to true will tell hass.diagnostics to create the related channels & start emitting
     */
    EMIT_DIAGNOSTICS: {
      default: false,
      description: [
        "Enable the creation of diagnostics channels",
        "Value read at bootstrap, cannot be set by env or at runtime",
      ],
      type: "boolean",
    },

    /**
     * When adding new integrations, app will receive 1 update event for everything that changes.
     * This can result in a flood of updates where only a single one is needed at the very end.
     *
     * This setting helps control that.
     */
    EVENT_DEBOUNCE_MS: {
      default: 50,
      description: "Debounce reactions to registry changes",
      type: "number",
    },

    /**
     * ## ACKNOWLEDGE ME
     *
     * Home Assistant **should** respond to all sent messages with a reply to confirm it was received.
     *
     * If this does not happen, then a warning will be emitted into the logs
     */
    EXPECT_RESPONSE_AFTER: {
      default: 5,
      description:
        "If sendMessage was set to expect a response, a warning will be emitted after this delay if one is not received",
      type: "number",
    },

    /**
     * This is reflected in type-writer, make sure to keep your runtime & types in sync
     *
     * By default disabled entities are removed to help keep file bloat down
     */
    FILTER_DISABLED_ENTITIES_ID_BY: {
      default: true,
      description: "Filter events from disabled entities in id",
      type: "boolean",
    },

    /**
     * General purpose variable, adds delays to things when retrying
     *
     * > **NOTE**: this is best set to `0` for unit tests
     */
    RETRY_INTERVAL: {
      default: 5,
      description: "How often to retry connecting on connection failure (seconds)",
      type: "number",
    },

    /**
     * @internal
     */
    SOCKET_AVG_DURATION: {
      default: 5,
      description:
        "How many seconds worth of requests to use in avg for math in REQ_PER_SEC calculations",
      type: "number",
    },

    /**
     * @internal
     */
    SOCKET_CRASH_REQUESTS_PER_SEC: {
      default: 500,
      description:
        "Socket service will commit sudoku if more than this many outgoing messages are sent to Home Assistant in a second. Usually indicates runaway code",
      type: "number",
    },

    /**
     * @internal
     */
    SOCKET_WARN_REQUESTS_PER_SEC: {
      default: 300,
      description:
        "Emit warnings if the home controller attempts to send more than X messages to Home Assistant inside of a second",
      type: "number",
    },

    /**
     * Long lived access token
     */
    TOKEN: {
      description: "Long lived access token to Home Assistant",
      required: true,
      type: "string",
    },

    /**
     * Intended to be provided via command line switch. Ex:
     *
     * ```bash
     * $ node dist/main.js --validate-configuration
     * ```
     */
    VALIDATE_CONFIGURATION: {
      default: false,
      description: "Validate the credentials then quit",
      type: "boolean",
    },
  },
  name: "hass",
  // no internal dependency ones first
  priorityInit: ["internals", "fetch", "socket"],
  services: {
    addon: AddonService,

    /**
     * home assistant areas
     */
    area: Area,

    /**
     * home assistant backup interactions
     */
    backup: Backup,

    /**
     * general service calling interface
     */
    call: CallProxy,

    /**
     * internal tools
     */
    configure: Configure,

    /**
     * device interactions
     */
    device: Device,

    /**
     *
     */
    diagnostics: HassDiagnosticsService,

    /**
     * retrieve and interact with home assistant entities
     */
    entity: EntityManager,

    /**
     * named event attachments
     */
    events: EventsService,

    /**
     * feature flag checking for entities
     */
    feature: HassFeatureService,

    /**
     * rest api commands
     */
    fetch: FetchAPI,

    /**
     * floors, like groups of areas
     */
    floor: Floor,

    /**
     * search for entity ids in a type safe way
     */
    idBy: IDByExtension,

    /**
     * @internal
     */
    internals: FetchInternals,

    /**
     * home assistant label interactions
     */
    label: Label,

    /**
     * obtain references to entities
     */
    refBy: ReferenceService,

    /**
     * interact with the home assistant registry
     */
    registry: Registry,

    /**
     * websocket interface
     */
    socket: WebsocketAPI,

    /**
     * zone interactions
     */
    zone: Zone,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    /**
     * tools for interacting with home assistant
     */
    hass: typeof LIB_HASS;
  }
}
