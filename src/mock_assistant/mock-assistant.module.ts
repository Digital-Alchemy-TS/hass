import { CreateLibrary, createModule } from "@digital-alchemy/core";
import { join } from "path";
import { cwd } from "process";

import { HassConfig, LIB_HASS } from "..";
import { Events, Fixtures } from "./extensions";
import { MockWebsocketAPI } from "./extensions/websocket-api.extension";

export const LIB_MOCK_ASSISTANT = CreateLibrary({
  configuration: {
    FIXTURES_FILE: {
      default: join(cwd(), "fixtures.json"),
      description: [],
      type: "string",
    },
  },
  name: "mock_assistant",
  services: {
    events: Events,
    fixtures: Fixtures,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    mock_assistant: typeof LIB_MOCK_ASSISTANT;
  }
}

export const LIB_MOCK_HASS = createModule
  .fromLibrary(LIB_HASS)
  .extend()
  .replaceService("socket", MockWebsocketAPI)
  .appendService("_fetchReplacer", ({ hass }) => {
    hass.fetch.getConfig = async () => ({ version: "2024.4.1" }) as HassConfig;
  })
  .toLibrary();
