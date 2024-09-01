/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  asyncNoop,
  INCREMENT,
  is,
  SECOND,
  sleep,
  START,
  TServiceParams,
} from "@digital-alchemy/core";
import { env, exit } from "process";

import {
  ALL_SERVICE_DOMAINS,
  HassServiceDTO,
  iCallService,
  PostConfigPriorities,
} from "..";

const MAX_ATTEMPTS = 50;
const FAILED = 1;

export const SERVICE_LIST_UPDATED = "SERVICE_LIST_UPDATED";

export function Configure({
  logger,
  lifecycle,
  event,
  hass,
  config,
  internal,
}: TServiceParams) {
  lifecycle.onPreInit(() => {
    // HASSIO_TOKEN provided by home assistant to addons
    // SUPERVISOR_TOKEN used as alias elsewhere
    const token = env.HASSIO_TOKEN || env.SUPERVISOR_TOKEN;
    if (is.empty(token)) {
      return;
    }
    logger.debug(
      { name: "onPreInit" },
      `auto configuring from addon environment`,
    );
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
        exit(1);
      }
      // * bad token
      logger.error({ name: "onPostConfig" }, String(result));
      exit(0);
    } catch (error) {
      // * bad BASE_URL
      logger.error({ error, name: "onPostConfig" }, "failed to send request");
      exit(0);
    }
  }, PostConfigPriorities.VALIDATE);

  let services: HassServiceDTO[];
  async function loadServiceList(recursion = START): Promise<void> {
    logger.debug({ name: loadServiceList }, `fetching service list`);
    services = await hass.fetch.listServices();
    if (is.empty(services)) {
      if (recursion > MAX_ATTEMPTS) {
        logger.fatal(
          { name: loadServiceList },
          `failed to load service list from Home Assistant`,
        );
        exit(FAILED);
      }
      logger.warn(
        { name: loadServiceList },
        "failed to retrieve {service} list. Retrying {%s}/[%s]",
        recursion,
        MAX_ATTEMPTS,
      );
      await sleep(config.hass.RETRY_INTERVAL * SECOND);
      await loadServiceList(recursion + INCREMENT);
    } else {
      event.emit(SERVICE_LIST_UPDATED, services);
      checkedServices = new Map();
    }
  }
  let checkedServices = new Map<string, boolean>();

  return {
    getServices: () => services,
    isService: <DOMAIN extends ALL_SERVICE_DOMAINS>(
      domain: DOMAIN,
      service: string,
    ): service is Extract<keyof iCallService[DOMAIN], string> => {
      if (checkedServices.has(service)) {
        return checkedServices.get(service);
      }
      const exists = services.some(
        i => i.domain === domain && !is.undefined(i.services[service]),
      );
      checkedServices.set(service, exists);
      return exists;
    },
    loadServiceList,
  };
}
