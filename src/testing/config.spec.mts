import { env } from "process";
import type { MockInstance } from "vitest";

import type { ConfigEntry, HassServiceDTO } from "../helpers/index.mts";
import { State } from "../helpers/index.mts";
import { hassTestRunner } from "../mock_assistant/index.mts";
import { CONFIG_ENTRIES_UPDATED, SERVICE_LIST_UPDATED } from "../services/config.service.mts";

const TOKEN = "DEFAULTS";

describe("Config", () => {
  beforeEach(() => {
    delete env.HASSIO_TOKEN;
    delete env.SUPERVISOR_TOKEN;
    delete env.HASS_SERVER;
    hassTestRunner.configure({ hass: { VALIDATE_CONFIGURATION: false } });
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

  describe("Service List", () => {
    // # Should load service list successfully
    it("should load service list successfully", async () => {
      expect.assertions(2);
      const mockServices: HassServiceDTO[] = [
        {
          domain: "switch",
          services: {
            turn_off: { description: "Turn off", fields: {}, name: "turn_off" },
            turn_on: { description: "Turn on", fields: {}, name: "turn_on" },
          },
        },
      ];

      await hassTestRunner.run(({ lifecycle, hass, event, mock_assistant }) => {
        let emittedServices: HassServiceDTO[] | undefined;
        mock_assistant.services.loadFixtures(mockServices);
        vi.spyOn(hass.fetch, "listServices").mockImplementation(async () => mockServices);

        event.on(SERVICE_LIST_UPDATED, (services: HassServiceDTO[]) => {
          emittedServices = services;
        });

        lifecycle.onReady(async () => {
          await hass.configure.loadServiceList();
          expect(emittedServices).toEqual(mockServices);
          expect(hass.configure.getServices()).toEqual(mockServices);
        });
      });
    });

    // # Should retry on empty service list
    it("should retry on empty service list", async () => {
      expect.assertions(2);
      const mockServices: HassServiceDTO[] = [
        {
          domain: "switch",
          services: {
            turn_on: { description: "Turn on", fields: {}, name: "turn_on" },
          },
        },
      ];

      await hassTestRunner
        .configure({ hass: { RETRY_INTERVAL: 0.01 } })
        .run(({ lifecycle, hass, mock_assistant }) => {
          let callCount = 0;
          mock_assistant.services.loadFixtures(mockServices);
          vi.spyOn(hass.fetch, "listServices").mockImplementation(async () => {
            callCount++;
            // Bootstrap call (1) gets services, test call (2) gets empty, retry (3) gets services
            if (callCount === 2) {
              return [];
            }
            return mockServices;
          });

          lifecycle.onReady(async () => {
            await hass.configure.loadServiceList();
            expect(callCount).toBe(3);
            expect(hass.configure.getServices()).toEqual(mockServices);
          });
        });
    });

    // # Should exit on max retry attempts
    it("should exit on max retry attempts", async () => {
      expect.assertions(1);
      const exitSpy = vi
        .spyOn(process, "exit")
        // @ts-expect-error testing
        .mockImplementation(() => {});

      await hassTestRunner
        .configure({ hass: { RETRY_INTERVAL: 0.01 } })
        .run(({ lifecycle, hass }) => {
          let callCount = 0;
          // Bootstrap call succeeds to prevent early exit, test call fails and retries
          vi.spyOn(hass.fetch, "listServices").mockImplementation(async () => {
            callCount++;
            if (callCount === 1) {
              return [{ domain: "switch", services: {} }];
            }
            return [];
          });

          lifecycle.onReady(async () => {
            // This will retry 50 times then exit
            await hass.configure.loadServiceList();
            expect(exitSpy).toHaveBeenCalledWith(1);
          });
        });
    });

    // # Should check if service exists
    it("should check if service exists", async () => {
      expect.assertions(3);
      const mockServices: HassServiceDTO[] = [
        {
          domain: "switch",
          services: {
            turn_on: { description: "Turn on", fields: {}, name: "turn_on" },
          },
        },
      ];

      await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
        mock_assistant.services.loadFixtures(mockServices);
        vi.spyOn(hass.fetch, "listServices").mockImplementation(async () => mockServices);

        lifecycle.onReady(async () => {
          // Services already loaded from bootstrap, just check them
          expect(hass.configure.isService("switch", "turn_on")).toBe(true);
          expect(hass.configure.isService("switch", "turn_off")).toBe(false);
          expect(hass.configure.isService("light", "turn_on")).toBe(false);
        });
      });
    });

    // # Should cache service checks
    it("should cache service checks", async () => {
      expect.assertions(2);
      const mockServices: HassServiceDTO[] = [
        {
          domain: "switch",
          services: {
            turn_on: { description: "Turn on", fields: {}, name: "turn_on" },
          },
        },
      ];

      await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
        mock_assistant.services.loadFixtures(mockServices);
        vi.spyOn(hass.fetch, "listServices").mockImplementation(async () => mockServices);

        lifecycle.onReady(async () => {
          // Services already loaded from bootstrap, just check caching
          const firstCheck = hass.configure.isService("switch", "turn_on");
          const secondCheck = hass.configure.isService("switch", "turn_on");
          expect(firstCheck).toBe(true);
          expect(secondCheck).toBe(true);
        });
      });
    });
  });

  describe("Config Entries", () => {
    // # Should fetch config entries
    it("should fetch config entries", async () => {
      expect.assertions(2);
      const mockEntries: ConfigEntry[] = [
        {
          disabled_by: null,
          domain: "sun",
          entry_id: "01JJJ3NAS9JAW1SESXZRHG7YH7",
          pref_disable_new_entities: false,
          pref_disable_polling: false,
          reason: null,
          source: "user",
          state: State.Loaded,
          supports_options: false,
          supports_reconfigure: false,
          supports_remove_device: false,
          supports_unload: false,
          title: "Sun",
        },
      ];

      await hassTestRunner.run(({ lifecycle, hass, event }) => {
        let emittedEntries: ConfigEntry[] | undefined;
        event.on(CONFIG_ENTRIES_UPDATED, (entries: ConfigEntry[]) => {
          emittedEntries = entries;
        });

        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => mockEntries);

        lifecycle.onReady(async () => {
          const result = await hass.configure.get();
          expect(result).toEqual(mockEntries);
          expect(emittedEntries).toEqual(mockEntries);
        });
      });
    });

    // # Should return current config entries
    it("should return current config entries", async () => {
      expect.assertions(1);
      const mockEntries: ConfigEntry[] = [
        {
          disabled_by: null,
          domain: "sun",
          entry_id: "01JJJ3NAS9JAW1SESXZRHG7YH7",
          pref_disable_new_entities: false,
          pref_disable_polling: false,
          reason: null,
          source: "user",
          state: State.Loaded,
          supports_options: false,
          supports_reconfigure: false,
          supports_remove_device: false,
          supports_unload: false,
          title: "Sun",
        },
      ];

      await hassTestRunner.run(({ lifecycle, hass }) => {
        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => mockEntries);

        lifecycle.onReady(async () => {
          await hass.configure.get();
          expect(hass.configure.current()).toEqual(mockEntries);
        });
      });
    });

    // # Should find config entry by title
    it("should find config entry by title", async () => {
      expect.assertions(2);

      const mockEntries: ConfigEntry[] = [
        {
          disabled_by: null,
          domain: "sun",
          entry_id: "01JJJ3NAS9JAW1SESXZRHG7YH7",
          pref_disable_new_entities: false,
          pref_disable_polling: false,
          reason: null,
          source: "user",
          state: State.Loaded,
          supports_options: false,
          supports_reconfigure: false,
          supports_remove_device: false,
          supports_unload: false,
          title: "Sun",
        },
        {
          disabled_by: null,
          domain: "hassio",
          entry_id: "01JJJ3NAVSK3WCDRZQADJVMDRH",
          pref_disable_new_entities: false,
          pref_disable_polling: false,
          reason: null,
          source: "user",
          state: State.Loaded,
          supports_options: false,
          supports_reconfigure: false,
          supports_remove_device: false,
          supports_unload: false,
          title: "Supervisor",
        },
      ];

      await hassTestRunner.run(({ lifecycle, hass }) => {
        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => mockEntries);

        lifecycle.onReady(async () => {
          await hass.configure.get();
          const entry = hass.configure.byTitle("Sun");
          expect(entry).toBeDefined();
          expect(entry?.title).toBe("Sun");
        });
      });
    });

    // # Should return undefined for non-existent title
    it("should return undefined for non-existent title", async () => {
      expect.assertions(1);
      const mockEntries: ConfigEntry[] = [
        {
          disabled_by: null,
          domain: "sun",
          entry_id: "01JJJ3NAS9JAW1SESXZRHG7YH7",
          pref_disable_new_entities: false,
          pref_disable_polling: false,
          reason: null,
          source: "user",
          state: State.Loaded,
          supports_options: false,
          supports_reconfigure: false,
          supports_remove_device: false,
          supports_unload: false,
          title: "Sun",
        },
      ];

      await hassTestRunner.run(({ lifecycle, hass }) => {
        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => mockEntries);

        lifecycle.onReady(async () => {
          await hass.configure.get();
          // @ts-expect-error it's the test
          const entry = hass.configure.byTitle("Non Existent");
          expect(entry).toBeUndefined();
        });
      });
    });

    // # Should fetch config entries on socket connect
    it("should fetch config entries on socket connect", async () => {
      expect.assertions(1);
      const mockEntries: ConfigEntry[] = [
        {
          disabled_by: null,
          domain: "sun",
          entry_id: "01JJJ3NAS9JAW1SESXZRHG7YH7",
          pref_disable_new_entities: false,
          pref_disable_polling: false,
          reason: null,
          source: "user",
          state: State.Loaded,
          supports_options: false,
          supports_reconfigure: false,
          supports_remove_device: false,
          supports_unload: false,
          title: "Sun",
        },
      ];

      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi
          .spyOn(hass.socket, "sendMessage")
          .mockImplementation(async () => mockEntries);

        lifecycle.onReady(async () => {
          // onConnect is called during ready, so entries should be fetched
          await new Promise(resolve => setTimeout(resolve, 10));
          expect(spy).toHaveBeenCalledWith({
            type: "config_entries/get",
          });
        });
      });
    });

    // # Should update config entries on config_entry_updated event
    it("should update config entries on config_entry_updated event", async () => {
      expect.assertions(2);

      const initialEntries: ConfigEntry[] = [
        {
          disabled_by: null,
          domain: "sun",
          entry_id: "01JJJ3NAS9JAW1SESXZRHG7YH7",
          pref_disable_new_entities: false,
          pref_disable_polling: false,
          reason: null,
          source: "user",
          state: State.Loaded,
          supports_options: false,
          supports_reconfigure: false,
          supports_remove_device: false,
          supports_unload: false,
          title: "Sun",
        },
      ];

      const updatedEntries: ConfigEntry[] = [
        ...initialEntries,
        {
          disabled_by: null,
          domain: "hassio",
          entry_id: "01JJJ3NAVSK3WCDRZQADJVMDRH",
          pref_disable_new_entities: false,
          pref_disable_polling: false,
          reason: null,
          source: "user",
          state: State.Loaded,
          supports_options: false,
          supports_reconfigure: false,
          supports_remove_device: false,
          supports_unload: false,
          title: "Supervisor",
        },
      ];

      await hassTestRunner
        .configure({ hass: { EVENT_DEBOUNCE_MS: 10 } })
        .run(({ lifecycle, hass, mock_assistant }) => {
          let configEntryCallCount = 0;
          const originalSendMessage = hass.socket.sendMessage;
          vi.spyOn(hass.socket, "sendMessage").mockImplementation(
            async (message: { type: string }) => {
              // Only track and mock config_entries/get calls
              if (message.type === "config_entries/get") {
                configEntryCallCount++;
                return configEntryCallCount === 1 ? initialEntries : updatedEntries;
              }
              // Let other calls through to the original implementation
              return originalSendMessage.call(hass.socket, message);
            },
          );

          lifecycle.onReady(async () => {
            // onConnect already called get(), so we should have initialEntries
            expect(hass.configure.current()).toHaveLength(1);

            // Emit config_entry_updated event
            await mock_assistant.events.emitEvent("config_entry_updated", {});

            // Wait for debounce and update
            await new Promise(resolve => setTimeout(resolve, 50));
            expect(hass.configure.current()).toHaveLength(2);
          });
        });
    });
  });
});
