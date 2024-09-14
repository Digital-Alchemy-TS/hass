import { TServiceParams } from "@digital-alchemy/core";

import { TLabelId } from "../../dynamic";
import { LabelDefinition } from "../../helpers";

export function MockLabelExtension({ mock_assistant, hass }: TServiceParams) {
  let labels = new Map<TLabelId, LabelDefinition>();

  hass.label.list = async () => [...labels.values()];

  return {
    set(incoming: LabelDefinition[]) {
      labels = new Map(incoming.map(i => [i.label_id, i]));
    },
  };
}
