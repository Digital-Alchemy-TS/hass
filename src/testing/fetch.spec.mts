import { subscribe } from "node:diagnostics_channel";

import { hassTestRunner } from "../mock_assistant/index.mts";

describe("Fetch", () => {
  const BASE_URL = "http://homeassistant.local:8123";

  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  describe("API", () => {
    describe("Diagnostics", () => {
      it("should publish diagnostics on fetch operation", async () => {
        expect.assertions(1);
        hassTestRunner.configure({
          hass: {
            BASE_URL,
            EMIT_DIAGNOSTICS: true,
          },
        });
        await hassTestRunner.run(({ lifecycle, hass }) => {
          const mockResponse = { data: "test response" };
          vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
            return {
              text: async () => JSON.stringify(mockResponse),
            } as unknown as Response;
          });

          const spy = vi.fn();
          subscribe(hass.diagnostics.fetch.fetch.name, spy);

          lifecycle.onPostConfig(() => {
            hass.fetch._fetcher.base_url = BASE_URL;
            hass.fetch._fetcher.base_headers = { Authorization: "Bearer test_token" };
          });

          lifecycle.onReady(async () => {
            await hass.fetch.fetch({ url: "/api/test" });
            expect(spy).toHaveBeenCalledWith(
              expect.objectContaining({
                ms: expect.any(Number),
                options: expect.objectContaining({ url: "/api/test" }),
                out: mockResponse,
              }),
              hass.diagnostics.fetch.fetch.name,
            );
          });
        });
      });
    });
  });
});
