import { TServiceParams } from "@digital-alchemy/core";

import { TAreaId } from "../../dynamic";
import { AreaDetails } from "../../helpers";

export function MockAreaExtension({ mock_assistant, hass }: TServiceParams) {
  let areas = new Map<TAreaId, AreaDetails>();

  hass.area.list = async () => [...areas.values()];

  return {
    set(incoming: AreaDetails[]) {
      areas = new Map(incoming.map(i => [i.area_id, i]));
    },
  };
}
