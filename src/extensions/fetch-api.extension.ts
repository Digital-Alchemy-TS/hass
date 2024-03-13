import {
  DOWN,
  FilteredFetchArguments,
  is,
  NO_CHANGE,
  SECOND,
  TFetchBody,
  TServiceParams,
  UP,
} from "@digital-alchemy/core";
import dayjs from "dayjs";

import {
  CalendarEvent,
  CalendarFetchOptions,
  CheckConfigResult,
  ENTITY_STATE,
  HassConfig,
  HassServiceDTO,
  HomeAssistantServerLogItem,
  PICK_ENTITY,
  PICK_SERVICE,
  PICK_SERVICE_PARAMETERS,
  PostConfigPriorities,
  RawCalendarEvent,
} from "..";

type SendBody<
  STATE extends string | number = string,
  ATTRIBUTES extends object = object,
> = {
  attributes?: ATTRIBUTES;
  state?: STATE;
};

export function FetchAPI({
  logger,
  lifecycle,
  context,
  internal,
  config,
}: TServiceParams) {
  const fetcher = internal.createFetcher({ context });
  const { fetch, download: downloader } = fetcher;

  // Load configurations
  lifecycle.onPostConfig(() => {
    fetcher.setBaseUrl(config.hass.BASE_URL);
    fetcher.setHeaders({ Authorization: `Bearer ${config.hass.TOKEN}` });
  }, PostConfigPriorities.FETCH);

  async function calendarSearch({
    calendar,
    start = dayjs(),
    end,
  }: CalendarFetchOptions): Promise<CalendarEvent[]> {
    if (Array.isArray(calendar)) {
      const list = await Promise.all(
        calendar.map(
          async cal => await calendarSearch({ calendar: cal, end, start }),
        ),
      );
      return list
        .flat()
        .sort((a, b) =>
          a.start.isSame(b.start)
            ? NO_CHANGE
            : a.start.isAfter(b.start)
              ? UP
              : DOWN,
        );
    }

    const params = { end: end.toISOString(), start: start.toISOString() };
    const events = await fetch<RawCalendarEvent[]>({
      params,
      url: `/api/calendars/${calendar}`,
    });
    logger.trace(
      { ...params },
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

  async function callService<SERVICE extends PICK_SERVICE>(
    serviceName: SERVICE,
    data: PICK_SERVICE_PARAMETERS<SERVICE>,
  ): Promise<ENTITY_STATE<PICK_ENTITY>[]> {
    const [domain, service] = serviceName.split(".");
    return await fetch({
      body: data as TFetchBody,
      method: "post",
      url: `/api/services/${domain}/${service}`,
    });
  }

  async function checkConfig(): Promise<CheckConfigResult> {
    logger.trace(`check config`);
    return await fetch({
      method: `post`,
      url: `/api/config/core/check_config`,
    });
  }

  async function download(
    destination: string,
    fetchWith: FilteredFetchArguments,
  ): Promise<void> {
    await downloader({
      ...fetchWith,
      baseUrl: config.hass.BASE_URL,
      destination,
      headers: { Authorization: `Bearer ${config.hass.TOKEN}` },
    });
  }

  async function fetchEntityCustomizations<
    T extends Record<never, unknown> = Record<
      "global" | "local",
      Record<string, string>
    >,
  >(entityId: string | string[]): Promise<T> {
    return await fetch<T>({
      url: `/api/config/customize/config/${entityId}`,
    });
  }

  async function fetchEntityHistory<
    ENTITY extends PICK_ENTITY = PICK_ENTITY,
    T extends ENTITY_STATE<ENTITY> = ENTITY_STATE<ENTITY>,
  >(
    entity_id: ENTITY,
    from: Date,
    to: Date,
    extra: { minimal_response?: "" } = {},
  ): Promise<T[]> {
    logger.info(
      { entity_id, from: from.toISOString(), to: to.toISOString() },
      `fetch entity history`,
    );
    const result = await fetch<[T[]]>({
      params: {
        end_time: to.toISOString(),
        filter_entity_id: entity_id,
        ...extra,
      },
      url: `/api/history/period/${from.toISOString()}`,
    });
    if (!Array.isArray(result)) {
      logger.error({ result }, `unexpected return result`);
      return [];
    }
    const [out] = result;
    return out;
  }

  async function fireEvent<DATA extends TFetchBody = object>(
    event: string,
    data?: DATA,
  ): Promise<void> {
    logger.trace({ name: event, ...data }, `Firing event`);
    const response = await fetch<{ message: string }>({
      // body: data,
      body: {},
      method: "post",
      url: `/api/events/${event}`,
    });
    if (response?.message !== `Event ${event} fired.`) {
      logger.debug({ response }, `unexpected response from firing event`);
    }
  }

  async function getAllEntities(): Promise<ENTITY_STATE<PICK_ENTITY>[]> {
    logger.trace(`get all entities`);
    return await fetch<ENTITY_STATE<PICK_ENTITY>[]>({ url: `/api/states` });
  }

  async function getHassConfig(): Promise<HassConfig> {
    logger.trace(`get config`);
    return await fetch({ url: `/api/config` });
  }

  async function getLogs(): Promise<HomeAssistantServerLogItem[]> {
    logger.trace(`get logs`);
    const results = await fetch<HomeAssistantServerLogItem[]>({
      url: `/api/error/all`,
    });
    return results.map(i => {
      i.timestamp = Math.floor(i.timestamp * SECOND);
      i.first_occurred = Math.floor(i.first_occurred * SECOND);
      return i;
    });
  }

  async function getRawLogs(): Promise<string> {
    logger.trace(`get raw logs`);
    return await fetch<string>({ process: "text", url: `/api/error_log` });
  }

  async function listServices(): Promise<HassServiceDTO[]> {
    logger.trace(`list services`);
    return await fetch<HassServiceDTO[]>({ url: `/api/services` });
  }

  async function updateEntity<
    STATE extends string | number = string,
    ATTRIBUTES extends object = object,
  >(
    entity_id: PICK_ENTITY,
    { attributes, state }: SendBody<STATE, ATTRIBUTES>,
  ): Promise<void> {
    const body: SendBody<STATE> = {};
    if (state !== undefined) {
      body.state = state;
    }
    if (!is.empty(attributes)) {
      body.attributes = attributes;
    }
    logger.trace({ ...body, name: entity_id }, `set entity state`);
    await fetch({ body, method: "post", url: `/api/states/${entity_id}` });
  }

  async function webhook(name: string, data: object = {}): Promise<void> {
    logger.trace({ ...data, name }, `webhook`);
    await fetch({
      body: data,
      method: "post",
      process: "text",
      url: `/api/webhook/${name}`,
    });
  }

  async function checkCredentials(): Promise<{ message: string } | string> {
    logger.trace(`check credentials`);
    return await fetch({
      url: `/api/`,
    });
  }

  return {
    calendarSearch,
    callService,
    checkConfig,
    checkCredentials,
    download,
    fetch: fetch,
    fetchEntityCustomizations,
    fetchEntityHistory,
    fireEvent,
    getAllEntities,
    getConfig: getHassConfig,
    getLogs,
    getRawLogs,
    listServices,
    updateEntity,
    webhook,
  };
}
