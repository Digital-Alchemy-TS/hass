import { hassTestRunner } from "../mock_assistant/index.mts";
import type { AddonDetails } from "../services/addon.service.mts";

describe("Addon Service", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  describe("list", () => {
    it("should fetch addon list via supervisor API", async () => {
      expect.assertions(2);
      const mockAddons: AddonDetails[] = [
        {
          advanced: false,
          available: true,
          build: false,
          description: "A test addon",
          detached: false,
          homeassistant: "2024.1.0",
          icon: true,
          logo: false,
          name: "Test Addon",
          repository: "test",
          slug: "test_addon",
          stage: "stable",
          state: "started",
          system_managed: false,
          update_available: false,
          url: "http://test.local",
          version: "1.0.0",
          version_latest: "1.0.0",
        },
      ];

      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => mockAddons);

        lifecycle.onReady(async () => {
          const result = await hass.addon.list();
          expect(spy).toHaveBeenCalledWith({
            endpoint: "/addons",
            method: "get",
            type: "supervisor/api",
          });
          expect(result).toEqual(mockAddons);
        });
      });
    });

    it("should return empty array when no addons are available", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => []);

        lifecycle.onReady(async () => {
          const result = await hass.addon.list();
          expect(result).toEqual([]);
        });
      });
    });
  });
});
