import type { HassServiceDTO } from "../helpers/index.mts";
import { hassTestRunner } from "../mock_assistant/index.mts";

afterEach(async () => {
  await hassTestRunner.teardown();
  vi.restoreAllMocks();
});

describe("CallProxy", () => {
  describe("pauseMessages", () => {
    it("should return undefined when pauseMessages is true", async () => {
      expect.assertions(2);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
        hass.socket.pauseMessages = true;

        lifecycle.onReady(async () => {
          const result = await hass.call.switch.turn_on({
            entity_id: "switch.porch_light",
          });

          expect(result).toBeUndefined();
          const callServiceCalls = spy.mock.calls.filter(
            call =>
              call[0]?.type === "call_service" &&
              call[0]?.domain === "switch" &&
              call[0]?.service === "turn_on",
          );
          expect(callServiceCalls).toHaveLength(0);
        });
      });
    });

    it("should call sendMessage when pauseMessages is false", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
        hass.socket.pauseMessages = false;

        lifecycle.onReady(async () => {
          await hass.call.switch.turn_on({
            entity_id: "switch.porch_light",
          });

          expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
              domain: "switch",
              service: "turn_on",
              service_data: {
                entity_id: "switch.porch_light",
              },
              type: "call_service",
            }),
            true,
          );
        });
      });
    });
  });

  describe("return_response", () => {
    it("should include return_response in payload when service has response.optional", async () => {
      expect.assertions(1);
      const mockServices: HassServiceDTO[] = [
        {
          domain: "switch",
          services: {
            turn_on: {
              description: "Test service",
              fields: {},
              name: "turn_on",
              response: { optional: true },
            },
          },
        },
      ];

      await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
        mock_assistant.services.loadFixtures(mockServices);
        vi.spyOn(hass.fetch, "listServices").mockImplementation(async () => mockServices);

        const spy = vi
          .spyOn(hass.socket, "sendMessage")
          .mockImplementation(async () => ({ response: { success: true } }));

        lifecycle.onReady(async () => {
          await hass.call.switch.turn_on({ entity_id: "switch.bedroom_lamp" });

          expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
              domain: "switch",
              return_response: true,
              service: "turn_on",
              type: "call_service",
            }),
            true,
          );
        });
      });
    });

    it("should return response when service returns a response", async () => {
      expect.assertions(1);
      const mockServices: HassServiceDTO[] = [
        {
          domain: "switch",
          services: {
            turn_on: {
              description: "Test service",
              fields: {},
              name: "turn_on",
              response: { optional: true },
            },
          },
        },
      ];

      await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
        mock_assistant.services.loadFixtures(mockServices);
        vi.spyOn(hass.fetch, "listServices").mockImplementation(async () => mockServices);

        const mockResponse = { data: "test_response" };
        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => ({
          response: mockResponse,
        }));

        lifecycle.onReady(async () => {
          const result = await hass.call.switch.turn_on({ entity_id: "switch.bedroom_lamp" });
          expect(result).toEqual(mockResponse);
        });
      });
    });

    it("should return undefined when service does not return a response", async () => {
      expect.assertions(1);
      const mockServices: HassServiceDTO[] = [
        {
          domain: "switch",
          services: {
            turn_on: {
              description: "Test service",
              fields: {},
              name: "turn_on",
              response: { optional: true },
            },
          },
        },
      ];

      await hassTestRunner.run(({ lifecycle, hass, mock_assistant }) => {
        mock_assistant.services.loadFixtures(mockServices);
        vi.spyOn(hass.fetch, "listServices").mockImplementation(async () => mockServices);

        vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => ({}));

        lifecycle.onReady(async () => {
          const result = await hass.call.switch.turn_on({ entity_id: "switch.bedroom_lamp" });
          expect(result).toBeUndefined();
        });
      });
    });
  });

  describe("early access", () => {
    it("should call console.trace when accessed before load with LOG_LEVEL trace", async () => {
      expect.assertions(1);
      const traceSpy = vi.spyOn(console, "trace").mockImplementation(() => {});

      await hassTestRunner.configure({ boilerplate: { LOG_LEVEL: "trace" } }).run(({ hass }) => {
        hass.call.switch;
      });
      expect(traceSpy).toHaveBeenCalledWith(`hass.call`);
    });

    it("should not log error when accessed before load with LOG_LEVEL not trace", async () => {
      expect.assertions(2);
      await hassTestRunner
        .configure({ boilerplate: { LOG_LEVEL: "warn" } })
        .run(({ lifecycle, hass, internal }) => {
          const logger = internal.boilerplate.logger.getBaseLogger();
          const errorSpy = vi.spyOn(logger, "error").mockImplementation(() => {});
          const traceSpy = vi.spyOn(console, "trace").mockImplementation(() => {});

          // Access hass.call in onPreInit, which runs before onBootstrap (where services load)
          hass.call.switch;

          lifecycle.onReady(() => {
            expect(errorSpy).not.toHaveBeenCalled();
            expect(traceSpy).not.toHaveBeenCalled();
          });
        });
    });
  });

  describe("proxy methods", () => {
    it("should return true for has when domain exists", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          expect("switch" in hass.call).toBe(true);
        });
      });
    });

    it("should return false for has when domain does not exist", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          expect("nonexistent_domain" in hass.call).toBe(false);
        });
      });
    });

    it("should return ownKeys with all domain keys", async () => {
      expect.assertions(2);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          const keys = Object.keys(hass.call);
          expect(keys).toContain("switch");
          expect(keys.length).toBeGreaterThan(0);
        });
      });
    });

    it("should return false when trying to set a property", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(() => {
          try {
            // @ts-expect-error testing
            hass.call.test_domain = {};
          } catch {
            // Some environments throw, others return false
          }
          // Verify the property was not set
          expect("test_domain" in hass.call).toBe(false);
        });
      });
    });
  });
});
