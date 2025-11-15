import type { TServiceParams } from "@digital-alchemy/core";

import type { AddonDetails, HassAddonService } from "../index.mts";

export function AddonService({ hass, logger }: TServiceParams): HassAddonService {
  async function list() {
    logger.trace({ name: "list" }, "fetching addon list");
    return await hass.socket.sendMessage<AddonDetails[]>({
      endpoint: "/addons",
      method: "get",
      type: "supervisor/api",
    });
  }

  return {
    list,
  };
}
