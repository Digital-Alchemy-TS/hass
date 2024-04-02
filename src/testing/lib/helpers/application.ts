import { CreateApplication, ServiceMap } from "@digital-alchemy/core";

import { LIB_HASS, LIB_HASS_TESTING } from "../../..";

export function CreateTestingApplication(services: ServiceMap) {
  return CreateApplication({
    configurationLoaders: [],

    libraries: [LIB_HASS, LIB_HASS_TESTING],
    // @ts-expect-error testing
    name: "testing",
    services,
  });
}
