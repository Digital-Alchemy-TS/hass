import type { TServiceParams } from "@digital-alchemy/core";

import type { HassFrontendService, ThemeDefinition } from "../index.mts";
import type { HassThemeMapping } from "../user.mts";

export function FrontendService({ hass, logger }: TServiceParams): HassFrontendService {
  async function getThemes() {
    logger.trace({ name: "getThemes" }, "fetching themes");
    const result = await hass.socket.sendMessage<{ themes: Record<string, ThemeDefinition> }>({
      type: "frontend/get_themes",
    });
    const themes = result.themes;
    return Object.keys(themes).reduce(
      (acc, themeName) => {
        const key = themeName as keyof HassThemeMapping;
        acc[key] = themes[themeName];
        return acc;
      },
      {} as Record<keyof HassThemeMapping, ThemeDefinition>,
    );
  }

  return {
    getThemes,
  };
}
