import { TServiceParams } from "@digital-alchemy/core";

import { DeviceDetails } from "../helpers";

export function Device({ hass, config, context, logger }: TServiceParams) {
  hass.socket.onConnect(async () => {
    if (!config.hass.AUTO_CONNECT_SOCKET || !config.hass.MANAGE_REGISTRY) {
      return;
    }
    hass.device.current = await hass.device.list();
    hass.socket.subscribe({
      context,
      event_type: "device_registry_updated",
      async exec() {
        hass.device.current = await hass.device.list();
        logger.debug(`device registry updated`);
      },
    });
    await SubscribeUpdates();
  });

  async function SubscribeUpdates() {
    await hass.socket.sendMessage({
      event_type: "device_registry_updated",
      type: "subscribe_events",
    });
  }

  async function list() {
    return await hass.socket.sendMessage<DeviceDetails[]>({
      type: "config/device_registry/list",
    });
  }

  return {
    current: [] as DeviceDetails[],
    list,
  };
}
