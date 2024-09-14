import { TServiceParams } from "@digital-alchemy/core";

import { TDeviceId } from "../../dynamic";
import { DeviceDetails } from "../../helpers";

export function MockDeviceExtension({ mock_assistant, hass }: TServiceParams) {
  let devices = new Map<TDeviceId, DeviceDetails>();

  hass.device.list = async () => [...devices.values()];

  return {
    set(incoming: DeviceDetails[]) {
      devices = new Map(incoming.map(i => [i.id, i]));
    },
  };
}
