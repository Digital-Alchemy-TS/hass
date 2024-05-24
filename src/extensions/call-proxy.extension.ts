import {
  INCREMENT,
  is,
  SECOND,
  sleep,
  START,
  TServiceParams,
} from "@digital-alchemy/core";
import { exit } from "process";

import {
  ALL_SERVICE_DOMAINS,
  CALL_PROXY_SERVICE_CALL,
  HassServiceDTO,
  iCallService,
  PICK_SERVICE,
  PICK_SERVICE_PARAMETERS,
} from "..";

const FAILED_LOAD_DELAY = 5;
const MAX_ATTEMPTS = 50;
const FAILED = 1;

export function CallProxy({ logger, lifecycle, hass, config }: TServiceParams) {
  let services: HassServiceDTO[];
  let loaded = false;
  const rawProxy = {} as Record<string, Record<string, unknown>>;
  /**
   * Describe the current services, and build up a proxy api based on that.
   *
   * This API matches the api at the time the this function is run, which may be different from any generated typescript definitions from the past.
   */
  lifecycle.onBootstrap(async () => {
    if (!config.hass.AUTO_SCAN_CALL_PROXY) {
      logger.debug({ name: "onBootstrap" }, `skip service populate`);
      return;
    }
    logger.debug(
      { name: "onBootstrap" },
      `runtime populate service interfaces`,
    );
    await loadServiceList();
    loaded = true;
  });

  async function loadServiceList(recursion = START): Promise<void> {
    logger.info({ name: loadServiceList }, `fetching service list`);
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
      await sleep(FAILED_LOAD_DELAY * SECOND);
      await loadServiceList(recursion + INCREMENT);
      return;
    }
    services.forEach(value => {
      const services = Object.keys(value.services);

      rawProxy[value.domain] = Object.fromEntries(
        Object.entries(value.services).map(([key]) => [
          key,
          async <SERVICE extends PICK_SERVICE<ALL_SERVICE_DOMAINS>>(
            parameters: object,
          ) => {
            const service = `${value.domain}.${key}` as SERVICE;
            await sendMessage(service, {
              ...parameters,
            } as PICK_SERVICE_PARAMETERS<ALL_SERVICE_DOMAINS, SERVICE>);
          },
        ]),
      );
      logger.trace(
        { name: loadServiceList, services },
        `loaded domain [%s]`,
        value.domain,
      );
    });
  }

  /**
   * Prefer sending via socket, if available.
   */
  async function sendMessage<
    DOMAIN extends ALL_SERVICE_DOMAINS,
    SERVICE extends PICK_SERVICE<DOMAIN>,
  >(
    serviceName: SERVICE,
    service_data: PICK_SERVICE_PARAMETERS<DOMAIN, SERVICE>,
  ) {
    // pause for rest also
    if (hass.socket.pauseMessages) {
      return undefined;
    }
    const sendViaRest =
      (config.hass.CALL_PROXY_ALLOW_REST === "allow" &&
        hass.socket.connectionState !== "connected") ||
      config.hass.CALL_PROXY_ALLOW_REST === "prefer";
    if (sendViaRest) {
      return await hass.fetch.callService(serviceName, service_data);
    }
    const [domain, service] = serviceName.split(".");
    CALL_PROXY_SERVICE_CALL.labels({ domain, service }).inc();
    // User can just not await this call if they don't care about the "waitForChange"

    return await hass.socket.sendMessage(
      { domain, service, service_data, type: "call_service" },
      true,
    );
  }

  function buildCallProxy(): iCallService {
    return new Proxy(rawProxy as iCallService, {
      get: (_, domain: ALL_SERVICE_DOMAINS) => {
        if (loaded) {
          logger.error(
            `attempted to use {hass.call} before data loaded. use {lifecycle.onReady}`,
          );
        }
        return rawProxy[domain];
      },
    });
  }

  return buildCallProxy();
}
