import type { TServiceParams } from "@digital-alchemy/core";

import type { ZoneDetails } from "../../helpers/index.mts";
import type { TZoneId } from "../../user.mts";

export function MockZoneExtension({ mock_assistant }: TServiceParams) {
  let zones = new Map<TZoneId, ZoneDetails>();

  mock_assistant.socket.onMessage("config/zone_registry/list", message => {
    mock_assistant.socket.sendMessage({
      id: message.id,
      result: [...zones.values()],
      type: "result",
    });
  });

  mock_assistant.socket.onMessage<{ zone_id: TZoneId }>("config/zone_registry/delete", message => {
    zones.delete(message.zone_id);
    sendUpdate();
    mock_assistant.socket.sendMessage({
      id: message.id,
      result: null,
      type: "result",
    });
  });

  mock_assistant.socket.onMessage<ZoneDetails>(
    "config/zone_registry/create",
    (message: ZoneDetails) => {
      message.id = message.name as TZoneId;
      zones.set(message.id as TZoneId, message);
      sendUpdate();
      mock_assistant.socket.sendMessage({
        id: message.id,
        result: null,
        type: "result",
      });
    },
  );

  mock_assistant.socket.onMessage<ZoneDetails>(
    "config/zone_registry/update",
    (message: ZoneDetails) => {
      zones.set(message.id as TZoneId, message);
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
      event: { event_type: "zone_registry_updated" },
      type: "event",
    });

  return {
    /**
     * @internal
     */
    loadFixtures(incoming: ZoneDetails[]) {
      zones = new Map(incoming.map(i => [i.id, i]));
    },
  };
}
