import { CreateLibrary, StringConfig } from "@digital-alchemy/core";

import {
  Area,
  Backup,
  CallProxy,
  Configure,
  Device,
  EntityManager,
  Events,
  FetchAPI,
  Floor,
  Label,
  Registry,
  WebsocketAPI,
  Zone,
} from "./extensions";
import { IDByExtension } from "./extensions/id-by.extension";
import { ReferenceExtension } from "./extensions/reference.extension";

type AllowRestOptions = "prefer" | "allow" | "forbid";

export const LIB_HASS = CreateLibrary({
  configuration: {
    AUTO_CONNECT_SOCKET: {
      default: true,
      description: "Websocket must be manually initialized if set to false",
      type: "boolean",
    },
    AUTO_SCAN_CALL_PROXY: {
      default: true,
      description:
        "Should the call proxy request a service listing at bootstrap?",
      type: "boolean",
    },
    BASE_URL: {
      default: "http://homeassistant.local:8123",
      description: "Url to reach Home Assistant at",
      type: "string",
    },
    CALL_PROXY_ALLOW_REST: {
      default: "allow",
      description: [
        "Send commands from hass.call via rest instead of socket",
        "Allow = only if socket is not connected",
      ],
      enum: ["prefer", "forbid", "allow"],
      type: "string",
    } as StringConfig<AllowRestOptions>,
    EVENT_THROTTLE_MS: {
      default: 50,
      description: "Throttle reactions to registry changes",
      type: "number",
    },
    EXPECT_RESPONSE_AFTER: {
      default: 5,
      description:
        "If sendMessage was set to expect a response, a warning will be emitted after this delay if one is not received",
      type: "number",
    },
    MANAGE_REGISTRY: {
      default: true,
      description: "Live track registry data",
      type: "boolean",
    },
    MOCK_SOCKET: {
      default: false,
      description: [
        "Operate with an artificial socket connection",
        "For unit testing",
      ],
      type: "boolean",
    },
    RETRY_INTERVAL: {
      default: 5,
      description:
        "How often to retry connecting on connection failure (seconds).",
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
    TRACK_ENTITIES: {
      default: true,
      description:
        "Set to false to not fetch entity info at boot, and maintain states",
      type: "boolean",
    },
    VALIDATE_CONFIGURATION: {
      default: false,
      description: "Validate the credentials, then quit",
      type: "boolean",
    },
    WEBSOCKET_URL: {
      description: `Override calculated value if it's breaking or you want something custom. Make sure to use "ws[s]://" scheme.`,
      type: "string",
    },
  },
  name: "hass",
  // no internal dependency ones first
  priorityInit: ["fetch", "socket"],
  services: {
    area: Area,

    backup: Backup,

    /**
     * general service calling interface
     */
    call: CallProxy,

    /**
     * internal tools
     */
    configure: Configure,

    device: Device,
    /**
     * retrieve and interact with home assistant entities
     */
    entity: EntityManager,

    /**
     * Named event attachments
     */
    events: Events,

    /**
     * rest api commands
     */
    fetch: FetchAPI,
    floor: Floor,

    /**
     * Search for entity ids in a type safe way
     */
    idBy: IDByExtension,

    label: Label,

    /**
     * Obtain references to entities
     */
    refBy: ReferenceExtension,

    /**
     * Interact with the home assistant registry
     */
    registry: Registry,

    /**
     * websocket interface
     */
    socket: WebsocketAPI,
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
