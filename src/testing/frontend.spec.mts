import type { ThemeDefinition } from "../helpers/index.mts";
import { hassTestRunner } from "../mock_assistant/index.mts";

describe("Frontend Service", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  describe("getThemes", () => {
    it("should fetch themes and return Record of theme names to definitions", async () => {
      expect.assertions(2);
      const mockThemes: Record<string, ThemeDefinition> = {
        "LCARS Default": {
          "accent-color": "var(--lcars-orange)",
          "card-mod-theme": "LCARS Default",
          "divider-color": "transparent",
          "primary-color": "var(--lcars-ui-tertiary)",
          "sidebar-background-color": "var(--lcars-ui-primary)",
        },
        "Minimal Ninja": {
          "accent-color": "#FFAB00",
          "card-mod-theme": "Minimal Ninja",
          "divider-color": "rgba(145, 158, 171, 0.2)",
          modes: {
            dark: {
              "card-background-color": "#1C252E",
              "primary-text-color": "#ffffff",
            },
            light: {
              "card-background-color": "#ffffff",
              "primary-text-color": "#1C252E",
            },
          },
          "primary-color": "#00A76F",
        },
      };

      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi
          .spyOn(hass.socket, "sendMessage")
          .mockImplementation(async () => ({ themes: mockThemes }));

        lifecycle.onReady(async () => {
          const result = await hass.frontend.getThemes();
          expect(spy).toHaveBeenCalledWith({
            type: "frontend/get_themes",
          });
          expect(result).toEqual(mockThemes);
        });
      });
    });

    it("should return empty object when no themes are available", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => ({ themes: {} }));

        lifecycle.onReady(async () => {
          const result = await hass.frontend.getThemes();
          expect(result).toEqual({});
        });
      });
    });
  });
});
