import { TServiceParams } from "@digital-alchemy/core";

import { ManifestItem, ZoneDetails, ZoneOptions } from "../helpers";

export function Zone({ hass }: TServiceParams) {
  async function ZoneCreate(options: ZoneOptions) {
    await hass.socket.sendMessage<ManifestItem[]>({
      ...options,
      type: "zone/create",
    });
  }

  async function ZoneUpdate(zone_id: string, options: ZoneOptions) {
    await hass.socket.sendMessage<ManifestItem[]>({
      ...options,
      type: "zone/create",
      zone_id,
    });
  }

  async function ZoneList() {
    await hass.socket.sendMessage<ZoneDetails[]>({
      type: "manifest/list",
    });
  }
  return {
    create: ZoneCreate,
    list: ZoneList,
    update: ZoneUpdate,
  };
}
