import { CreateLibrary, StringConfig } from "@digital-alchemy/core";

import { LIB_HASS } from "../..";
import { MockServer, QuickConfiguration } from ".";

export const LIB_HASS_TESTING = CreateLibrary({
  configuration: {
    CONNECT_MODE: {
      default: "none",
      description: "Update config defaults for hass to not attempt connections",
      enum: ["none", "testing", "remote"],
      type: "string",
    } as StringConfig<"none" | "testing" | "remote">,
  },
  depends: [LIB_HASS],
  name: "hass_testing",
  services: {
    QuickConfiguration,
    mock_server: MockServer,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    hass_testing: typeof LIB_HASS_TESTING;
  }
}
