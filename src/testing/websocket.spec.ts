// import {
//   ApplicationDefinition,
//   CreateApplication,
//   GetApis,
//   ModuleConfiguration,
//   OptionalModuleConfiguration,
//   ServiceMap,
//   TServiceParams,
// } from "@digital-alchemy/core";

// import { LIB_HASS } from "..";
// import { CreateTestingApplication, LIB_HASS_TESTING, SILENT_BOOT } from "./lib";

// declare module "@digital-alchemy/core" {
//   export interface LoadedModules {
//     testing_host: ApplicationDefinition<
//       { Loader(PARAMS: TServiceParams): void },
//       ModuleConfiguration
//     >;
//   }
// }

// describe("Websocket", () => {
//   let application: ApplicationDefinition<
//     ServiceMap,
//     OptionalModuleConfiguration
//   >;
//   let host: ApplicationDefinition<ServiceMap, OptionalModuleConfiguration>;
//   let testing: GetApis<typeof LIB_HASS_TESTING>;

//   beforeAll(async () => {
//     // start the host server
//     host = CreateApplication({
//       configurationLoaders: [],
//       libraries: [LIB_HASS_TESTING, LIB_HASS],
//       name: "testing_host",
//       services: {
//         // pass testing reference up
//         Loader({ hass_testing }: TServiceParams) {
//           testing = hass_testing;
//         },
//       },
//     });
//     await host.bootstrap(
//       SILENT_BOOT({
//         hass_testing: { CONNECT_MODE: "server" },
//       }),
//     );
//   });

//   beforeEach(async () => {
//     // jest.useFakeTimers();
//   });

//   afterAll(async () => {
//     await host.teardown();
//   });

//   afterEach(async () => {
//     if (application) {
//       await application.teardown();
//       application = undefined;
//     }
//     jest.restoreAllMocks();
//     // jest.useRealTimers();
//   });

//   describe("Workflows", () => {
//     describe("Connection State", () => {
//       it("Connects and disconnects", async () => {
//         expect.assertions(5);
//         application = CreateTestingApplication({
//           Test({ hass, lifecycle }: TServiceParams) {
//             expect(hass.socket.connectionState).toBe("offline");
//             lifecycle.onPreInit(() => {
//               expect(hass.socket.connectionState).toBe("offline");
//             }, -1);
//             lifecycle.onReady(() => {
//               expect(hass.socket.connectionState).toBe("connected");
//             });
//             lifecycle.onPreShutdown(() => {
//               expect(hass.socket.connectionState).toBe("connected");
//             });
//             lifecycle.onShutdownComplete(() => {
//               expect(hass.socket.connectionState).toBe("offline");
//             });
//           },
//         });

//         await application.bootstrap(
//           SILENT_BOOT({
//             hass: {
//               AUTO_SCAN_CALL_PROXY: false,
//               TRACK_ENTITIES: false,
//             },
//             hass_testing: {
//               CONNECT_MODE: "testing",
//             },
//           }),
//         );
//       });
//     });
//   });
// });
