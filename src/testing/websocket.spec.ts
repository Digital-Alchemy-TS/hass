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
    it("Should send the correct headers", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass, context }: TServiceParams) {
          const spy = jest
            .spyOn(hass.socket, "sendMessage")
            .mockImplementation(async () => undefined);
          lifecycle.onReady(async () => {
            hass.socket.subscribe({
              context,
              event_type: "test",
              exec: () => {},
            });
            expect(spy).toHaveBeenCalledWith(
              expect.objectContaining({
                event_type: "test",
                type: "subscribe_events",
              }),
              false,
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
