import { is, TServiceParams } from "@digital-alchemy/core";

import {
  ALL_SERVICE_DOMAINS,
  CALL_PROXY_SERVICE_CALL,
  iCallService,
  PICK_SERVICE,
  PICK_SERVICE_PARAMETERS,
} from "..";

export function CallProxy({
  logger,
  lifecycle,
  internal,
  hass,
  config,
}: TServiceParams) {
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

  async function loadServiceList(): Promise<void> {
    await hass.configure.loadServiceList();
    const services = hass.configure.getServices();
    services.forEach(value => {
      const services = Object.keys(value.services);

      rawProxy[value.domain] = Object.fromEntries(
        Object.entries(value.services).map(([key]) => [
          key,
          async <SERVICE extends PICK_SERVICE<ALL_SERVICE_DOMAINS>>(
            parameters: object,
          ) => {
            const data = value.services[key];
            if (is.boolean(data?.response?.optional)) {
              // https://github.com/Digital-Alchemy-TS/hass/issues/34
              logger.warn(`calling services with responses not supported`);
            }

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
        // oddities in the way proxies work
        // this situation isn't testable afaik
        if (!internal.boot.constructComplete.has("hass")) {
          return undefined;
        }
        if (!loaded) {
          lifecycle.onReady(() => {
            logger.error(
              `attempted to use {hass.call} before data loaded. use {lifecycle.onReady}`,
            );
            // eslint-disable-next-line no-console
            console.trace(`hass.call`);
          });
        }
        return rawProxy[domain];
      },
      has(_, property: string) {
        return property in rawProxy;
      },
      ownKeys() {
        return Object.keys(rawProxy);
      },
      set() {
        return false;
      },
    });
  }

  return buildCallProxy();
}
