import { LibraryTestRunner, TestRunner } from "@digital-alchemy/core";
import { env } from "process";

import { HassConfig, LIB_HASS } from "..";
import { LIB_MOCK_ASSISTANT } from "../mock_assistant";

const DEFAULTS = "DEFAULTS";

describe("Config", () => {
  let runner: LibraryTestRunner<typeof LIB_HASS>;

  beforeEach(() => {
    delete env.HASSIO_TOKEN;
    delete env.SUPERVISOR_TOKEN;
    delete env.HASS_SERVER;
    runner = TestRunner({ target: LIB_HASS })
      .appendLibrary(LIB_MOCK_ASSISTANT)
      .appendService(({ hass }) => {
        jest
          .spyOn(hass.fetch, "getConfig")
          .mockImplementation(async () => ({ version: "2024.4.1" }) as HassConfig);
      })
      .configure({
        configuration: {
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
            MOCK_SOCKET: true,
          },
        },
      });
  });

  afterEach(async () => {
    await runner.teardown();
    jest.restoreAllMocks();
  });

  describe("Auto", () => {
    // # Should do nothing if variables do not exist
    it("should do nothing if variables do not exist", async () => {
      expect.assertions(2);
      const URL = "http://localhost:9123";
      await runner
        .configure({
          configuration: {
            hass: {
              BASE_URL: URL,
              TOKEN: DEFAULTS,
            },
          },
        })
        .run(({ lifecycle, config }) => {
          lifecycle.onPostConfig(() => {
            expect(config.hass.BASE_URL).toBe(URL);
            expect(config.hass.TOKEN).toBe(DEFAULTS);
          });
        });
    });

    // # Should set BASE_URL & TOKEN if provided env
    it("should set BASE_URL & TOKEN if provided env", async () => {
      expect.assertions(2);
      env.HASSIO_TOKEN = "FOO";
      await runner
        .configure({
          configuration: {
            hass: {
              BASE_URL: "http://localhost:9123",
              TOKEN: DEFAULTS,
            },
          },
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

      await runner.run(({ lifecycle, config }) => {
        lifecycle.onPostConfig(() => {
          expect(config.hass.TOKEN).toBe("FOO");
        });
      });
    });

    // # Should allow SUPERVISOR_TOKEN
    it("should allow SUPERVISOR_TOKEN", async () => {
      expect.assertions(1);
      env.SUPERVISOR_TOKEN = "BAR";
      await runner.run(({ lifecycle, config }) => {
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

      await runner.run(({ lifecycle, config }) => {
        lifecycle.onPostConfig(() => {
          expect(config.hass.TOKEN).toBe("FOO");
          expect(config.hass.BASE_URL).toBe("http://test/url");
        });
      });
    });
  });

  describe("Validate", () => {
    // # Should not exit if not set
    it("should not exit if not set", async () => {
      const exitSpy = jest
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});

      await runner
        .configure({ configuration: { hass: { TOKEN: "TEST" } } })
        .run(({ lifecycle, config }) => {
          lifecycle.onPostConfig(() => {
            expect(config.hass.TOKEN).toBe("FOO");
            expect(config.hass.BASE_URL).toBe("http://test/url");
          });
        });
      expect(exitSpy).not.toHaveBeenCalled();
    });

    // # Should info log on success
    it("should info log on success", async () => {
      const exitSpy = jest
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});
      let spy: jest.SpyInstance;

      await runner
        .configure({
          configuration: {
            hass: {
              VALIDATE_CONFIGURATION: true,
            },
          },
        })
        .run(({ internal, hass }) => {
          const logger = internal.boilerplate.logger.getBaseLogger();
          spy = jest.spyOn(logger, "info").mockImplementation(() => {});
          jest
            .spyOn(hass.fetch, "checkCredentials")
            .mockImplementation(async () => ({ message: "ok" }));
        });

      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(spy).toHaveBeenCalledWith("hass:configure", { name: "onPostConfig" }, "ok");
    });

    // # Should error log on bad token
    it("should error log on bad token", async () => {
      let spy: jest.SpyInstance;
      const exitSpy = jest
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});

      await runner
        .configure({
          configuration: {
            hass: {
              TOKEN: "TEST",
              VALIDATE_CONFIGURATION: true,
            },
          },
        })
        .run(({ internal, hass }) => {
          const logger = internal.boilerplate.logger.getBaseLogger();
          spy = jest.spyOn(logger, "error").mockImplementation(() => {});
          jest
            .spyOn(hass.fetch, "checkCredentials")
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
      let spy: jest.SpyInstance;
      const exitSpy = jest
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});
      jest.spyOn(console, "log").mockImplementation(() => {});

      jest.spyOn(console, "error").mockImplementation(() => {});

      await runner
        .configure({
          configuration: {
            hass: {
              TOKEN: "TEST",
              VALIDATE_CONFIGURATION: true,
            },
          },
        })
        .run(({ internal, hass }) => {
          const logger = internal.boilerplate.logger.getBaseLogger();
          spy = jest.spyOn(logger, "error").mockImplementation(() => {});
          jest
            .spyOn(hass.fetch, "checkCredentials")
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
