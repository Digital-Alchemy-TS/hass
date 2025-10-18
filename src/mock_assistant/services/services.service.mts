import type { TServiceParams } from "@digital-alchemy/core";

import type { HassServiceDTO } from "../../helpers/index.mts";

export function MockServices({ hass }: TServiceParams) {
  let services: HassServiceDTO[];

  const origList = hass.fetch.listServices;
  hass.fetch.listServices = async () => services;

  return {
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
  };
}
