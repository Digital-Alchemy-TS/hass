import {
  ApplicationDefinition,
  LibraryTestRunner,
  ModuleConfiguration,
  TestRunner,
  TServiceParams,
} from "@digital-alchemy/core";

import { LIB_HASS } from "..";
import { HassConfig } from "../helpers";
import { LIB_MOCK_ASSISTANT } from "../mock_assistant";

declare module "@digital-alchemy/core" {
  export interface LoadedModules {
    testing_host: ApplicationDefinition<
      { Loader(PARAMS: TServiceParams): void },
      ModuleConfiguration
    >;
  }
}

describe("Websocket", () => {
  let runner: LibraryTestRunner<typeof LIB_HASS>;

  beforeEach(() => {
    runner = TestRunner({ target: LIB_HASS })
      .appendLibrary(LIB_MOCK_ASSISTANT)
      .appendService(({ hass }) => {
        jest
          .spyOn(hass.fetch, "getConfig")
          .mockImplementation(async () => ({ version: "2024.4.1" }) as HassConfig);
      });
  });

  afterEach(async () => {
    await runner.teardown();
    jest.restoreAllMocks();
  });

  describe("API Interactions", () => {
    it("should emit events onConnect", async () => {
      expect.assertions(1);
      await runner.run(({ lifecycle, hass }) => {
        let hit = false;
        hass.socket.onConnect(() => (hit = true));
        lifecycle.onReady(() => {
          expect(hit).toBe(true);
        });
      });
    });

    it("should emit a socket message with subscribeEvents", async () => {
      expect.assertions(1);
      await runner.run(({ lifecycle, hass, context }) => {
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
      });
    });

    it("should emit a socket message with fireEvent", async () => {
      expect.assertions(1);
      await runner.run(({ lifecycle, hass }) => {
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
      });
    });
  });
});
