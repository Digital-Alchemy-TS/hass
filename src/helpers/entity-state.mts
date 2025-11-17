import type { FIRST, RemoveCallback, TBlackHole, TContext, TOffset } from "@digital-alchemy/core";
import type { Dayjs } from "dayjs";
import type { Except } from "type-fest";

import type {
  ALL_DOMAINS,
  ANY_ENTITY,
  GetDomain,
  iCallService,
  PICK_ENTITY,
  TAreaId,
  TDeviceId,
  TLabelId,
  TPlatformId,
  TRawDomains,
} from "../user.mts";
import type { SensorUnitOfMeasurement } from "./registry.mts";
import type { ALL_SERVICE_DOMAINS, ENTITY_STATE } from "./utility.mts";

export interface HassEntityContext {
  id: string | null;
  parent_id: string | null;
  user_id: string | null;
}

type GenericEntityAttributes = {
  /**
   * Entity groups
   */
  entity_id?: ANY_ENTITY[];
  /**
   * Human readable name
   */
  friendly_name?: string;
};

export type EntityHistoryItem = { a: object; s: unknown; lu: number };

export type TEntityUpdateCallback<ENTITY_ID extends ANY_ENTITY> = (
  new_state: NonNullable<ENTITY_STATE<ENTITY_ID>>,
  old_state: NonNullable<ENTITY_STATE<ENTITY_ID>>,
  remove: () => TBlackHole,
) => TBlackHole;

export type RemovableCallback<ENTITY_ID extends ANY_ENTITY> = (
  callback: TEntityUpdateCallback<ENTITY_ID>,
) => RemoveCallback;

export type OnStateForOptions<ENTITY_ID extends ANY_ENTITY> = (
  | (Pick<ENTITY_STATE<ENTITY_ID>, "state"> & { matches?: never })
  | ({
      matches: (new_state: ENTITY_STATE<ENTITY_ID>, old_state: ENTITY_STATE<ENTITY_ID>) => boolean;
    } & { state?: never })
) & {
  for: TOffset;
  context?: TContext;
  exec: (state: ByIdProxy<ENTITY_ID>) => TBlackHole;
};

export type ByIdProxy<ENTITY_ID extends ANY_ENTITY> = ENTITY_STATE<ENTITY_ID> & {
  entity_id: ENTITY_ID;
  /**
   * Run callback
   */
  onUpdate: RemovableCallback<ENTITY_ID>;
  /**
   * Retrieve state changes for an entity in a date range
   */
  history: (from: Dayjs | Date, to: Dayjs | Date) => Promise<ENTITY_STATE<ENTITY_ID>[]>;
  /**
   * Run callback once, for next update
   */
  once: (callback: TEntityUpdateCallback<ENTITY_ID>) => RemoveCallback;
  /**
   * Will resolve with the next state of the next value. No time limit
   */
  nextState: (timeoutMs?: TOffset) => Promise<ENTITY_STATE<ENTITY_ID>>;
  /**
   * Runs on state change -
   * If state matches the indicated target, then a timer will be initiated
   * As long as the condition holds true, the callback will be executed at end of the timer
   */
  onStateFor: (options: OnStateForOptions<ENTITY_ID>) => RemoveCallback;
  /**
   * Will resolve when state
   */
  waitForState: (state: string | number, timeout?: TOffset) => Promise<ENTITY_STATE<ENTITY_ID>>;
  /**
   * Access the immediate previous entity state
   */
  previous: ENTITY_STATE<ENTITY_ID>;
  /**
   * add a listener that can be removed with the removeAllListeners call
   *
   * for use by other libraries
   */
  addListener: (remove: RemoveCallback) => void;
  /**
   * Remove all resources related to this particular proxy
   *
   * Will interrupt methods like "nextState", causing them to never return
   */
  removeAllListeners: () => void;
} & (GetDomain<ENTITY_ID> extends ALL_SERVICE_DOMAINS
    ? DomainServiceCalls<GetDomain<ENTITY_ID>>
    : object);

type DomainServiceCalls<DOMAIN extends Extract<ALL_DOMAINS, ALL_SERVICE_DOMAINS>> = {
  [SERVICE in Extract<keyof iCallService[DOMAIN], string>]: CallRewrite<DOMAIN, SERVICE>;
};

type CallRewrite<
  D extends Extract<ALL_DOMAINS, ALL_SERVICE_DOMAINS>,
  S extends keyof iCallService[D],
> = (
  // @ts-expect-error fix another day, the transformation is valid
  data?: Except<Parameters<iCallService[D][S]>[typeof FIRST], "entity_id">,
) => Promise<void>;

export interface GenericEntityDTO<
  ATTRIBUTES extends object = GenericEntityAttributes,
  STATE extends unknown = string,
  CONTEXT extends HassEntityContext = HassEntityContext,
  DOMAIN extends TRawDomains = TRawDomains,
> {
  attributes: ATTRIBUTES;
  context: CONTEXT;
  entity_id: PICK_ENTITY<DOMAIN>;
  last_changed: string;
  last_updated: string;
  state: STATE;
}

export interface EventData<ID extends ANY_ENTITY = ANY_ENTITY> {
  entity_id?: ID;
  event?: number;
  id?: string;
  new_state?: ENTITY_STATE<ID>;
  old_state?: ENTITY_STATE<ID>;
}
export type EntityUpdateEvent<
  ID extends ANY_ENTITY = ANY_ENTITY,
  CONTEXT extends HassEntityContext = HassEntityContext,
> = {
  context: CONTEXT;
  data: EventData<ID>;
  event_type: string;
  origin: "local";
  result?: string;
  time_fired: Date;
  variables: Record<string, unknown>;
};

export interface EntityDetails<ENTITY extends ANY_ENTITY> {
  area_id: TAreaId;
  categories: Categories;
  config_entry_id: null | string;
  device_id: TDeviceId;
  disabled_by: string | null;
  entity_category: string | null;
  entity_id: ENTITY;
  has_entity_name: boolean;
  hidden_by: string | null;
  icon: null;
  id: string;
  labels: TLabelId[];
  name: null | string;
  options: Options;
  original_name: null | string;
  platform: TPlatformId;
  translation_key: null | string;
  unique_id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Categories {}

export interface Options {
  conversation: Conversation;
  "sensor.private"?: SensorPrivate;
  sensor?: Sensor;
}

export interface Conversation {
  should_expose: boolean;
}

export interface Sensor {
  suggested_display_precision?: number;
  display_precision?: null;
  unit_of_measurement?: SensorUnitOfMeasurement;
}

export interface SensorPrivate {
  suggested_unit_of_measurement: string;
}
