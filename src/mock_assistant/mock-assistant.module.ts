import { CreateLibrary, createModule } from "@digital-alchemy/core";
import { join } from "path";
import { cwd } from "process";
import { inspect } from "util";

import { LIB_HASS } from "..";
import {
  Events,
  Fixtures,
  MockAreaExtension,
  MockDeviceExtension,
  MockEntityExtension,
  MockFloorExtension,
  MockLabelExtension,
  MockWebsocketAPI,
  MockZoneExtension,
} from "./extensions";

export const LIB_MOCK_ASSISTANT = CreateLibrary({
  configuration: {
    FIXTURES_FILE: {
      default: join(cwd(), "fixtures.json"),
      description: [],
      type: "string",
    },
    PASS_AUTH: {
      default: true,
      description: "Auto pass for auth challenges",
      type: "boolean",
    },
  },
  depends: [LIB_HASS],
  name: "mock_assistant",
  priorityInit: ["fixtures", "socket"],
  services: {
    area: MockAreaExtension,
    device: MockDeviceExtension,
    entity: MockEntityExtension,
    events: Events,
    fixtures: Fixtures,
    floor: MockFloorExtension,
    label: MockLabelExtension,
    socket: MockWebsocketAPI,
    zone: MockZoneExtension,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    mock_assistant: typeof LIB_MOCK_ASSISTANT;
  }
}

export const HassTestRunner = createModule
  .fromLibrary(LIB_HASS)
  .extend()
  .toTest()
  .configure({
    boilerplate: {
      // best for debugging tests imo
      LOG_LEVEL: "warn",
    },
  })
  .appendLibrary(LIB_MOCK_ASSISTANT);

inspect.defaultOptions.depth = 10;
