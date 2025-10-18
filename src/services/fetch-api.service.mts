import type { TServiceParams } from "@digital-alchemy/core";
import { DOWN, NO_CHANGE, SECOND, UP } from "@digital-alchemy/core";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import type { FetchArguments, FilteredFetchArguments, TFetchBody } from "../helpers/fetch.mts";
import type {
  ALL_SERVICE_DOMAINS,
  CalendarEvent,
  CalendarFetchOptions,
  CheckConfigResult,
  ENTITY_STATE,
  HassConfig,
  HassServiceDTO,
  HomeAssistantServerLogItem,
  PICK_SERVICE,
  PICK_SERVICE_PARAMETERS,
  RawCalendarEvent,
} from "../helpers/index.mts";
import { perf, PostConfigPriorities } from "../helpers/index.mts";
import type { ANY_ENTITY } from "../user.mts";

type SendBody<STATE extends string | number = string, ATTRIBUTES extends object = object> = {
  attributes?: ATTRIBUTES;
  state?: STATE;
};

export function FetchAPI({
  logger,
  lifecycle,
  context,
  hass,
  config,
  internal: {
    utils: { is },
  },
}: TServiceParams) {
  const fetcher = hass.internals({ context });
  const { download: downloader } = fetcher;

  // Load configurations
  lifecycle.onPostConfig(() => {
    fetcher.base_url = config.hass.BASE_URL;
    fetcher.base_headers = { Authorization: `Bearer ${config.hass.TOKEN}` };
  }, PostConfigPriorities.FETCH);

  async function calendarSearch({
    calendar,
    start = dayjs(),
    end,
  }: CalendarFetchOptions): Promise<CalendarEvent[]> {
    if (Array.isArray(calendar)) {
      const list = await Promise.all(
        calendar.map(async cal => await calendarSearch({ calendar: cal, end, start })),
      );
      return list.flat().sort((a, b) =>
        // eslint-disable-next-line sonarjs/no-nested-conditional
        a.start.isSame(b.start) ? NO_CHANGE : a.start.isAfter(b.start) ? UP : DOWN,
      );
    }

    const params = { end: end.toISOString(), start: start.toISOString() };
    const events = await hass.fetch.fetch<RawCalendarEvent[]>({
      params,
      url: `/api/calendars/${encodeURIComponent(calendar)}`,
    });
    logger.trace(
      { name: calendarSearch, params },
      `%s search found %s events`,
      calendar,
      events.length,
    );
    return events.map(({ start, end, ...extra }) => ({
      ...extra,
      end: dayjs(end.dateTime),
      start: dayjs(start.dateTime),
    }));
  }

  async function callService<
    DOMAIN extends ALL_SERVICE_DOMAINS,
    SERVICE extends PICK_SERVICE<DOMAIN>,
  >(serviceName: SERVICE, data: PICK_SERVICE_PARAMETERS<DOMAIN, SERVICE>): Promise<void> {
    const [domain, service] = serviceName.split(".");
    await hass.fetch.fetch({
      body: data as TFetchBody,
      method: "post",
      url: `/api/services/${domain}/${service}`,
    });
  }

  async function checkConfig(): Promise<CheckConfigResult> {
    logger.trace({ name: checkConfig }, `send`);
    return await hass.fetch.fetch({
      method: `post`,
      url: `/api/config/core/check_config`,
    });
  }

  async function download(destination: string, fetchWith: FilteredFetchArguments): Promise<void> {
    logger.trace({ name: download }, `send`);
    await downloader({
      ...fetchWith,
      baseUrl: config.hass.BASE_URL,
      destination,
      headers: { Authorization: `Bearer ${config.hass.TOKEN}` },
    });
  }

  async function fetchEntityCustomizations<
    T extends Record<never, unknown> = Record<"global" | "local", Record<string, string>>,
  >(entityId: ANY_ENTITY): Promise<T> {
    logger.trace({ name: fetchEntityCustomizations }, `send`);
    return await hass.fetch.fetch<T>({
      url: `/api/config/customize/config/${encodeURIComponent(entityId)}`,
    });
  }

  async function fetchEntityHistory<
    ENTITY extends ANY_ENTITY = ANY_ENTITY,
    T extends ENTITY_STATE<ENTITY> = ENTITY_STATE<ENTITY>,
  >(
    entity_id: ENTITY,
    from: Date | Dayjs,
    to: Date | Dayjs,
    extra: { minimal_response?: "" } = {},
  ): Promise<T[]> {
    logger.info(
      {
        entity_id,
        from: dayjs(from).toISOString(),
        name: fetchEntityHistory,
        to: dayjs(to).toISOString(),
      },
      `fetch entity history`,
    );
    const result = await hass.fetch.fetch<[T[]]>({
      params: {
        end_time: to.toISOString(),
        filter_entity_id: entity_id,
        ...extra,
      },
      url: `/api/history/period/${encodeURIComponent(from.toISOString())}`,
    });
    if (!Array.isArray(result)) {
      logger.error({ name: fetchEntityHistory, result }, `unexpected return result`);
      return [];
    }
    const [out] = result;
    return out;
  }

  async function fireEvent<DATA extends TFetchBody = object>(
    event: string,
    data?: DATA,
  ): Promise<void> {
    logger.trace({ data, event, name: fireEvent }, `firing event`);
    const response = await hass.fetch.fetch<{ message: string }, DATA>({
      body: data,
      method: "post",
      url: `/api/events/${encodeURIComponent(event)}`,
    });
    if (response?.message !== `Event ${event} fired.`) {
      logger.debug({ name: fetchEntityHistory, response }, `unexpected response from firing event`);
    }
  }

  async function getAllEntities(): Promise<ENTITY_STATE<ANY_ENTITY>[]> {
    logger.trace({ name: getAllEntities }, `send`);
    return await hass.fetch.fetch<ENTITY_STATE<ANY_ENTITY>[]>({
      url: `/api/states`,
    });
  }

  async function getConfig(): Promise<HassConfig> {
    logger.trace({ name: getConfig }, `send`);
    return await hass.fetch.fetch({ url: `/api/config` });
  }

  async function getLogs(): Promise<HomeAssistantServerLogItem[]> {
    logger.trace({ name: getLogs }, `send`);
    const results = await hass.fetch.fetch<HomeAssistantServerLogItem[]>({
      url: `/api/error/all`,
    });
    return results.map(i => {
      i.timestamp = Math.floor(i.timestamp * SECOND);
      i.first_occurred = Math.floor(i.first_occurred * SECOND);
      return i;
    });
  }

  async function getRawLogs(): Promise<string> {
    logger.trace({ name: getRawLogs }, `send`);
    return await hass.fetch.fetch<string>({
      process: "text",
      url: `/api/error_log`,
    });
  }

  async function listServices(): Promise<HassServiceDTO[]> {
    logger.trace({ name: listServices }, `send`);
    return await hass.fetch.fetch<HassServiceDTO[]>({ url: `/api/services` });
  }

  async function updateEntity<
    STATE extends string | number = string,
    ATTRIBUTES extends object = object,
  >(entity_id: ANY_ENTITY, { attributes, state }: SendBody<STATE, ATTRIBUTES>): Promise<void> {
    const body: SendBody<STATE> = {};
    // ! ORDER MATTERS FOR APPLYING
    // Must be applied in alphabetical order for unit test reasons
    if (!is.empty(attributes)) {
      body.attributes = attributes;
    }
    if (state !== undefined) {
      body.state = state;
    }
    logger.trace({ ...body, entity_id, name: updateEntity }, `set entity state`);
    await hass.fetch.fetch({
      body,
      method: "post",
      url: `/api/states/${encodeURIComponent(entity_id)}`,
    });
  }

  async function webhook(webhook_name: string, data: object = {}): Promise<void> {
    logger.trace({ data, name: webhook, webhook_name }, `send`);
    await hass.fetch.fetch({
      body: data,
      method: "post",
      process: "text",
      url: `/api/webhook/${encodeURIComponent(webhook_name)}`,
    });
  }

  async function checkCredentials(): Promise<{ message: string } | string> {
    logger.trace({ name: checkCredentials }, `send`);
    return await hass.fetch.fetch({
      url: `/api/`,
    });
  }

  async function fetch<T, BODY extends TFetchBody = undefined>(
    options: Partial<FetchArguments<BODY>>,
  ) {
    const ms = perf();
    const out = await fetcher.exec<T, BODY>(options);
    hass.diagnostics.fetch?.fetch.publish({ ms: ms(), options, out });
    return out;
  }

  return {
    _fetcher: fetcher,
    calendarSearch,
    callService,
    checkConfig,
    checkCredentials,
    download,
    fetch,
    fetchEntityCustomizations,
    fetchEntityHistory,
    fireEvent,
    getAllEntities,
    getConfig,
    getLogs,
    getRawLogs,
    listServices,
    updateEntity,
    webhook,
  };
}
