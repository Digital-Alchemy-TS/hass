import type { TServiceParams } from "@digital-alchemy/core";

import type { HassFrontendService, ThemeDefinition } from "../index.mts";
import type { HassThemeMapping } from "../user.mts";

export function FrontendService({ hass, logger }: TServiceParams): HassFrontendService {
  async function getThemes() {
    logger.trace({ name: "getThemes" }, "fetching themes");
    const result = await hass.socket.sendMessage<{
      themes: Record<keyof HassThemeMapping, ThemeDefinition>;
    }>({
      type: "frontend/get_themes",
    });
    return result.themes;
  }

  return {
    getThemes,
  };
}
