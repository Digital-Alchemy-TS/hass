import { join } from "node:path";
import { cwd } from "node:process";

import { CreateLibrary, createModule, SINGLE } from "@digital-alchemy/core";

import { LIB_HASS } from "../hass.module.mts";
import {
  MockAreaExtension,
  MockConfig,
  MockDeviceExtension,
  MockEntityExtension,
  MockEntityRegistryExtension,
  MockEvents,
  MockFixtures,
  MockFloorExtension,
  MockLabelExtension,
  MockServices,
  MockWebsocketAPI,
  MockZoneExtension,
} from "./services/index.mts";
export const LIB_MOCK_ASSISTANT = CreateLibrary({
  configuration: {
    EMIT_SLEEP: {
      default: SINGLE,
      description: "Time in ms to wait after emitting entity update events",
      type: "number",
    },
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
  priorityInit: [
    "socket",
    "floor",
    "device",
    "area",
    "label",
    "config",
    "entity",
    "entity_registry",
    "services",
    "fixtures",
  ],
  services: {
    area: MockAreaExtension,
    config: MockConfig,
    device: MockDeviceExtension,
    entity: MockEntityExtension,
    entity_registry: MockEntityRegistryExtension,
    events: MockEvents,
    fixtures: MockFixtures,
    floor: MockFloorExtension,
    label: MockLabelExtension,
    services: MockServices,
    socket: MockWebsocketAPI,
    zone: MockZoneExtension,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    mock_assistant: typeof LIB_MOCK_ASSISTANT;
  }
}

/**
 * @internal
 *
 * Make your own
 */
// core >= 26.6 wires `.appendLibrary()` libraries BEFORE the module under test
// (issue #88), which deadlocks against mock_assistant's hard dependency on hass.
// Building from LIB_MOCK_ASSISTANT instead keeps hass first in the wiring order,
// so the mocks can monkey-patch fully-constructed hass services.
export const createTestRunner = () =>
  createModule
    .fromLibrary(LIB_MOCK_ASSISTANT)
    .extend()
    .toTest()
    .configure({
      boilerplate: { IS_TEST: true },
    })
    .setOptions({
      configSources: {
        argv: false,
        env: false,
        file: false,
      },
    });

export const hassTestRunner = createTestRunner();
