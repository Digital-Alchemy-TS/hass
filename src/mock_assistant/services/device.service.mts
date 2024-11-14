import { TServiceParams } from "@digital-alchemy/core";

import { TDeviceId } from "../../dynamic.mts";
import { DEVICE_REGISTRY_UPDATED, DeviceDetails } from "../../helpers/index.mts";

export function MockDeviceExtension({ mock_assistant }: TServiceParams) {
  let devices = new Map<TDeviceId, DeviceDetails>();

  mock_assistant.socket.onMessage("config/device_registry/list", message => {
    mock_assistant.socket.sendMessage({
      id: message.id,
      result: [...devices.values()],
      type: "result",
    });
  });

  mock_assistant.socket.onMessage<{ device_id: TDeviceId }>(
    "config/device_registry/delete",
    message => {
      devices.delete(message.device_id);
      sendUpdate();
      mock_assistant.socket.sendMessage({
        id: message.id,
        result: null,
        type: "result",
      });
    },
  );

  const sendUpdate = () =>
    mock_assistant.socket.sendMessage({
      event: { event_type: DEVICE_REGISTRY_UPDATED },
      type: "event",
    });

  return {
    /**
     * @internal
     */
    loadFixtures(incoming: DeviceDetails[]) {
      devices = new Map(incoming.map(i => [i.id, i]));
    },
  };
}
