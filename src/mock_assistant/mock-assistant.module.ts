import { CreateLibrary } from "@digital-alchemy/core";
import { join } from "path";
import { cwd } from "process";

import { Fixtures } from "./extensions";

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
    fixtures: Fixtures,
  },
});

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    mock_assistant: typeof LIB_MOCK_ASSISTANT;
  }
}
