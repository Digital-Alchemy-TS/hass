import type { TServiceParams } from "@digital-alchemy/core";

import type { HassServiceDTO } from "../../helpers/index.mts";

type ServiceHandler = (entity_id: string, data: object) => Promise<void> | void;

export function MockServices({ hass }: TServiceParams) {
  let services: HassServiceDTO[];
  const serviceHandlers = new Map<string, ServiceHandler>();

  const origList = hass.fetch.listServices;
  hass.fetch.listServices = async () => services;

  function registerHandler(domain: string, service: string, handler: ServiceHandler) {
    serviceHandlers.set(`${domain}.${service}`, handler);
  }

  function hasHandler(domain: string, service: string): boolean {
    return serviceHandlers.has(`${domain}.${service}`);
  }

  function callHandler(domain: string, service: string, entity_id: string, data: object) {
    const key = `${domain}.${service}`;
    const handler = serviceHandlers.get(key);
    if (handler) {
      return handler(entity_id, data);
    }
  }

  return {
    callHandler,
    hasHandler,

    /**
     * @internal
     */
    loadFixtures(incoming: HassServiceDTO[]) {
      services = incoming;
    },

    /**
     * @internal
     */
    monkeyReset() {
      hass.fetch.listServices = origList;
    },

    registerHandler,
  };
}
