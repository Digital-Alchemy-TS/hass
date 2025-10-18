import type { RemoveCallback, TBlackHole } from "@digital-alchemy/core";
import type EventEmitter from "events";
import type { EmptyObject } from "type-fest";
import type WS from "ws";

import type {
  ALL_DOMAINS,
  ANY_ENTITY,
  HassUniqueIdMapping,
  iCallService,
  PICK_ENTITY,
  PICK_FROM_AREA,
  PICK_FROM_DEVICE,
  PICK_FROM_FLOOR,
  PICK_FROM_LABEL,
  PICK_FROM_PLATFORM,
  TAreaId,
  TDeviceId,
  TFloorId,
  TLabelId,
  TPlatformId,
  TRawDomains,
  TRawEntityIds,
  TUniqueId,
} from "../user.mts";
import type { BackupResponse, HomeAssistantBackup } from "./backup.mts";
import type { DeviceDetails } from "./device.mts";
import type { ByIdProxy } from "./entity-state.mts";
import type { AreaCreate, AreaDetails, ConfigEntry, HassConfig, HassServiceDTO } from "./index.mts";
import type {
  EditAliasOptions,
  EditLabelOptions,
  EntityRegistryItem,
  FloorCreate,
  FloorDetails,
  LabelDefinition,
  LabelOptions,
  ManifestItem,
  ToggleExpose,
  UpdateCoreOptions,
  ZoneDetails,
  ZoneOptions,
} from "./registry.mts";
import type { ALL_SERVICE_DOMAINS, ENTITY_STATE } from "./utility.mts";
import type {
  EntityHistoryDTO,
  EntityHistoryResult,
  OnHassEventOptions,
  SocketMessageDTO,
  SocketSubscribeOptions,
} from "./websocket.mts";

export type HassAreaService = {
  apply: (
    area: TAreaId,
    entities: ANY_ENTITY[],
  ) => Promise<{
    updated: ANY_ENTITY[];
  }>;
  create: (details: AreaCreate) => Promise<void>;
  current: AreaDetails[];
  delete: (area_id: TAreaId) => Promise<void>;
  list: () => Promise<AreaDetails[]>;
  update: (details: AreaDetails) => Promise<void>;
};

export type HassZoneService = {
  create: (options: ZoneOptions) => Promise<void>;
  current: ZoneDetails[];
  list: () => Promise<ZoneDetails[]>;
  update: (zone_id: string, options: ZoneOptions) => Promise<void>;
};

export type HassLabelService = {
  create: (details: LabelOptions) => Promise<void>;
  current: LabelDefinition[];
  delete: (label_id: TLabelId) => Promise<void>;
  list: () => Promise<LabelDefinition[]>;
  update: (details: LabelDefinition) => Promise<void>;
};

export type HassBackupService = {
  download: (slug: string, destination: string) => Promise<void>;
  generate: () => Promise<HomeAssistantBackup>;
  list: () => Promise<BackupResponse>;
  remove: (slug: string) => Promise<void>;
};

export type HassConfigService = {
  getServices: () => HassServiceDTO[];
  isService: <DOMAIN extends ALL_SERVICE_DOMAINS>(
    domain: DOMAIN,
    service: string,
  ) => service is Extract<keyof iCallService[DOMAIN], string>;
  loadServiceList: (recursion?: number) => Promise<void>;
};

