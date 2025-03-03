import { TServiceParams } from "@digital-alchemy/core";

import { ALL_SERVICE_DOMAINS, PICK_SERVICE, PICK_SERVICE_PARAMETERS } from "../helpers/index.mts";
import { iCallService } from "../user.mts";

export function CallProxy({
  logger,
  lifecycle,
  internal,
  hass,
  config,
}: TServiceParams): iCallService {
  const { is } = internal.utils;
  let loaded = false;
  const rawProxy = {} as Record<string, Record<string, unknown>>;
  /**
   * Describe the current services, and build up a proxy api based on that.
   *
   * This API matches the api at the time the this function is run, which may be different from any generated typescript definitions from the past.
   */
  lifecycle.onBootstrap(async () => {
    logger.debug({ name: "onBootstrap" }, `runtime populate service interfaces`);
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
          async <SERVICE extends PICK_SERVICE<ALL_SERVICE_DOMAINS>>(parameters: object) => {
            const data = value.services[key];

            const service = `${value.domain}.${key}` as SERVICE;
            return await sendMessage(
              service,
              {
                ...parameters,
              } as PICK_SERVICE_PARAMETERS<ALL_SERVICE_DOMAINS, SERVICE>,
              is.boolean(data?.response?.optional),
            );
          },
        ]),
      );
      logger.trace({ name: loadServiceList, services }, `loaded domain [%s]`, value.domain);
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
    return_response: boolean,
  ) {
    // pause for rest also
    if (hass.socket.pauseMessages) {
      return undefined;
    }
    const [domain, service] = serviceName.split(".");
    // User can just not await this call if they don't care about the "waitForChange"

    if (!return_response) {
      return await hass.socket.sendMessage(
        { domain, service, service_data, type: "call_service" },
        true,
      );
    }
    const result = (await hass.socket.sendMessage(
      { domain, return_response, service, service_data, type: "call_service" },
      true,
    )) as { response: unknown };
    if (!result?.response) {
      logger.warn({ result }, `{%s}.{%s} did not return a response`, domain, service);
    }
    return result?.response;
  }

  function buildCallProxy(): iCallService {
    return new Proxy(rawProxy as unknown as iCallService, {
      get: (_, domain: ALL_SERVICE_DOMAINS) => {
        // oddities in the way proxies work
        // this situation isn't testable afaik
        if (!internal.boot.constructComplete.has("hass")) {
          return undefined;
        }
        if (!loaded) {
          lifecycle.onReady(() => {
            if (config.boilerplate.LOG_LEVEL !== "trace") {
              return;
            }
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
        // lol, no
        return false;
      },
    });
  }

  return buildCallProxy();
}
