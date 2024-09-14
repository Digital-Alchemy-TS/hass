import { TServiceParams } from "@digital-alchemy/core";

import { TZoneId } from "../../dynamic";
import { ZoneDetails } from "../../helpers";

export function MockZoneExtension({ mock_assistant, hass }: TServiceParams) {
  let zones = new Map<TZoneId, ZoneDetails>();

  hass.zone.list = async () => [...zones.values()];

  return {
    set(incoming: ZoneDetails[]) {
      zones = new Map(incoming.map(i => [i.id, i]));
    },
  };
}
