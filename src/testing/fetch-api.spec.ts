import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  TServiceParams,
} from "@digital-alchemy/core";
import dayjs from "dayjs";

import { PICK_ENTITY } from "../helpers";
import {
  CreateTestingApplication,
  SILENT_BOOT,
} from "../mock_assistant/helpers/utils";

describe("FetchAPI", () => {
  let application: ApplicationDefinition<
    ServiceMap,
    OptionalModuleConfiguration
  >;
  const BASE_URL = "http://homeassistant.some.domain:9123";
  const TOKEN =
    // eslint-disable-next-line @cspell/spellchecker
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aWRlbyI6Imh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9ZFF3NHc5V2dYY1EifQ.gPIttZEaLZgov3VZziu3LovcgtDbj8H0-XfBg4f08Y0";

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

  describe("Meta", () => {
    it("Should send the correct headers", async () => {
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
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
            BASE_URL,
            TOKEN,
          },
        }),
      );
    });
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
              calendar: "calendar.example_calendar" as PICK_ENTITY,
              end,
              start,
            });
            expect(spy).toHaveBeenCalledWith(
              `${BASE_URL}/api/calendars/calendar.example_calendar?end=${encodeURIComponent(end.toISOString())}&start=${encodeURIComponent(start.toISOString())}`,
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
            BASE_URL,
            TOKEN,
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
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
            BASE_URL,
            TOKEN,
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
            BASE_URL,
            TOKEN,
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
            await hass.fetch.fetchEntityCustomizations("switch.porch_light");
            expect(spy).toHaveBeenCalledWith(
              `${BASE_URL}/api/config/customize/config/switch.porch_light`,
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
            BASE_URL,
            TOKEN,
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
              "switch.porch_light",
              start,
              end,
            );
            expect(spy).toHaveBeenCalledWith(
              `${BASE_URL}/api/history/period/2024-01-01T06:00:00.000Z?end_time=2024-01-02T06%3A00%3A00.000Z&filter_entity_id=switch.porch_light`,
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
            BASE_URL,
            TOKEN,
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
            BASE_URL,
            TOKEN,
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
            BASE_URL,
            TOKEN,
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
            BASE_URL,
            TOKEN,
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
            BASE_URL,
            TOKEN,
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
            BASE_URL,
            TOKEN,
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
            BASE_URL,
            TOKEN,
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
        },
      });
      await application.bootstrap(
        SILENT_BOOT({
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
            BASE_URL,
            TOKEN,
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
            BASE_URL,
            TOKEN,
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
            BASE_URL,
            TOKEN,
          },
        }),
      );
    });
  });
});
