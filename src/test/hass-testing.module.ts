import { CreateLibrary, TServiceParams } from "@digital-alchemy/core";

import { LIB_HASS } from "..";

export const LIB_HASS_TESTING = CreateLibrary({
  configuration: {
    NO_CONNECT: {
      default: true,
      description: "Update config defaults for hass to not attempt connections",
      type: "boolean",
    },
  },
  depends: [LIB_HASS],
  name: "hass_testing",
  services: {
    QuickConfiguration({ config, lifecycle, internal }: TServiceParams) {
      lifecycle.onPreInit(() => {
        if (config.hass_testing.NO_CONNECT) {
          internal.boilerplate.configuration.set(
            "hass",
            "AUTO_CONNECT_SOCKET",
            false,
          );
          internal.boilerplate.configuration.set(
            "hass",
            "AUTO_SCAN_CALL_PROXY",
            false,
          );
        }
      });
    },
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    hass_testing: typeof LIB_HASS_TESTING;
  }
}