export type HassWebsocketAPI = {
  /**
   * @internal
   */
  attachScheduledFunctions: () => void;
  connection: WS;
  /**
   * the current state of the websocket
   */
  connectionState: ConnectionState;
  /**
   * can override as part of unit tests
   */
  createConnection: (url: string) => WS;
  /**
   * Convenient wrapper for sendMessage
   */
  fireEvent: (event_type: string, event_data?: object) => Promise<unknown>;
  /**
   * Set up a new websocket connection to home assistant
   *
   * This doesn't normally need to be called by applications, the extension self manages
   */
  init: () => Promise<void>;
  /**
   * run a callback when the socket finishes (re)connecting
   */
  onConnect: (callback: () => TBlackHole) => RemoveCallback;
  /**
   * Attach to the incoming stream of socket events. Do your own filtering and processing from there
   *
   * Returns removal function
   */
  onEvent: <DATA extends object>({
    context,
    event,
    once,
    exec,
  }: OnHassEventOptions<DATA>) => RemoveCallback;
  /**
   * @internal
   *
   * for unit testing
   */
  onMessage: (message: SocketMessageDTO) => Promise<void>;
  /**
   * when true:
   * - outgoing socket messages are blocked
   * - entities don't emit updates
   */
  pauseMessages: boolean;
  /**
   * Send a message to home assistant via the socket connection
   *
   * Applications probably want a higher level function than this
   */
  sendMessage: <RESPONSE_VALUE extends unknown = unknown>(
    data: {
      type: string;
      id?: number;
      [key: string]: unknown;
    },
    waitForResponse?: boolean,
    subscription?: () => void,
  ) => Promise<RESPONSE_VALUE>;
  /**
   * internal
   */
  setConnectionState: (state: ConnectionState) => void;
  /**
   * internal
   */
  socketEvents: EventEmitter;
  /**
   * Subscribe to hass core registry updates.
   *
   * Not the same as `onEvent` (you probably want that)
   */
  subscribe: <EVENT extends string, PAYLOAD extends  Record<string, unknown> = EmptyObject>({
    event_type,
    context,
    exec,
  }: SocketSubscribeOptions<EVENT, PAYLOAD>) => Promise<RemoveCallback>;
  /**
   * remove the current socket connection to home assistant
   *
   * will need to call init() again to start up
   */
  teardown: () => Promise<void>;
  waitForReply: (id: number, data: object, sentAt: Date) => Promise<void>;
};

/* eslint-disable @typescript-eslint/no-magic-numbers */
export enum WebsocketConnectionState {
  offline = 1,
  connecting = 2,
  connected = 3,
  unknown = 4,
  invalid = 5,
}
/* eslint-enable @typescript-eslint/no-magic-numbers */

export type ConnectionState = `${keyof typeof WebsocketConnectionState}`;

export type HassConversationService = {
  addAlias: (options: EditAliasOptions) => Promise<void>;
  removeAlias: (options: EditAliasOptions) => Promise<void>;
  setConversational: (options: ToggleExpose) => Promise<void>;
};

export type HassDeviceService = {
  current: DeviceDetails[];
  list: () => Promise<DeviceDetails[]>;
};

export type HassEntityManagerRegistry = {
  addLabel: ({ entity, label }: EditLabelOptions) => Promise<void>;
  current: EntityRegistryItem<TRawEntityIds>[];
  get: <ENTITY extends ANY_ENTITY>(entity_id: ENTITY) => Promise<EntityRegistryItem<ENTITY>>;
  list: () => Promise<EntityRegistryItem<TRawEntityIds>[]>;
  registryList: () => Promise<EntityRegistryItem<TRawEntityIds>[]>;
  removeEntity: (entity_id: ANY_ENTITY | ANY_ENTITY[]) => Promise<void>;
  removeLabel: ({ entity, label }: EditLabelOptions) => Promise<void>;
  source: () => Promise<Record<TRawEntityIds, { domain: string }>>;
};

export type TMasterState = {
  [DOMAIN in ALL_DOMAINS]: Record<string, ENTITY_STATE<PICK_ENTITY<DOMAIN>>>;
};

export type HassEntityManager = {
  /**
   * Internal library use only
   */
  _entityUpdateReceiver: <ENTITY extends ANY_ENTITY = TRawEntityIds>(
    entity_id: ENTITY,
    new_state: ENTITY_STATE<ENTITY>,
    old_state: ENTITY_STATE<ENTITY>,
  ) => void;
  _masterState: () => Partial<TMasterState>;
  /**
   * Retrieves the current state of a given entity. This method returns
   * raw data, offering a direct view of the entity's state at a given moment.
   */
  getCurrentState: <ENTITY_ID extends ANY_ENTITY>(entity_id: ENTITY_ID) => ENTITY_STATE<ENTITY_ID>;
  /**
   * Retrieves the historical state data of entities over a specified time
   * period. Useful for analysis or tracking changes over time.
   */
  history: <ENTITES extends ANY_ENTITY[]>(
    payload: Omit<EntityHistoryDTO<ENTITES>, "type">,
  ) => Promise<{
    [k: string]: EntityHistoryResult[];
  }>;
  /**
   * Provides a simple listing of all entity IDs. Useful for enumeration
   * and quick reference to all available entities.
   */
  listEntities: <DOMAIN extends ALL_DOMAINS = TRawDomains>(
    domain?: DOMAIN,
  ) => PICK_ENTITY<DOMAIN>[];
  /**
   * Returns the previous entity state (not a proxy)
   */
  previousState: (entity_id: ANY_ENTITY) => ENTITY_STATE<TRawEntityIds>;
  /**
   * Initiates a refresh of the current entity states. Useful for ensuring
   * synchronization with the latest state data from Home Assistant.
   */
  refresh: (recursion?: number) => Promise<void>;
  /**
   * Interact with the entity registry
   */
  registry: HassEntityManagerRegistry;
  /**
   * @internal
   */
  warnEarly: (method: string) => void;
};

