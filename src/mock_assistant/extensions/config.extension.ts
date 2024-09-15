import { TServiceParams } from "@digital-alchemy/core";

import { HassConfig } from "../../helpers";

export function MockConfig({ hass }: TServiceParams) {
  let config: HassConfig;
  hass.fetch.getConfig = async () => config || ({ version: "2024.4.1" } as HassConfig);

  return {
    set(incoming: HassConfig) {
      config = incoming;
    },
  };
}
