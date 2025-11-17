import { ServiceRunner } from "@digital-alchemy/core";

import { LIB_HASS } from "./index.mts";

await ServiceRunner(
  {
    bootstrap: {
      configuration: {
        boilerplate: {
          LOG_LEVEL: "info",
        },
      },
    },
    libraries: [LIB_HASS],
  },
  ({ lifecycle, hass, logger }) => {
    lifecycle.onReady(() => {
      const entity = hass.refBy.id("switch.desk_strip_baseboard_heater");
      entity.onStateFor({
        exec: () => logger.info("hit"),
        for: "2s",
        state: "on",
      });
    });
  },
);
