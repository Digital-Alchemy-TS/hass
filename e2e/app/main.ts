import { CreateApplication } from "@digital-alchemy/core";
import { LIB_SYNAPSE } from "@digital-alchemy/synapse";

import { LIB_HASS } from "../..";
import { Entities } from "./entities";

const HASS_E2E = CreateApplication({
  libraries: [LIB_SYNAPSE, LIB_HASS],
  name: "hass_e2e",
  services: {
    entities: Entities,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    hass_e2e: typeof HASS_E2E;
  }
}

setImmediate(async () => await HASS_E2E.bootstrap());
