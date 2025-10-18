import type { TServiceParams } from "@digital-alchemy/core";
import { sleep } from "@digital-alchemy/core";

import type { ENTITY_STATE, EntityUpdateEvent } from "../../index.mts";
import type { ANY_ENTITY } from "../../user.mts";

const SUPER_SHORT = 1;

export function MockEvents({ mock_assistant, hass }: TServiceParams) {
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

  async function emitEntityUpdate<ENTITY extends ANY_ENTITY>(
    entity: ENTITY,
    new_state: Partial<ENTITY_STATE<ENTITY>>,
  ) {
    const old_state = mock_assistant.fixtures.byId(entity);
    new_state = mock_assistant.fixtures.replace(entity, new_state);
    await emitEvent("state_changed", { new_state, old_state });
    // help ensure all the async flows settle
    await sleep(SUPER_SHORT);
  }

  return {
    emitEntityUpdate,
    emitEvent,
  };
}
