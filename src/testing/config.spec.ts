import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  TServiceParams,
} from "@digital-alchemy/core";
import { env } from "process";

import { SILENT_BOOT } from "..";
import { CreateTestingApplication } from "./lib/helpers/application";

const DEFAULTS = "DEFAULTS";

describe("Config", () => {
  let application: ApplicationDefinition<
    ServiceMap,
    OptionalModuleConfiguration
  >;

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
  });

  describe("Auto", () => {
    // # Should do nothing if variables do not exist
    it("should do nothing if variables do not exist", async () => {
      expect.assertions(2);
      const URL = "http://localhost:9123";
      application = CreateTestingApplication({
        Test({ config, lifecycle }: TServiceParams) {
          lifecycle.onPostConfig(() => {
            expect(config.hass.BASE_URL).toBe(URL);
            expect(config.hass.TOKEN).toBe(DEFAULTS);
          });
        },
      });

      await application.bootstrap(
        SILENT_BOOT({ hass: { BASE_URL: URL, TOKEN: DEFAULTS } }),
      );
    });

    // # Should set BASE_URL & TOKEN if provided env
    it("should set BASE_URL & TOKEN if provided env", async () => {
      expect.assertions(2);
      env.HASSIO_TOKEN = "FOO";
      application = CreateTestingApplication({
        Test({ config, lifecycle }: TServiceParams) {
          lifecycle.onPostConfig(() => {
            expect(config.hass.BASE_URL).toBe("http://supervisor/core");
            expect(config.hass.TOKEN).toBe("FOO");
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: { BASE_URL: "http://localhost:9123", TOKEN: DEFAULTS },
        }),
      );
    });

    // # Should use HASSIO_TOKEN over SUPERVISOR_TOKEN
    it("should use HASSIO_TOKEN over SUPERVISOR_TOKEN", async () => {
      expect.assertions(1);
      env.HASSIO_TOKEN = "FOO";
      env.SUPERVISOR_TOKEN = "BAR";
      application = CreateTestingApplication({
        Test({ config, lifecycle }: TServiceParams) {
          lifecycle.onPostConfig(() => {
            expect(config.hass.TOKEN).toBe("FOO");
          });
        },
      });
      await application.bootstrap(SILENT_BOOT());
    });

    // # Should allow SUPERVISOR_TOKEN
    it("should allow SUPERVISOR_TOKEN", async () => {
      expect.assertions(1);
      env.SUPERVISOR_TOKEN = "BAR";
      application = CreateTestingApplication({
        Test({ config, lifecycle }: TServiceParams) {
          lifecycle.onPostConfig(() => {
            expect(config.hass.TOKEN).toBe("BAR");
          });
        },
      });
      await application.bootstrap(SILENT_BOOT());
    });

    // # Should allow HASS_SERVER
    it("should allow HASS_SERVER", async () => {
      expect.assertions(2);
      env.HASSIO_TOKEN = "FOO";
      env.HASS_SERVER = "http://test/url";
      application = CreateTestingApplication({
        Test({ config, lifecycle }: TServiceParams) {
          lifecycle.onPostConfig(() => {
            expect(config.hass.TOKEN).toBe("FOO");
            expect(config.hass.BASE_URL).toBe("http://test/url");
          });
        },
      });
      await application.bootstrap(SILENT_BOOT());
    });
  });

  describe("Validate", () => {
    // # Should not exit if not set
    it("should not exit if not set", async () => {
      const exitSpy = jest
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});
      application = CreateTestingApplication({
        Test() {},
      });
      await application.bootstrap(SILENT_BOOT({ hass: { TOKEN: "TEST" } }));
      expect(exitSpy).not.toHaveBeenCalled();
    });

    // # Should info log on success
    it("should info log on success", async () => {
      const exitSpy = jest
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});
      let spy: jest.SpyInstance;
      application = CreateTestingApplication({
        Test({ internal, hass }: TServiceParams) {
          const logger = internal.boilerplate.logger.getBaseLogger();
          spy = jest.spyOn(logger, "info").mockImplementation(() => {});
          jest
            .spyOn(hass.fetch, "checkCredentials")
            .mockImplementation(async () => ({ message: "ok" }));
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { VALIDATE_CONFIGURATION: true } }),
      );
      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(spy).toHaveBeenCalledWith(
        "hass:configure",
        { name: "onPostConfig" },
        "ok",
      );
    });

    // # Should error log on bad token
    it("should error log on bad token", async () => {
      let spy: jest.SpyInstance;
      const exitSpy = jest
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});
      application = CreateTestingApplication({
        Test({ internal, hass }: TServiceParams) {
          const logger = internal.boilerplate.logger.getBaseLogger();
          spy = jest.spyOn(logger, "error").mockImplementation(() => {});
          jest
            .spyOn(hass.fetch, "checkCredentials")
            // anything that isn't the success works
            .mockImplementation(async () => ({ message: "big_bad_error" }));
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { TOKEN: "TEST", VALIDATE_CONFIGURATION: true } }),
      );
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
      application = CreateTestingApplication({
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
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { TOKEN: "TEST", VALIDATE_CONFIGURATION: true } }),
      );
      expect(exitSpy).toHaveBeenCalledWith(0);
      expect(spy).toHaveBeenCalledWith(
        "hass:configure",
        { error, name: "onPostConfig" },
        "failed to send request",
      );
    });
  });
});
