import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  TServiceParams,
} from "@digital-alchemy/core";
import dayjs from "dayjs";

import { CreateTestingApplication, SILENT_BOOT } from "./utils";

describe("FetchAPI", () => {
  let application: ApplicationDefinition<
    ServiceMap,
    OptionalModuleConfiguration
  >;
  const BASE_URL = "http://homeassistant.local:8123";

  // values are hard coded into tests, update carefully
  const start = dayjs("2024-01-01 00:00:00:00");
  const end = start.add(1, "day");

  afterEach(async () => {
    if (application) {
      await application.teardown();
      application = undefined;
    }
    jest.restoreAllMocks();
  });

  describe("API Operations", () => {
    it("should format calendarSearch properly", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(global, "fetch")
            .mockImplementation(async () => {
              return {
                text: () => "[]",
              } as unknown as Response;
            });
          lifecycle.onReady(async () => {
            await hass.fetch.calendarSearch({
              calendar: "calendar.example_calendar",
              end,
              start,
            });
            expect(spy).toHaveBeenCalledWith(
              `${BASE_URL}/api/calendars/calendar.example_calendar?end=2024-01-02T06%3A00%3A00.000Z&start=2024-01-01T06%3A00%3A00.000Z`,
              expect.objectContaining({
                method: "get",
              }),
            );
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
          },
        }),
      );
    });

    it("should format callService properly", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(global, "fetch")
            .mockImplementation(async () => {
              return {
                text: () => "{}",
              } as unknown as Response;
            });
          lifecycle.onReady(async () => {
            await hass.fetch.callService("light.toggle", {
              entity_id: "light.example_light",
            });
            expect(spy).toHaveBeenCalledWith(
              `${BASE_URL}/api/services/light/toggle`,
              expect.objectContaining({
                body: JSON.stringify({
                  entity_id: "light.example_light",
                }),
                method: "post",
              }),
            );
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
          },
        }),
      );
    });

    it("should format checkConfig properly", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(global, "fetch")
            .mockImplementation(async () => {
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
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
          },
        }),
      );
    });

    it("should format fetchEntityCustomizations properly", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(global, "fetch")
            .mockImplementation(async () => {
              return {
                text: () => "{}",
              } as unknown as Response;
            });
          lifecycle.onReady(async () => {
            await hass.fetch.fetchEntityCustomizations(
              "calendar.example_calendar",
            );
            expect(spy).toHaveBeenCalledWith(
              `${BASE_URL}/api/config/customize/config/calendar.example_calendar`,
              expect.objectContaining({
                method: "get",
              }),
            );
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
          },
        }),
      );
    });

    it("should format fetchEntityHistory properly", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(global, "fetch")
            .mockImplementation(async () => {
              return {
                text: () => "{}",
              } as unknown as Response;
            });
          lifecycle.onReady(async () => {
            await hass.fetch.fetchEntityHistory(
              "calendar.example_calendar",
              start,
              end,
            );
            expect(spy).toHaveBeenCalledWith(
              `${BASE_URL}/api/history/period/2024-01-01T06:00:00.000Z?end_time=2024-01-02T06%3A00%3A00.000Z&filter_entity_id=calendar.example_calendar`,
              expect.objectContaining({
                method: "get",
              }),
            );
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
          },
        }),
      );
    });

    it("should format fireEvent properly", async () => {
      expect.assertions(1);
      const body = { magic: true };
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(global, "fetch")
            .mockImplementation(async () => {
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
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
          },
        }),
      );
    });

    it("should format getAllEntities properly", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(global, "fetch")
            .mockImplementation(async () => {
              return {
                text: () => "{}",
              } as unknown as Response;
            });
          lifecycle.onReady(async () => {
            await hass.fetch.getAllEntities();
            expect(spy).toHaveBeenCalledWith(
              `${BASE_URL}/api/states`,
              expect.objectContaining({
                method: "get",
              }),
            );
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
          },
        }),
      );
    });

    it("should format getHassConfig properly", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(global, "fetch")
            .mockImplementation(async () => {
              return {
                text: () => "{}",
              } as unknown as Response;
            });
          lifecycle.onReady(async () => {
            await hass.fetch.getConfig();
            expect(spy).toHaveBeenCalledWith(
              `${BASE_URL}/api/config`,
              expect.objectContaining({
                method: "get",
              }),
            );
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
          },
        }),
      );
    });

    it("should format getLogs properly", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(global, "fetch")
            .mockImplementation(async () => {
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
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
          },
        }),
      );
    });

    it("should format getRawLogs properly", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(global, "fetch")
            .mockImplementation(async () => {
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
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
          },
        }),
      );
    });

    it("should format listServices properly", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(global, "fetch")
            .mockImplementation(async () => {
              return {
                text: () => "{}",
              } as unknown as Response;
            });
          lifecycle.onReady(async () => {
            await hass.fetch.listServices();
            expect(spy).toHaveBeenCalledWith(
              `${BASE_URL}/api/services`,
              expect.objectContaining({
                method: "get",
              }),
            );
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
          },
        }),
      );
    });

    it("should format updateEntity properly", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(global, "fetch")
            .mockImplementation(async () => {
              return {
                text: () => "{}",
              } as unknown as Response;
            });
          lifecycle.onReady(async () => {
            await hass.fetch.updateEntity("light.example_light", {
              attributes: { something: "special" },
              state: "off",
            });
            expect(spy).toHaveBeenCalledWith(
              `${BASE_URL}/api/states/light.example_light`,
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
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
          },
        }),
      );
    });

    it("should format webhook properly", async () => {
      expect.assertions(1);
      const body = {
        magic: true,
      };
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(global, "fetch")
            .mockImplementation(async () => {
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
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
          },
        }),
      );
    });

    it("should format checkCredentials properly", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(global, "fetch")
            .mockImplementation(async () => {
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
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
          },
        }),
      );
    });
  });
});
