import { TServiceParams } from "@digital-alchemy/core";

import {
  ConfigEntry,
  HassConfig,
  HassRegistryService,
  ManifestItem,
  UpdateCoreOptions,
  ZoneDetails,
} from "../helpers/index.mts";

export function Registry({ hass }: TServiceParams): HassRegistryService {
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

  async function GetConfigEntries() {
    return await hass.socket.sendMessage<ConfigEntry[]>({
      type: "config_entries/get",
    });
  }

  return {
    getConfig: GetConfig,
    getConfigEntries: GetConfigEntries,
    manifestList: ManifestList,
    updateCore: UpdateCore,
  };
}