export type SimpleCallback = () => TBlackHole;

export type HassEventsService = {
  onAreaRegistryUpdate: (callback: SimpleCallback) => RemoveCallback;
  onDeviceRegistryUpdate: (callback: SimpleCallback) => RemoveCallback;
  onEntityRegistryUpdate: (callback: SimpleCallback) => RemoveCallback;
  onFloorRegistryUpdate: (callback: SimpleCallback) => RemoveCallback;
  onLabelRegistryUpdate: (callback: SimpleCallback) => RemoveCallback;
  onZoneRegistryUpdate: (callback: SimpleCallback) => RemoveCallback;
};

export type HassFloorService = {
  create(details: FloorCreate): Promise<void>;
  current: FloorDetails[];
  delete(floor_id: TFloorId): Promise<void>;
  list(): Promise<FloorDetails[]>;
  update(details: FloorDetails): Promise<void>;
};

export type HassReferenceService = {
  area: <AREA extends TAreaId, DOMAINS extends TRawDomains = TRawDomains>(
    area: AREA,
    ...domains: DOMAINS[]
  ) => ByIdProxy<PICK_FROM_AREA<AREA, DOMAINS>>[];
  device: <DEVICE extends TDeviceId, DOMAINS extends TRawDomains = TRawDomains>(
    device: DEVICE,
    ...domains: DOMAINS[]
  ) => ByIdProxy<PICK_FROM_DEVICE<DEVICE, DOMAINS>>[];
  domain: <DOMAIN extends TRawDomains = TRawDomains>(
    domain: DOMAIN,
  ) => ByIdProxy<PICK_ENTITY<DOMAIN>>[];
  floor: <FLOOR extends TFloorId, DOMAINS extends TRawDomains = TRawDomains>(
    floor: FLOOR,
    ...domains: DOMAINS[]
  ) => ByIdProxy<PICK_FROM_FLOOR<FLOOR, DOMAINS>>[];
  id: <ENTITY_ID extends ANY_ENTITY>(entity_id: ENTITY_ID) => ByIdProxy<ENTITY_ID>;
  label: <LABEL extends TLabelId, DOMAINS extends TRawDomains = TRawDomains>(
    label: LABEL,
    ...domains: DOMAINS[]
  ) => ByIdProxy<PICK_FROM_LABEL<LABEL, DOMAINS>>[];
  platform: <PLATFORM extends TPlatformId, DOMAINS extends TRawDomains = TRawDomains>(
    platform: PLATFORM,
    ...domains: DOMAINS[]
  ) => ByIdProxy<PICK_FROM_PLATFORM<PLATFORM, DOMAINS>>[];
  unique_id: <
    UNIQUE_ID extends TUniqueId,
    ENTITY_ID extends Extract<HassUniqueIdMapping[UNIQUE_ID], ANY_ENTITY> = Extract<
      HassUniqueIdMapping[UNIQUE_ID],
      ANY_ENTITY
    >,
  >(
    unique_id: UNIQUE_ID,
  ) => ByIdProxy<ENTITY_ID>;
};

export type HassRegistryService = {
  getConfig: () => Promise<HassConfig>;
  getConfigEntries: () => Promise<ConfigEntry[]>;
  manifestList: () => Promise<ManifestItem[]>;
  updateCore: (options: UpdateCoreOptions) => Promise<void>;
};
