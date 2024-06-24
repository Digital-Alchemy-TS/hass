import { TServiceParams } from "@digital-alchemy/core";

import {
  DEVICE_REGISTRY_UPDATED,
  DeviceDetails,
  EARLY_ON_READY,
} from "../helpers";

export function Device({
  hass,
  config,
  context,
  logger,
  lifecycle,
  event,
}: TServiceParams) {
  hass.socket.onConnect(async () => {
    if (!config.hass.AUTO_CONNECT_SOCKET || !config.hass.MANAGE_REGISTRY) {
      return;
    }
    let loading = new Promise<void>(async done => {
      hass.device.current = await hass.device.list();
      loading = undefined;
      done();
    });
    lifecycle.onReady(async () => loading && (await loading), EARLY_ON_READY);
    await SubscribeUpdates();
  });

  hass.socket.subscribe({
    context,
    event_type: "device_registry_updated",
    async exec() {
      hass.device.current = await hass.device.list();
      logger.debug(`device registry updated`);
      event.emit(DEVICE_REGISTRY_UPDATED);
    },
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
