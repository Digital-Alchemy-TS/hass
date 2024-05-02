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
    const old_state = byId(entity);
    new_state = replace(entity, new_state);
    await emitEvent("state_changed", { new_state, old_state });
  }

  function replace<ENTITY extends PICK_ENTITY>(
    entity: ENTITY,
    new_state: Partial<ENTITY_STATE<ENTITY>>,
  ): ENTITY_STATE<ENTITY> {
    const old_state = byId(entity);
    mock_assistant.fixtures.data.entities =
      mock_assistant.fixtures.data.entities.filter(i => i.entity_id !== entity);
    const updated = {
      ...old_state,
      ...new_state,
    } as ENTITY_STATE<ENTITY>;
    mock_assistant.fixtures.data.entities.push(updated);
    return updated;
  }

  function byId(entity: PICK_ENTITY) {
    return mock_assistant.fixtures.data.entities.find(
      i => i.entity_id === entity,
    );
  }

  return {
    emitEntityUpdate,
    emitEvent,
  };
}
