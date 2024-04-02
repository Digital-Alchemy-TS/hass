import {
  ApplicationDefinition,
  CreateApplication,
  OptionalModuleConfiguration,
  ServiceMap,
  TServiceParams,
} from "@digital-alchemy/core";

import { LIB_HASS, LIB_HASS_TESTING, SILENT_BOOT } from "..";
import { CreateTestingApplication } from "./lib/helpers/application";

describe("Websocket", () => {
  let application: ApplicationDefinition<
    ServiceMap,
    OptionalModuleConfiguration
  >;
  let host: ApplicationDefinition<ServiceMap, OptionalModuleConfiguration>;

  beforeAll(async () => {
    host = CreateApplication({
      configurationLoaders: [],
      libraries: [LIB_HASS_TESTING, LIB_HASS],
      // @ts-expect-error testing
      name: "test",
    });
    await host.bootstrap(
      SILENT_BOOT({
        hass_testing: {
          CONNECT_MODE: "server",
        },
      }),
    );
  });
  beforeEach(async () => {
    // jest.useFakeTimers();
  });
  afterAll(async () => {
    await host.teardown();
  });

  afterEach(async () => {
    if (application) {
      await application.teardown();
      application = undefined;
    }
    jest.restoreAllMocks();
    // jest.useRealTimers();
  });

  describe("Workflows", () => {
    describe("Connection State", () => {
      it("Connects and disconnects", async () => {
        expect.assertions(5);
        application = CreateTestingApplication({
          Test({ hass, lifecycle }: TServiceParams) {
            expect(hass.socket.connectionState).toBe("offline");
            lifecycle.onPreInit(() => {
              expect(hass.socket.connectionState).toBe("offline");
            }, -1);
            lifecycle.onReady(() => {
              expect(hass.socket.connectionState).toBe("connected");
            });
            lifecycle.onPreShutdown(() => {
              expect(hass.socket.connectionState).toBe("connected");
            });
            lifecycle.onShutdownComplete(() => {
              expect(hass.socket.connectionState).toBe("offline");
            });
          },
        });

        await application.bootstrap(
          SILENT_BOOT({
            hass: {
              AUTO_SCAN_CALL_PROXY: false,
              TRACK_ENTITIES: false,
            },
            hass_testing: {
              CONNECT_MODE: "testing",
            },
          }),
        );
      });

      it("Connects and disconnects3", async () => {
        expect.assertions(5);
        application = CreateApplication({
          configurationLoaders: [],
          libraries: [LIB_HASS, LIB_HASS_TESTING],
          // @ts-expect-error testing
          name: "testing",
          services: {
            Test({ hass, lifecycle }: TServiceParams) {
              expect(hass.socket.connectionState).toBe("offline");
              lifecycle.onPreInit(() => {
                expect(hass.socket.connectionState).toBe("offline");
              }, -1);
              lifecycle.onReady(() => {
                expect(hass.socket.connectionState).toBe("connected");
              });
              lifecycle.onPreShutdown(() => {
                expect(hass.socket.connectionState).toBe("connected");
              });
              lifecycle.onShutdownComplete(() => {
                expect(hass.socket.connectionState).toBe("offline");
              });
            },
          },
        });
        await application.bootstrap(
          //
          {
            configuration: {
              hass: {
                AUTO_SCAN_CALL_PROXY: false,
                TRACK_ENTITIES: false,
              },
              hass_testing: {
                CONNECT_MODE: "testing",
              },
            },
          },
        );
        console.error("HIT");
      });

      it("Connects and disconnects4", async () => {
        expect.assertions(5);
        application = CreateApplication({
          configurationLoaders: [],
          libraries: [LIB_HASS, LIB_HASS_TESTING],
          // @ts-expect-error testing
          name: "testing",
          services: {
            Test({ hass, lifecycle }: TServiceParams) {
              expect(hass.socket.connectionState).toBe("offline");
              lifecycle.onPreInit(() => {
                expect(hass.socket.connectionState).toBe("offline");
              }, -1);
              lifecycle.onReady(() => {
                expect(hass.socket.connectionState).toBe("connected");
              });
              lifecycle.onPreShutdown(() => {
                expect(hass.socket.connectionState).toBe("connected");
              });
              lifecycle.onShutdownComplete(() => {
                expect(hass.socket.connectionState).toBe("offline");
              });
            },
          },
        });
        await application.bootstrap(
          SILENT_BOOT({
            hass: {
              AUTO_SCAN_CALL_PROXY: false,
              TRACK_ENTITIES: false,
            },
            hass_testing: {
              CONNECT_MODE: "testing",
            },
          }),
        );
      });

      // it("Warns at SOCKET_WARN_REQUESTS_PER_SEC threshold", async () => {
      //   let spy: jest.SpyInstance;
      //   application = CreateApplication({
      //     libraries: [LIB_HASS, LIB_HASS_TESTING],
      //     // @ts-expect-error testing
      //     name: "testing",
      //     services: {
      //       Test({ hass, lifecycle, config, internal }: TServiceParams) {
      //         spy = jest.spyOn(
      //           internal.boilerplate.logger.getBaseLogger(),
      //           "warn",
      //         );
      //         lifecycle.onReady(() => {
      //           const limit = config.hass.SOCKET_WARN_REQUESTS_PER_SEC;
      //           for (let i = START; i <= limit; i++) {
      //             hass.socket.sendMessage({ type: "test" });
      //           }
      //           expect(hass.socket.connectionState).toBe("connected");
      //         });
      //       },
      //     },
      //   });
      //   await application.bootstrap(
      //     //
      //     {
      //       configuration: {
      //         hass: {
      //           AUTO_SCAN_CALL_PROXY: false,
      //           TRACK_ENTITIES: false,
      //         },
      //         hass_testing: {
      //           CONNECT_MODE: "testing",
      //         },
      //       },
      //     },
      //   );
      //   expect(spy).toHaveBeenCalled();
      // });
    });
  });
});
