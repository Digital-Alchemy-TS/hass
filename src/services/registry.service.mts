import type { TServiceParams } from "@digital-alchemy/core";

import type {
  ConfigEntry,
  HassConfig,
  HassRegistryService,
  ManifestItem,
  UpdateCoreOptions,
  ZoneDetails,
} from "../helpers/index.mts";

export function Registry({ hass }: TServiceParams): HassRegistryService {
  async function manifestList() {
    return await hass.socket.sendMessage<ManifestItem[]>({
      type: "manifest/list",
    });
  }

  async function updateCore(options: UpdateCoreOptions) {
    await hass.socket.sendMessage<ZoneDetails[]>({
      ...options,
      type: "config/core/update",
    });
  }

  async function getConfig() {
    return await hass.socket.sendMessage<HassConfig>({
      type: "get_config",
    });
  }

  async function getConfigEntries() {
    return await hass.socket.sendMessage<ConfigEntry[]>({
      type: "config_entries/get",
    });
  }

  return {
    getConfig,
    getConfigEntries,
    manifestList,
    updateCore,
  };
}
