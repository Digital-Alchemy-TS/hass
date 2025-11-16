import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import type { MockInstance } from "vitest";

import type { HassConfig } from "../helpers/index.mts";
import { hassTestRunner } from "../mock_assistant/index.mts";

describe("FetchAPI", () => {
  const BASE_URL = "http://homeassistant.some.domain:9123";
  const TOKEN = faker.string.alphanumeric(100);

  hassTestRunner.configure({
    hass: { BASE_URL, TOKEN },
  });
  // values are hard coded into tests, update carefully
  const start = dayjs("2024-01-01 00:00:00:00");
  const end = start.add(1, "day");

  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  describe("Meta", () => {
    it("Should send the correct headers", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          const spy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
            return {
              text: () => "[]",
            } as unknown as Response;
          });
          // Calling the base level fetch provided by service
          // The same call is wrapped internally to power everything else
          await hass.fetch.fetch({ url: "/api/" });
          expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/api/`,
            expect.objectContaining({
              headers: {
                Authorization: "Bearer " + TOKEN,
              },
              method: "get",
            }),
          );
        });
      });
    });
  });

  describe("API Operations", () => {
    it("should format calendarSearch properly", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
          return {
            text: () => "[]",
          } as unknown as Response;
        });
        lifecycle.onReady(async () => {
          await hass.fetch.calendarSearch({
            calendar: "calendar.united_states_tx",
            end,
            start,
          });
          expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/api/calendars/calendar.united_states_tx?end=${encodeURIComponent(end.toISOString())}&start=${encodeURIComponent(start.toISOString())}`,
            expect.objectContaining({
              method: "get",
            }),
          );
        });
      });
    });

    it("should format callService properly", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
          return {
            text: () => "{}",
          } as unknown as Response;
        });
        lifecycle.onReady(async () => {
          await hass.fetch.callService("switch.toggle", {
            entity_id: "switch.porch_light",
          });
          expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/api/services/switch/toggle`,
            expect.objectContaining({
              body: JSON.stringify({
                entity_id: "switch.porch_light",
              }),
              method: "post",
            }),
          );
        });
      });
    });

    it("should format checkConfig properly", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
          return {
            text: () => "{}",
          } as unknown as Response;
        });
        lifecycle.onReady(async () => {
          await hass.fetch.checkConfig();
          expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/api/config/core/check_config`,
            expect.objectContaining({
              method: "post",
            }),
          );
        });
      });
    });

    // TODO: this results in an open handle
    // not sure why
    it.skip("exits for low version at boot", async () => {
      expect.assertions(2);
      const exitSpy = vi.spyOn(process, "exit");

      // .mockImplementation(() => {
      //   throw new Error("EXPECTED TESTING ERROR");
      // });
      vi.spyOn(console, "error").mockImplementation(() => undefined);
      try {
        await hassTestRunner.run(({ lifecycle, mock_assistant }) => {
          lifecycle.onPreInit(() => {
            mock_assistant.config.loadFixtures({ version: "2024.1.0" } as HassConfig);
          }, -1000);
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
      await hassTestRunner.teardown();
      expect(exitSpy).toHaveBeenCalled();
    });

    // TODO: Need a way to make this pass without breaking all other tests
    it.skip("passes for valid version", async () => {
      expect.assertions(2);
      let mock: MockInstance;
      let exitSpy: MockInstance;
      try {
        await hassTestRunner.run(({ hass }) => {
          mock = vi
            .spyOn(hass.fetch, "getConfig")
            .mockImplementation(async () => ({ version: "2024.4.1" }) as HassConfig);
          exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
            throw new Error("EXPECTED TESTING ERROR");
          });
        });
      } finally {
        expect(mock).toHaveBeenCalled();
        expect(exitSpy).not.toHaveBeenCalled();
      }
    });

    it("should format fetchEntityCustomizations properly", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
          return {
            text: () => "{}",
          } as unknown as Response;
        });
        lifecycle.onReady(async () => {
          await hass.fetch.fetchEntityCustomizations("switch.porch_light");
          expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/api/config/customize/config/switch.porch_light`,
            expect.objectContaining({
              method: "get",
            }),
          );
        });
      });
    });

    it("should format fetchEntityHistory properly", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
          return {
            text: () => "{}",
          } as unknown as Response;
        });
        lifecycle.onReady(async () => {
          await hass.fetch.fetchEntityHistory("switch.porch_light", start, end);
          expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/api/history/period/${encodeURIComponent(start.toISOString())}?end_time=${encodeURIComponent(end.toISOString())}&filter_entity_id=switch.porch_light`,
            expect.objectContaining({
              method: "get",
            }),
          );
        });
      });
    });

    it("should format fireEvent properly", async () => {
      expect.assertions(1);
      const body = { magic: true };
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
          return {
            text: () => "{}",
          } as unknown as Response;
        });
        lifecycle.onReady(async () => {
          await hass.fetch.fireEvent("testing_event", body);
          expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/api/events/testing_event`,
            expect.objectContaining({
              body: JSON.stringify(body),
              method: "post",
            }),
          );
        });
      });
    });

    it("should format getAllEntities properly", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
        lifecycle.onReady(async () => {
          mock_assistant.entity.monkeyReset();
          const spy = vi.spyOn(hass.fetch, "fetch").mockImplementation(async () => []);
          await hass.fetch.getAllEntities();
          expect(spy).toHaveBeenCalledWith({ url: "/api/states" });
        });
      });
    });

    // it("should format getHassConfig properly", async () => {
    //   expect.assertions(1);
    //   application = CreateTestingApplication({
    //     Test({ lifecycle, hass }: TServiceParams) {
    //       const spy = vi.spyOn(global, "fetch").mockImplementation(async () => {
    //         return {
    //           text: () => "{}",
    //         } as unknown as Response;
    //       });
    //       lifecycle.onReady(async () => {
    //         await hass.fetch.getConfig();
    //         expect(spy).toHaveBeenCalledWith(
    //           `${BASE_URL}/api/config`,
    //           expect.objectContaining({
    //             method: "get",
    //           }),
    //         );
    //       });
    //     },
    //   });
    //   await application.bootstrap(
    //     SILENT_BOOT(
    //       {
    //         hass: {
    //           AUTO_CONNECT_SOCKET: false,
    //           AUTO_SCAN_CALL_PROXY: false,
    //           BASE_URL,
    //           TOKEN,
    //         },
    //       },
    //       false,
    //       false,
    //     ),
    //   );
    // });

    it("should format getLogs properly", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
          return {
            text: () => "[]",
          } as unknown as Response;
        });
        lifecycle.onReady(async () => {
          await hass.fetch.getLogs();
          expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/api/error/all`,
            expect.objectContaining({
              method: "get",
            }),
          );
        });
      });
    });

    it("should format getRawLogs properly", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
          return {
            text: () => "{}",
          } as unknown as Response;
        });
        lifecycle.onReady(async () => {
          await hass.fetch.getRawLogs();
          expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/api/error_log`,
            expect.objectContaining({
              method: "get",
            }),
          );
        });
      });
    });

    it("should format listServices properly", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
        lifecycle.onReady(async () => {
          const spy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
            return {
              text: () => "{}",
            } as unknown as Response;
          });
          mock_assistant.services.monkeyReset();
          await hass.fetch.listServices();
          expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/api/services`,
            expect.objectContaining({
              method: "get",
            }),
          );
        });
      });
    });

    it("should format updateEntity properly", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
          return {
            text: () => "{}",
          } as unknown as Response;
        });
        lifecycle.onReady(async () => {
          await hass.fetch.updateEntity("switch.porch_light", {
            attributes: { something: "special" },
            state: "off",
          });
          expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/api/states/switch.porch_light`,
            expect.objectContaining({
              body: JSON.stringify({
                // ! DO NOT CHANGE ORDER OF KEYS
                // It changes the resulting JSON, breaking the test
                attributes: { something: "special" },
                state: "off",
              }),
              method: "post",
            }),
          );
        });
      });
    });

    it("should format webhook properly", async () => {
      expect.assertions(1);
      const body = {
        magic: true,
      };
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
          return {
            text: () => "{}",
          } as unknown as Response;
        });
        lifecycle.onReady(async () => {
          await hass.fetch.webhook("magic_webhook", body);
          expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/api/webhook/magic_webhook`,
            expect.objectContaining({
              body: JSON.stringify(body),
              method: "post",
            }),
          );
        });
      });
    });

    it("should format checkCredentials properly", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
          return {
            text: () => "{}",
          } as unknown as Response;
        });
        lifecycle.onReady(async () => {
          await hass.fetch.checkCredentials();
          expect(spy).toHaveBeenCalledWith(
            `${BASE_URL}/api/`,
            expect.objectContaining({
              method: "get",
            }),
          );
        });
      });
    });
  });
});
