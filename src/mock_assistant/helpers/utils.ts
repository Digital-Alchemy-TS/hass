import {
  ApplicationDefinition,
  BootstrapOptions,
  CreateApplication,
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

export const CreateTestRunner =
  <S extends ServiceMap, C extends OptionalModuleConfiguration>(
    UNIT_TESTING_APP: ApplicationDefinition<S, C>,
  ) =>
  async (Setup: ServiceFunction, Test: ServiceFunction) =>
    await UNIT_TESTING_APP.bootstrap({
      appendLibrary: LIB_MOCK_ASSISTANT,
      appendService: {
        setup: Setup,
        test: function (params: TServiceParams) {
          // tests require ready state
          // cut down on the repetition inside the unit tests
          params.lifecycle.onReady(async () => await Test(params));
        },
      },
      configuration: {
        boilerplate: { LOG_LEVEL: "error" },
        hass: { MOCK_SOCKET: true },
      },
    });
