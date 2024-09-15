import { TServiceParams } from "@digital-alchemy/core";

import { TFloorId } from "../../dynamic";
import { FloorDetails } from "../../helpers";

export function MockFloorExtension({ mock_assistant }: TServiceParams) {
  let floors = new Map<TFloorId, FloorDetails>();

  mock_assistant.socket.onMessage("config/floor_registry/list", message => {
    mock_assistant.socket.sendMessage({
      id: message.id,
      result: [...floors.values()],
      type: "result",
    });
  });

  mock_assistant.socket.onMessage<{ floor_id: TFloorId }>(
    "config/floor_registry/delete",
    message => {
      floors.delete(message.floor_id);
      sendUpdate();
      mock_assistant.socket.sendMessage({
        id: message.id,
        result: null,
        type: "result",
      });
    },
  );

  mock_assistant.socket.onMessage<FloorDetails>("config/floor_registry/create", message => {
    message.floor_id = message.name as TFloorId;
    floors.set(message.floor_id as TFloorId, message);
    sendUpdate();
    mock_assistant.socket.sendMessage({
      id: message.id,
      result: null,
      type: "result",
    });
  });
  mock_assistant.socket.onMessage<FloorDetails>("config/floor_registry/update", message => {
    floors.set(message.floor_id as TFloorId, message);
    sendUpdate();
    mock_assistant.socket.sendMessage({
      id: message.id,
      result: null,
      type: "result",
    });
  });

  const sendUpdate = () =>
    mock_assistant.socket.sendMessage({
      event: { event_type: "floor_registry_updated" },
      type: "event",
    });

  return {
    set(incoming: FloorDetails[]) {
      floors = new Map(incoming.map(i => [i.floor_id, i]));
    },
  };
}
