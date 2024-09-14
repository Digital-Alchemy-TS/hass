import { CreateLibrary } from "@digital-alchemy/core";

import {
  Area,
  Backup,
  CallProxy,
  Configure,
  Device,
  EntityManager,
  Events,
  FetchAPI,
  FetchInternals,
  Floor,
  Label,
  Registry,
  WebsocketAPI,
  Zone,
} from "./extensions";
import { IDByExtension } from "./extensions/id-by.extension";
import { ReferenceExtension } from "./extensions/reference.extension";

export const LIB_HASS = CreateLibrary({
  configuration: {
    BASE_URL: {
      default: "http://homeassistant.local:8123",
      description: "Url to reach Home Assistant at",
      type: "string",
    },
    EVENT_DEBOUNCE_MS: {
      default: 50,
      description: "Debounce reactions to registry changes",
      type: "number",
    },
    EXPECT_RESPONSE_AFTER: {
      default: 5,
      description:
        "If sendMessage was set to expect a response, a warning will be emitted after this delay if one is not received",
      type: "number",
    },
    RETRY_INTERVAL: {
      default: 5,
      description: "How often to retry connecting on connection failure (seconds).",
      type: "number",
    },
    SOCKET_AVG_DURATION: {
      default: 5,
      description:
        "How many seconds worth of requests to use in avg for math in REQ_PER_SEC calculations",
      type: "number",
    },
    SOCKET_CRASH_REQUESTS_PER_SEC: {
      default: 500,
      description:
        "Socket service will commit sudoku if more than this many outgoing messages are sent to Home Assistant in a second. Usually indicates runaway code.",
      type: "number",
    },
    SOCKET_WARN_REQUESTS_PER_SEC: {
      default: 300,
      description:
        "Emit warnings if the home controller attempts to send more than X messages to Home Assistant inside of a second.",
      type: "number",
    },
    TOKEN: {
      description: "Long lived access token to Home Assistant.",
      required: true,
      type: "string",
    },
    VALIDATE_CONFIGURATION: {
      default: false,
      description: "Validate the credentials, then quit",
      type: "boolean",
    },
  },
  name: "hass",
  // no internal dependency ones first
  priorityInit: ["internals", "fetch", "socket"],
  services: {
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
     * retrieve and interact with home assistant entities
     */
    entity: EntityManager,

    /**
     * named event attachments
     */
    events: Events,

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

    internals: FetchInternals,

    /**
     * home assistant label interactions
     */
    label: Label,

    /**
     * obtain references to entities
     */
    refBy: ReferenceExtension,

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
