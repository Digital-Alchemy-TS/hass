import type { TServiceParams } from "@digital-alchemy/core";

import type { AddonDetails, HassAddonService } from "../index.mts";

export function AddonService({ hass, logger }: TServiceParams): HassAddonService {
  async function list() {
    logger.trace({ name: "list" }, "fetching addon list");
    const { addons } = await hass.socket.sendMessage<{ addons: AddonDetails[] }>({
      endpoint: "/addons",
      method: "get",
      type: "supervisor/api",
    });
    return addons;
  }

  return {
    list,
  };
}
