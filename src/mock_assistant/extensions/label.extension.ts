import { TServiceParams } from "@digital-alchemy/core";

import { TLabelId } from "../../dynamic";
import { LabelDefinition } from "../../helpers";

export function MockLabelExtension({ mock_assistant }: TServiceParams) {
  let labels = new Map<TLabelId, LabelDefinition>();

  mock_assistant.socket.onMessage("config/label_registry/list", message => {
    mock_assistant.socket.sendMessage({
      id: message.id,
      result: [...labels.values()],
      type: "result",
    });
  });

  mock_assistant.socket.onMessage<{ label_id: TLabelId }>(
    "config/label_registry/delete",
    message => {
      labels.delete(message.label_id);
      sendUpdate();
      mock_assistant.socket.sendMessage({
        id: message.id,
        result: null,
        type: "result",
      });
    },
  );

  mock_assistant.socket.onMessage<LabelDefinition>("config/label_registry/create", message => {
    message.label_id = message.name as TLabelId;
    labels.set(message.label_id as TLabelId, message);
    sendUpdate();
    mock_assistant.socket.sendMessage({
      id: message.id,
      result: null,
      type: "result",
    });
  });
  mock_assistant.socket.onMessage<LabelDefinition>("config/label_registry/update", message => {
    labels.set(message.label_id as TLabelId, message);
    sendUpdate();
    mock_assistant.socket.sendMessage({
      id: message.id,
      result: null,
      type: "result",
    });
  });

  const sendUpdate = () =>
    mock_assistant.socket.sendMessage({
      event: { event_type: "label_registry_updated" },
      type: "event",
    });

  return {
    /**
     * @internal
     */
    loadFixtures(incoming: LabelDefinition[]) {
      labels = new Map(incoming.map(i => [i.label_id, i]));
    },
  };
}
