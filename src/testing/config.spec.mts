import { env } from "process";
import type { MockInstance } from "vitest";

import { hassTestRunner } from "../mock_assistant/index.mts";

const TOKEN = "DEFAULTS";

describe("Config", () => {
  beforeEach(() => {
    delete env.HASSIO_TOKEN;
    delete env.SUPERVISOR_TOKEN;
    delete env.HASS_SERVER;
  });

  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  describe("Auto", () => {
    // # Should do nothing if variables do not exist
    it("should do nothing if variables do not exist", async () => {
      expect.assertions(2);
      const BASE_URL = "http://localhost:9123";
      await hassTestRunner.configure({ hass: { BASE_URL, TOKEN } }).run(({ lifecycle, config }) => {
        lifecycle.onPostConfig(() => {
          expect(config.hass.BASE_URL).toBe(BASE_URL);
          expect(config.hass.TOKEN).toBe(TOKEN);
        });
      });
    });

    // # Should set BASE_URL & TOKEN if provided env
    it("should set BASE_URL & TOKEN if provided env", async () => {
      expect.assertions(2);
      env.HASSIO_TOKEN = "FOO";
      await hassTestRunner
        .configure({
          hass: { BASE_URL: "http://localhost:9123", TOKEN: TOKEN },
        })
        .run(({ lifecycle, config }) => {
          lifecycle.onPostConfig(() => {
            expect(config.hass.BASE_URL).toBe("http://supervisor/core");
            expect(config.hass.TOKEN).toBe("FOO");
          });
        });
    });

    // # Should use HASSIO_TOKEN over SUPERVISOR_TOKEN
    it("should use HASSIO_TOKEN over SUPERVISOR_TOKEN", async () => {
      expect.assertions(1);
      env.HASSIO_TOKEN = "FOO";
      env.SUPERVISOR_TOKEN = "BAR";

      await hassTestRunner.run(({ lifecycle, config }) => {
        lifecycle.onPostConfig(() => {
          expect(config.hass.TOKEN).toBe("FOO");
        });
      });
    });

    // # Should allow SUPERVISOR_TOKEN
    it("should allow SUPERVISOR_TOKEN", async () => {
      expect.assertions(1);
      env.SUPERVISOR_TOKEN = "BAR";
      await hassTestRunner.run(({ lifecycle, config }) => {
        lifecycle.onPostConfig(() => {
          expect(config.hass.TOKEN).toBe("BAR");
        });
      });
    });

    // # Should allow HASS_SERVER
    it("should allow HASS_SERVER", async () => {
      expect.assertions(2);
      env.HASSIO_TOKEN = "FOO";
      env.HASS_SERVER = "http://test/url";

      await hassTestRunner.run(({ lifecycle, config }) => {
        lifecycle.onPostConfig(() => {
          expect(config.hass.TOKEN).toBe("FOO");
          expect(config.hass.BASE_URL).toBe("http://test/url");
        });
      });
    });
  });

  describe("Validate Config", () => {
    // # Should not exit if not set
    it("should not exit if not set", async () => {
      expect.assertions(1);
      const exitSpy = vi
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});

      await hassTestRunner
        .configure({
          hass: { TOKEN: "TEST" },
        })
        .run(() => {});
      expect(exitSpy).not.toHaveBeenCalled();
    });

    // # Should info log on success
    it("should info log on success", async () => {
      const exitSpy = vi
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});
      let spy: MockInstance;

      await hassTestRunner
        .configure({
          hass: { VALIDATE_CONFIGURATION: true },
        })
        .run(({ internal, hass }) => {
          const logger = internal.boilerplate.logger.getBaseLogger();
          spy = vi.spyOn(logger, "info").mockImplementation(() => {});
          vi.spyOn(hass.fetch, "checkCredentials").mockImplementation(async () => ({
            message: "ok",
          }));
        });

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(spy).toHaveBeenCalledWith("hass:configure", { name: "onPostConfig" }, "ok");
    });

    // # Should error log on bad token
    it("should error log on bad token", async () => {
      let spy: MockInstance;
      const exitSpy = vi
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});

      await hassTestRunner
        .configure({ hass: { TOKEN: "TEST", VALIDATE_CONFIGURATION: true } })
        .run(({ internal, hass }) => {
          const logger = internal.boilerplate.logger.getBaseLogger();
          spy = vi.spyOn(logger, "error").mockImplementation(() => {});
          vi.spyOn(hass.fetch, "checkCredentials")
            // anything that isn't the success works
            .mockImplementation(async () => ({ message: "big_bad_error" }));
        });

      expect(exitSpy).toHaveBeenCalledWith(0);
      expect(spy).toHaveBeenCalledWith(
        "hass:configure",
        { name: "onPostConfig" },
        String({ message: "big_bad_error" }),
      );
    });

    // # Should error log on bad url
    it("should error log on bad url", async () => {
      const error = new Error("BOOM");
      let spy: MockInstance;
      const exitSpy = vi
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});
      vi.spyOn(console, "log").mockImplementation(() => {});

      vi.spyOn(console, "error").mockImplementation(() => {});

      await hassTestRunner
        .configure({ hass: { TOKEN: "TEST", VALIDATE_CONFIGURATION: true } })
        .run(({ internal, hass }) => {
          const logger = internal.boilerplate.logger.getBaseLogger();
          spy = vi.spyOn(logger, "error").mockImplementation(() => {});
          vi.spyOn(hass.fetch, "checkCredentials")
            // anything that isn't the success works
            .mockImplementation(async () => {
              throw error;
            });
        });

      expect(exitSpy).toHaveBeenCalledWith(0);
      expect(spy).toHaveBeenCalledWith(
        "hass:configure",
        { error, name: "onPostConfig" },
        "failed to send request",
      );
    });
  });
});
