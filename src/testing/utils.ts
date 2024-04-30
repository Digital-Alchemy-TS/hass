import {
  BootstrapOptions,
  CreateApplication,
  PartialConfiguration,
  ServiceMap,
} from "@digital-alchemy/core";

import { LIB_HASS } from "../hass.module";

export const SILENT_BOOT = (
  configuration: PartialConfiguration = {},
): BootstrapOptions => ({
  configuration,
  // quiet time
  customLogger: {
    debug: () => {},
    error: () => {},
    fatal: () => {},
    info: () => {},
    trace: () => {},
    warn: () => {},
  },
});
export function CreateTestingApplication(services: ServiceMap) {
  return CreateApplication({
    configurationLoaders: [],

    libraries: [LIB_HASS],
    // @ts-expect-error testing
    name: "testing",
    services,
  });
}
