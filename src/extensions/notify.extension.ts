import { FIRST, TServiceParams } from "@digital-alchemy/core";

import {
  ActionableNotification,
  ActionableNotifications,
  AndroidActionableNotification,
  AppleActionableNotification,
  DeviceExtractor,
} from "../helpers";

export function NotifyExtension({ hass }: TServiceParams) {
  type AvailableDevices = DeviceExtractor<typeof hass.call>;
  async function android<DEVICE extends AvailableDevices>(
    device: DEVICE,
    params: Parameters<(typeof hass.call.notify)[DEVICE]>[typeof FIRST] & {
      data: ActionableNotification & AndroidActionableNotification;
    },
  ) {
    await hass.call.notify[device](params);
  }
  async function apple<DEVICE extends AvailableDevices>(
    device: DEVICE,
    params: Parameters<(typeof hass.call.notify)[DEVICE]>[typeof FIRST] & {
      data: ActionableNotification & AppleActionableNotification;
    },
  ) {
    await hass.call.notify[device](params);
  }
  // ! DO NOT REMOVE CAST !
  // Typescript will "optimize" this definition and break everything downstream
  return { android, apple } as ActionableNotifications;
}
