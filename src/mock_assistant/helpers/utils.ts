import {
  ApplicationDefinition,
  BootstrapOptions,
  CreateApplication,
  is,
  OptionalModuleConfiguration,
  PartialConfiguration,
  ServiceFunction,
  ServiceMap,
  TServiceParams,
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

export const CreateTestRunner = <
  S extends ServiceMap,
  C extends OptionalModuleConfiguration,
>(
  UNIT_TESTING_APP: ApplicationDefinition<S, C>,
) => {
  // setup runs at construction
  // test runs at ready
  return async function (setup: ServiceFunction, Test: ServiceFunction) {
    function test(params: TServiceParams) {
      params.lifecycle.onReady(async () => await Test(params));
    }
    return await UNIT_TESTING_APP.bootstrap({
      appendLibrary: LIB_MOCK_ASSISTANT,
      appendService: is.function(setup) ? { setup, test } : { test },
      configuration: {
        boilerplate: { LOG_LEVEL: "error" },
        hass: { MOCK_SOCKET: true },
      },
    });
  };
};
