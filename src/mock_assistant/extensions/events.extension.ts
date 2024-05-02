import { TServiceParams } from "@digital-alchemy/core";

import { ENTITY_STATE, EntityUpdateEvent, PICK_ENTITY } from "../../helpers";

export function Events({ mock_assistant, hass }: TServiceParams) {
  let id = 1000;

  async function emitEvent(event: string, data: object) {
    id++;
    await hass.socket.onMessage({
      event: {
        data,
        event_type: event,
      } as EntityUpdateEvent,
      id: id,
      type: "event",
    });
  }

  async function emitEntityUpdate<ENTITY extends PICK_ENTITY>(
    entity: ENTITY,
    new_state: Partial<ENTITY_STATE<ENTITY>>,
  ) {
    const old_state = mock_assistant.fixtures.byId(entity);
    new_state = mock_assistant.fixtures.replace(entity, new_state);
    await emitEvent("state_changed", { new_state, old_state });
  }

  return {
    emitEntityUpdate,
    emitEvent,
  };
}
