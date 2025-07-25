import { debounce, TServiceParams } from "@digital-alchemy/core";

import {
  DEVICE_REGISTRY_UPDATED,
  DeviceDetails,
  EARLY_ON_READY,
  HassDeviceService,
  perf,
} from "../helpers/index.mts";

export function Device({
  hass,
  config,
  context,
  logger,
  lifecycle,
  event,
}: TServiceParams): HassDeviceService {
  hass.socket.onConnect(async () => {
    let loading = new Promise<void>(async done => {
      hass.device.current = await hass.device.list();
      loading = undefined;
      done();
    });
    lifecycle.onReady(async () => loading && (await loading), EARLY_ON_READY);
    await subscribeUpdates();

    hass.socket.subscribe({
      context,
      event_type: "device_registry_updated",
      async exec() {
        const ms = perf();
        await debounce(DEVICE_REGISTRY_UPDATED, config.hass.EVENT_DEBOUNCE_MS);
        hass.device.current = await hass.device.list();
        logger.debug(`device registry updated`);
        event.emit(DEVICE_REGISTRY_UPDATED);
        hass.diagnostics.device?.registry_update.publish({ ms: ms() });
      },
    });
  });

  async function subscribeUpdates() {
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
