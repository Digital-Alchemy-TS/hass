import { TServiceParams } from "@digital-alchemy/core";

export function Device({ hass }: TServiceParams) {
  return {
    async list() {
      await hass.socket.sendMessage({
        type: "config/device_registry/list",
      });
    },
  };
}
