#!/usr/bin/env node
import type { TServiceParams } from "@digital-alchemy/core";
import { CreateApplication } from "@digital-alchemy/core";
import { writeFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";

import { LIB_HASS } from "../index.mts";
import type { ScannerCacheData } from "./helpers/index.mts";

const writeFixtures = CreateApplication({
  configuration: {
    FIXTURES_FILE: {
      default: join(cwd(), "fixtures.json"),
      description: [],
      type: "string",
    },
  },
  libraries: [LIB_HASS],
  name: "mock_assistant",
  services: {
    Write({ hass, lifecycle, config }: TServiceParams) {
      lifecycle.onReady(async () => {
        writeFileSync(
          config.mock_assistant.FIXTURES_FILE,
          JSON.stringify(
            {
              areas: hass.area.current,
              config: await hass.fetch.getConfig(),
              devices: hass.device.current,
              entities: hass.entity.listEntities().map(i => hass.entity.getCurrentState(i)),
              entity_registry: hass.entity.registry.current,
              floors: hass.floor.current,
              labels: hass.label.current,
              services: await hass.fetch.listServices(),
            } as ScannerCacheData,
            undefined,
            "  ",
          ),
          "utf8",
        );
        process.exit();
      });
    },
  },
});
setImmediate(async () => writeFixtures.bootstrap());
