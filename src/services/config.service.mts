/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { TServiceParams } from "@digital-alchemy/core";
import { asyncNoop, debounce, INCREMENT, SECOND, sleep, START } from "@digital-alchemy/core";
import { env } from "process";

import type {
  ALL_SERVICE_DOMAINS,
  ConfigEntry,
  HassConfigService,
  HassServiceDTO,
} from "../helpers/index.mts";
import { PostConfigPriorities } from "../helpers/index.mts";
import type {
  FindEntryIdByTitle,
  iCallService,
  TConfigEntryId,
  TConfigEntryTitle,
} from "../user.mts";

const MAX_ATTEMPTS = 50;
const FAILED = 1;

export const SERVICE_LIST_UPDATED = "SERVICE_LIST_UPDATED";
export const CONFIG_ENTRIES_UPDATED = "CONFIG_ENTRIES_UPDATED";

export function Configure({
  logger,
  lifecycle,
  event,
  hass,
  config,
  internal,
  context,
}: TServiceParams): HassConfigService {
  const { is } = internal.utils;
  let checkedServices = new Map<string, boolean>();
  let services: HassServiceDTO[];
  let configEntries: ConfigEntry<TConfigEntryId>[] = [];

  lifecycle.onPreInit(() => {
    // HASSIO_TOKEN provided by home assistant to addons
    // SUPERVISOR_TOKEN used as alias elsewhere
    const token = env.HASSIO_TOKEN || env.SUPERVISOR_TOKEN;
    if (is.empty(token)) {
      return;
    }
    logger.debug({ name: "onPreInit" }, `auto configuring from addon environment`);
    internal.boilerplate.configuration.set(
      "hass",
      "BASE_URL",
      // don't go over the network
      env.HASS_SERVER || "http://supervisor/core",
    );
    internal.boilerplate.configuration.set("hass", "TOKEN", token);
  });

  /**
   * Request by someone to validate the provided credentials are valid
   *
   * Send a test request, and provide feedback on what happened
   */
  lifecycle.onPostConfig(async () => {
    if (!config.hass.VALIDATE_CONFIGURATION) {
      return;
    }
    internal.boilerplate.configuration.set("boilerplate", "LOG_LEVEL", "trace");
    await asyncNoop();
    logger.info({ name: "onPostConfig" }, `validating credentials`);
    try {
      const result = await hass.fetch.checkCredentials();
      if (is.object(result)) {
        // * all good
        logger.info({ name: "onPostConfig" }, result.message);
        process.exit(1);
      }
      // * bad token
      logger.error({ name: "onPostConfig" }, String(result));
      process.exit(0);
    } catch (error) {
      // * bad BASE_URL
      logger.error({ error, name: "onPostConfig" }, "failed to send request");
      process.exit(0);
    }
  }, PostConfigPriorities.VALIDATE);

  async function loadServiceList(recursion = START): Promise<void> {
    logger.debug({ name: loadServiceList }, `fetching service list`);
    services = await hass.fetch.listServices();
    if (is.empty(services)) {
      if (recursion > MAX_ATTEMPTS) {
        logger.fatal({ name: loadServiceList }, `failed to load service list from Home Assistant`);
        process.exit(FAILED);
        return;
      }
      logger.warn(
        { name: loadServiceList },
        "failed to retrieve {service} list. Retrying {%s}/[%s]",
        recursion,
        MAX_ATTEMPTS,
      );
      hass.diagnostics.config?.load_services_failure.publish({ recursion });
      await sleep(config.hass.RETRY_INTERVAL * SECOND);
      await loadServiceList(recursion + INCREMENT);
      return;
    }
    event.emit(SERVICE_LIST_UPDATED, services);
    checkedServices = new Map();
    hass.diagnostics.config?.service_list_updated.publish({ recursion });
  }

  function isService<DOMAIN extends ALL_SERVICE_DOMAINS>(
    domain: DOMAIN,
    service: string,
  ): service is Extract<keyof iCallService[DOMAIN], string> {
    const key = [domain, service].join(".");
    if (checkedServices.has(key)) {
      return checkedServices.get(key);
    }
    const exists = services.some(i => i.domain === domain && !is.undefined(i.services[service]));
    checkedServices.set(key, exists);
    return exists;
  }

  function byTitle<TITLE extends TConfigEntryTitle>(
    title: TITLE,
  ): ConfigEntry<FindEntryIdByTitle<TITLE>> {
    logger.trace({ name: byTitle, title }, `looking up config entry by title`);
    const entry = configEntries.find(e => e.title === title);
    return entry as ConfigEntry<FindEntryIdByTitle<TITLE>>;
  }

  async function get(): Promise<ConfigEntry<TConfigEntryId>[]> {
    logger.trace({ name: get }, `fetching config entries`);
    const entries = await hass.socket.sendMessage<ConfigEntry<TConfigEntryId>[]>({
      type: "config_entries/get",
    });
    configEntries = entries;
    event.emit(CONFIG_ENTRIES_UPDATED, entries);
    return entries;
  }

  void hass.socket.subscribe({
    context,
    event_type: "config_entry_updated",
    async exec() {
      await debounce(CONFIG_ENTRIES_UPDATED, config.hass.EVENT_DEBOUNCE_MS);
      await get();
    },
  });

  hass.socket.onConnect(async () => await get());

  return {
    byTitle,
    current: () => configEntries,
    get,
    getServices: () => services,
    isService,
    loadServiceList,
  };
}
