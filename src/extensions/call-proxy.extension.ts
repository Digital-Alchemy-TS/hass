import {
  INCREMENT,
  InternalError,
  is,
  noop,
  SECOND,
  sleep,
  START,
  TServiceParams,
} from "@digital-alchemy/core";
import { exit } from "process";

import {
  ALL_DOMAINS,
  HASSIO_WS_COMMAND,
  HassServiceDTO,
  iCallService,
  PICK_SERVICE,
  PICK_SERVICE_PARAMETERS,
} from "..";

const FAILED_LOAD_DELAY = 5;
const MAX_ATTEMPTS = 50;
const FAILED = 1;
const NOT_A_DOMAIN = new Set(["then"]);

export function CallProxy({
  logger,
  lifecycle,
  context,
  hass,
  config,
}: TServiceParams) {
  let domains: string[];
  let services: HassServiceDTO[];
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
  });

  function getDomain(domain: ALL_DOMAINS) {
    if (!domains || !domains?.includes(domain)) {
      if (!NOT_A_DOMAIN.has(domain)) {
        logger.error({ domain, name: getDomain }, `unknown domain`);
      }
      return undefined;
    }
    const domainItem: HassServiceDTO = services.find(i => i.domain === domain);
    if (!domainItem) {
      throw new InternalError(
        context,
        "HALLUCINATED_DOMAIN",
        `Cannot access call_service#${domain}. Home Assistant doesn't list it as a real domain.`,
      );
    }
    return Object.fromEntries(
      Object.entries(domainItem.services).map(([key]) => [
        key,
        async <SERVICE extends PICK_SERVICE>(parameters: object) =>
          await sendMessage(
            `${domain}.${key}` as SERVICE,
            {
              ...parameters,
            } as PICK_SERVICE_PARAMETERS<SERVICE>,
          ),
      ]),
    );
  }

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
    domains = services.map(i => i.domain);
    services.forEach(value => {
      const services = Object.keys(value.services);
      rawProxy[value.domain] = Object.fromEntries(services.map(i => [i, noop]));
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
  async function sendMessage<SERVICE extends PICK_SERVICE>(
    serviceName: SERVICE,
    service_data: PICK_SERVICE_PARAMETERS<SERVICE>,
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
    const type = HASSIO_WS_COMMAND.call_service;
    // User can just not await this call if they don't care about the "waitForChange"

    return await hass.socket.sendMessage(
      { domain, service, service_data, type },
      true,
    );
  }

  function buildCallProxy(): iCallService {
    return new Proxy(rawProxy as iCallService, {
      get: (_, domain: ALL_DOMAINS) => getDomain(domain),
    });
  }

  return buildCallProxy();
}
