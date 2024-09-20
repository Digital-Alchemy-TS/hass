import { deepExtend, TServiceParams } from "@digital-alchemy/core";

import { HassConfig } from "../../helpers";

export function MockConfig({ hass }: TServiceParams) {
  let config = { components: ["synapse"], version: "2024.4.1" } as HassConfig;

  const origConfig = hass.fetch.getConfig;
  hass.fetch.getConfig = async () => config;

  return {
    current() {
      return config;
    },
    merge(incoming: Partial<HassConfig>) {
      config = deepExtend(config, incoming);
    },
    replace(incoming: HassConfig) {
      if (incoming) {
        config = incoming;
      }
    },
    reset() {
      hass.fetch.getConfig = origConfig;
    },
  };
}