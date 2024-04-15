import { TServiceParams } from "@digital-alchemy/core";

import {
  HassConfig,
  ManifestItem,
  UpdateCoreOptions,
  ZoneDetails,
} from "../helpers";

export function Registry({ hass }: TServiceParams) {
  async function ManifestList() {
    return await hass.socket.sendMessage<ManifestItem[]>({
      type: "manifest/list",
    });
  }

  async function UpdateCore(options: UpdateCoreOptions) {
    await hass.socket.sendMessage<ZoneDetails[]>({
      ...options,
      type: "config/core/update",
    });
  }

  async function GetConfig() {
    return await hass.socket.sendMessage<HassConfig>({
      type: "get_config",
    });
  }

  return {
    getConfig: GetConfig,
    manifestList: ManifestList,
    updateCore: UpdateCore,
  };
}
