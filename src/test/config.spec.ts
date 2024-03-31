import {
  ApplicationDefinition,
  CreateApplication,
  OptionalModuleConfiguration,
  ServiceMap,
  TServiceParams,
} from "@digital-alchemy/core";
import { env } from "process";

import { LIB_HASS } from "..";
import { LIB_HASS_TESTING } from "./hass-testing.module";

const DEFAULTS = "DEFAULTS";

describe("Config", () => {
  let application: ApplicationDefinition<
    ServiceMap,
    OptionalModuleConfiguration
  >;
  let exitSpy: jest.SpyInstance;
  let spy: jest.SpyInstance;

  beforeAll(() => {
    delete env.HASSIO_TOKEN;
    delete env.SUPERVISOR_TOKEN;
    delete env.HASS_SERVER;
  });
  afterEach(async () => {
    if (application) {
      await application.teardown();
      application = undefined;
    }
    delete env.HASSIO_TOKEN;
    delete env.SUPERVISOR_TOKEN;
    delete env.HASS_SERVER;
    jest.restoreAllMocks();
    exitSpy = undefined;
    spy = undefined;
  });

  describe("Auto", () => {
    it("should do nothing if variables do not exist", async () => {
      expect.assertions(2);
      const URL = "http://localhost:9123";
      application = CreateApplication({
        libraries: [LIB_HASS, LIB_HASS_TESTING],
        // @ts-expect-error testing
        name: "testing",
        services: {
          Test({ config, lifecycle }: TServiceParams) {
            lifecycle.onPostConfig(() => {
              expect(config.hass.BASE_URL).toBe(URL);
              expect(config.hass.TOKEN).toBe(DEFAULTS);
            });
          },
        },
      });
      await application.bootstrap({
        configuration: {
          boilerplate: {
            LOG_LEVEL: "silent",
          },
          hass: {
            BASE_URL: URL,
            TOKEN: DEFAULTS,
          },
        },
      });
    });

    it("should set BASE_URL & TOKEN if provided env", async () => {
      expect.assertions(2);
      env.HASSIO_TOKEN = "FOO";
      application = CreateApplication({
        libraries: [LIB_HASS, LIB_HASS_TESTING],
        // @ts-expect-error testing
        name: "testing",
        services: {
          Test({ config, lifecycle }: TServiceParams) {
            lifecycle.onPostConfig(() => {
              expect(config.hass.BASE_URL).toBe("http://supervisor/core");
              expect(config.hass.TOKEN).toBe("FOO");
            });
          },
        },
      });
      await application.bootstrap({
        configuration: {
          boilerplate: {
            LOG_LEVEL: "silent",
          },
          hass: {
            BASE_URL: "http://localhost:9123",
            TOKEN: DEFAULTS,
          },
        },
      });
    });

    it("should use HASSIO_TOKEN over SUPERVISOR_TOKEN", async () => {
      expect.assertions(1);
      env.HASSIO_TOKEN = "FOO";
      env.SUPERVISOR_TOKEN = "BAR";
      application = CreateApplication({
        libraries: [LIB_HASS, LIB_HASS_TESTING],
        // @ts-expect-error testing
        name: "testing",
        services: {
          Test({ config, lifecycle }: TServiceParams) {
            lifecycle.onPostConfig(() => {
              expect(config.hass.TOKEN).toBe("FOO");
            });
          },
        },
      });
      await application.bootstrap({
        configuration: {
          boilerplate: {
            LOG_LEVEL: "silent",
          },
          hass: {},
        },
      });
    });

    it("should allow SUPERVISOR_TOKEN", async () => {
      expect.assertions(1);
      env.SUPERVISOR_TOKEN = "BAR";
      application = CreateApplication({
        libraries: [LIB_HASS, LIB_HASS_TESTING],
        // @ts-expect-error testing
        name: "testing",
        services: {
          Test({ config, lifecycle }: TServiceParams) {
            lifecycle.onPostConfig(() => {
              expect(config.hass.TOKEN).toBe("BAR");
            });
          },
        },
      });
      await application.bootstrap({
        configuration: {
          boilerplate: {
            LOG_LEVEL: "silent",
          },
          hass: {},
        },
      });
    });

    it("should allow HASS_SERVER", async () => {
      expect.assertions(2);
      env.HASSIO_TOKEN = "FOO";
      env.HASS_SERVER = "http://test/url";
      application = CreateApplication({
        libraries: [LIB_HASS, LIB_HASS_TESTING],
        // @ts-expect-error testing
        name: "testing",
        services: {
          Test({ config, lifecycle }: TServiceParams) {
            lifecycle.onPostConfig(() => {
              expect(config.hass.TOKEN).toBe("FOO");
              expect(config.hass.BASE_URL).toBe("http://test/url");
            });
          },
        },
      });
      await application.bootstrap({
        configuration: {
          boilerplate: {
            LOG_LEVEL: "silent",
          },
          hass: {},
        },
      });
    });
  });

  describe("Validate", () => {
    it("should not exit if not set", async () => {
      exitSpy = jest
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});
      application = CreateApplication({
        libraries: [LIB_HASS, LIB_HASS_TESTING],
        // @ts-expect-error testing
        name: "testing",
        services: {
          test() {},
        },
      });
      await application.bootstrap({
        configuration: {
          boilerplate: {
            LOG_LEVEL: "silent",
          },
          hass: {
            TOKEN: "TEST",
          },
        },
      });
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it("should info log on success", async () => {
      exitSpy = jest
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});
      jest.spyOn(console, "log").mockImplementation(() => {});
      jest.spyOn(console, "error").mockImplementation(() => {});
      application = CreateApplication({
        libraries: [LIB_HASS, LIB_HASS_TESTING],
        // @ts-expect-error testing
        name: "testing",
        services: {
          Test({ internal, hass }: TServiceParams) {
            const logger = internal.boilerplate.logger.getBaseLogger();
            spy = jest.spyOn(logger, "info").mockImplementation(() => {});
            jest
              .spyOn(hass.fetch, "checkCredentials")
              .mockImplementation(async () => ({ message: "ok" }));
          },
        },
      });
      await application.bootstrap({
        configuration: {
          boilerplate: {
            LOG_LEVEL: "silent",
          },
          hass: {
            TOKEN: "TEST",
            VALIDATE_CONFIGURATION: true,
          },
        },
      });
      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(spy).toHaveBeenCalledWith(
        "hass:configure",
        { name: "onPostConfig" },
        "ok",
      );
    });

    it("should error log on bad token", async () => {
      exitSpy = jest
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});
      jest.spyOn(console, "log").mockImplementation(() => {});
      jest.spyOn(console, "error").mockImplementation(() => {});
      application = CreateApplication({
        libraries: [LIB_HASS, LIB_HASS_TESTING],
        // @ts-expect-error testing
        name: "testing",
        services: {
          Test({ internal, hass }: TServiceParams) {
            const logger = internal.boilerplate.logger.getBaseLogger();
            spy = jest.spyOn(logger, "error").mockImplementation(() => {});
            jest
              .spyOn(hass.fetch, "checkCredentials")
              // anything that isn't the success works
              .mockImplementation(async () => ({ message: "big_bad_error" }));
          },
        },
      });
      await application.bootstrap({
        configuration: {
          boilerplate: {
            LOG_LEVEL: "silent",
          },
          hass: {
            TOKEN: "TEST",
            VALIDATE_CONFIGURATION: true,
          },
        },
      });
      expect(exitSpy).toHaveBeenCalledWith(0);
      expect(spy).toHaveBeenCalledWith(
        "hass:configure",
        { name: "onPostConfig" },
        String({ message: "big_bad_error" }),
      );
    });

    it("should error log on bad url", async () => {
      const error = new Error("BOOM");
      exitSpy = jest
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});
      jest.spyOn(console, "log").mockImplementation(() => {});
      jest.spyOn(console, "error").mockImplementation(() => {});
      application = CreateApplication({
        libraries: [LIB_HASS, LIB_HASS_TESTING],
        // @ts-expect-error testing
        name: "testing",
        services: {
          Test({ internal, hass }: TServiceParams) {
            const logger = internal.boilerplate.logger.getBaseLogger();
            spy = jest.spyOn(logger, "error").mockImplementation(() => {});
            jest
              .spyOn(hass.fetch, "checkCredentials")
              // anything that isn't the success works
              .mockImplementation(async () => {
                throw error;
              });
          },
        },
      });
      await application.bootstrap({
        configuration: {
          boilerplate: {
            LOG_LEVEL: "silent",
          },
          hass: {
            TOKEN: "TEST",
            VALIDATE_CONFIGURATION: true,
          },
        },
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
