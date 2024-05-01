import {
  ApplicationDefinition,
  ModuleConfiguration,
  OptionalModuleConfiguration,
  ServiceMap,
  TServiceParams,
} from "@digital-alchemy/core";

import { CreateTestingApplication, SILENT_BOOT } from "../mock_assistant";

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    testing_host: ApplicationDefinition<
      { Loader(PARAMS: TServiceParams): void },
      ModuleConfiguration
    >;
  }
}

describe("Websocket", () => {
  let application: ApplicationDefinition<
    ServiceMap,
    OptionalModuleConfiguration
  >;

  beforeEach(async () => {
    // jest.useFakeTimers();
  });

  afterEach(async () => {
    if (application) {
      await application.teardown();
      application = undefined;
    }
    jest.restoreAllMocks();
    // jest.useRealTimers();
  });

  describe("API Interactions", () => {
    it("should emit events onConnect", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          let hit = false;
          hass.socket.onConnect(() => (hit = true));
          lifecycle.onReady(() => {
            expect(hit).toBe(true);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("should emit a socket message with subscribeEvents", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass, context }: TServiceParams) {
          const spy = jest
            .spyOn(hass.socket, "sendMessage")
            .mockImplementation(async () => undefined);
          lifecycle.onReady(async () => {
            await hass.socket.subscribe({
              context,
              event_type: "test",
              exec: () => {},
            });
            expect(spy).toHaveBeenCalledWith(
              expect.objectContaining({
                event_type: "test",
                type: "subscribe_events",
              }),
            );
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("should emit a socket message with fireEvent", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(hass.socket, "sendMessage")
            .mockImplementation(async () => undefined);
          lifecycle.onReady(async () => {
            const data = { example: "data" };
            await hass.socket.fireEvent("test_event", data);
            expect(spy).toHaveBeenCalledWith(
              expect.objectContaining({
                event_data: data,
                event_type: "test_event",
                type: "fire_event",
              }),
            );
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });
  });
});
