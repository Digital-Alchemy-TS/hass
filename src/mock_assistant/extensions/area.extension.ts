import { TServiceParams } from "@digital-alchemy/core";

import { TAreaId } from "../../dynamic";
import { AreaDetails } from "../../helpers";

export function MockAreaExtension({ mock_assistant }: TServiceParams) {
  let areas = new Map<TAreaId, AreaDetails>();

  mock_assistant.socket.onMessage("config/area_registry/list", message => {
    mock_assistant.socket.sendMessage({
      id: message.id,
      result: [...areas.values()],
      type: "result",
    });
  });

  mock_assistant.socket.onMessage<{ area_id: TAreaId }>("config/area_registry/delete", message => {
    areas.delete(message.area_id);
    sendUpdate();
    mock_assistant.socket.sendMessage({
      id: message.id,
      result: null,
      type: "result",
    });
  });

  mock_assistant.socket.onMessage<AreaDetails>("config/area_registry/create", message => {
    message.area_id = message.name as TAreaId;
    areas.set(message.area_id as TAreaId, message);
    sendUpdate();
    mock_assistant.socket.sendMessage({
      id: message.id,
      result: null,
      type: "result",
    });
  });

  mock_assistant.socket.onMessage<AreaDetails>("config/area_registry/update", message => {
    areas.set(message.area_id as TAreaId, message);
    sendUpdate();
    mock_assistant.socket.sendMessage({
      id: message.id,
      result: null,
      type: "result",
    });
  });

  const sendUpdate = () =>
    mock_assistant.socket.sendMessage({
      event: { event_type: "area_registry_updated" },
      type: "event",
    });

  return {
    set(incoming: AreaDetails[]) {
      areas = new Map(incoming.map(i => [i.area_id, i]));
    },
  };
}
