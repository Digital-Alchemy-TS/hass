import {
  BootstrapOptions,
  CreateApplication,
  PartialConfiguration,
  ServiceMap,
} from "@digital-alchemy/core";

import { LIB_HASS } from "../../hass.module";
import { LIB_MOCK_ASSISTANT } from "../mock-assistant.module";

export const SILENT_BOOT = (
  configuration: PartialConfiguration = {},
  fixtures = false,
): BootstrapOptions => ({
  appendLibrary: fixtures ? LIB_MOCK_ASSISTANT : undefined,
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
