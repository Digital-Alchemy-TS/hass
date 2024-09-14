import { TServiceParams } from "@digital-alchemy/core";

import { TFloorId } from "../../dynamic";
import { FloorDetails } from "../../helpers";

export function MockFloorExtension({ mock_assistant, hass }: TServiceParams) {
  let floors = new Map<TFloorId, FloorDetails>();

  hass.floor.list = async () => [...floors.values()];

  return {
    set(incoming: FloorDetails[]) {
      floors = new Map(incoming.map(i => [i.floor_id, i]));
    },
  };
}
