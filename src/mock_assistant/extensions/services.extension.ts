import { TServiceParams } from "@digital-alchemy/core";

import { HassServiceDTO } from "../../helpers";

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
