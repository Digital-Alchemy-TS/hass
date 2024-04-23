import { CreateLibrary, StringConfig } from "@digital-alchemy/core";

import { LIB_HASS } from "../..";
import {
  MockEntity,
  MockRegistry,
  MockServer,
  QuickConfiguration,
  Reset,
} from ".";

export const LIB_HASS_TESTING = CreateLibrary({
  configuration: {
    CONNECT_MODE: {
      default: "none",
      description: "Update config defaults for hass to not attempt connections",
      enum: ["none", "testing", "remote", "server"],
      type: "string",
    } as StringConfig<"none" | "testing" | "remote" | "server">,
  },
  depends: [LIB_HASS],
  name: "hass_testing",
  services: {
    QuickConfiguration,
    entity: MockEntity,
    mock_server: MockServer,
    registry: MockRegistry,
    reset: Reset,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    hass_testing: typeof LIB_HASS_TESTING;
  }
}
