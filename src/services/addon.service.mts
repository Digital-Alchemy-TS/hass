import type { TServiceParams } from "@digital-alchemy/core";

export interface AddonDetails {
  name: string;
  slug: string;
  description: string;
  advanced: boolean;
  stage: string;
  version: string;
  version_latest: string;
  update_available: boolean;
  available: boolean;
  detached: boolean;
  homeassistant: string;
  state: "started" | "stopped" | "error";
  repository: string;
  build: boolean;
  url: string;
  icon: boolean;
  logo: boolean;
  system_managed: boolean;
}

export function AddonService({ hass, logger }: TServiceParams) {
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
