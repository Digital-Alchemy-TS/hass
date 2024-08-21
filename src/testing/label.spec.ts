import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  sleep,
  TServiceParams,
} from "@digital-alchemy/core";

import { TLabelId } from "../dynamic";
import { LABEL_REGISTRY_UPDATED, LabelDefinition } from "../helpers";
import {
  CreateTestingApplication,
  SILENT_BOOT,
} from "../mock_assistant/helpers/utils";

describe("Label", () => {
  let application: ApplicationDefinition<
    ServiceMap,
    OptionalModuleConfiguration
  >;
  const EXAMPLE_LABEL = {
    color: "accent",
    description: "test",
    icon: "mdi:brain",
    label_id: "synapse",
    name: "synapse",
  } as unknown as LabelDefinition;

  afterEach(async () => {
    if (application) {
      await application.teardown();
      application = undefined;
    }
    jest.restoreAllMocks();
  });

  describe("Lifecycle", () => {
    it("should force values to be available before ready", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(hass.socket, "sendMessage")
            .mockImplementation(async () => [EXAMPLE_LABEL]);
          lifecycle.onReady(async () => {
            await hass.label.list();
            expect(spy).toHaveBeenCalledWith(
              expect.objectContaining({ type: "config/label_registry/list" }),
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

  describe("API", () => {
    describe("Formatting", () => {
      it("should call list properly", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass }: TServiceParams) {
            const spy = jest
              .spyOn(hass.socket, "sendMessage")
              .mockImplementation(async () => []);
            lifecycle.onReady(async () => {
              await hass.label.list();
              expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ type: "config/label_registry/list" }),
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

      it("should call update properly", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass, event }: TServiceParams) {
            const spy = jest
              .spyOn(hass.socket, "sendMessage")
              .mockImplementation(async () => undefined);
            lifecycle.onReady(async () => {
              setImmediate(() => event.emit(LABEL_REGISTRY_UPDATED));
              await hass.label.update(EXAMPLE_LABEL);

              expect(spy).toHaveBeenCalledWith({
                type: "config/label_registry/update",
                ...EXAMPLE_LABEL,
              });
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

      it("should call delete properly", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass, event }: TServiceParams) {
            const spy = jest
              .spyOn(hass.socket, "sendMessage")
              .mockImplementation(async () => undefined);
            lifecycle.onReady(async () => {
              setImmediate(() => event.emit(LABEL_REGISTRY_UPDATED));
              await hass.label.delete(EXAMPLE_LABEL.label_id);

              expect(spy).toHaveBeenCalledWith({
                label_id: "synapse",
                type: "config/label_registry/delete",
              });
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

      it("should call create properly", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass, event }: TServiceParams) {
            const spy = jest
              .spyOn(hass.socket, "sendMessage")
              .mockImplementation(async () => undefined);
            lifecycle.onReady(async () => {
              setImmediate(() => event.emit(LABEL_REGISTRY_UPDATED));
              await hass.label.create(EXAMPLE_LABEL);

              expect(spy).toHaveBeenCalledWith({
                type: "config/label_registry/create",
                ...EXAMPLE_LABEL,
              });
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

    describe("Order of operations", () => {
      it("should wait for an update before returning when updating", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass, event }: TServiceParams) {
            jest
              .spyOn(hass.socket, "sendMessage")
              .mockImplementation(async () => undefined);
            lifecycle.onReady(async () => {
              const response = hass.label.update(EXAMPLE_LABEL);
              let order = "";
              setTimeout(() => {
                order += "a";
                event.emit(LABEL_REGISTRY_UPDATED);
              }, 5);
              await response;
              order += "b";
              expect(order).toEqual("ab");
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

      it("should debounce updates properly", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass }: TServiceParams) {
            jest
              .spyOn(hass.socket, "sendMessage")
              .mockImplementation(async () => undefined);
            let counter = 0;
            hass.events.onLabelRegistryUpdate(() => counter++);
            lifecycle.onReady(async () => {
              setImmediate(async () => {
                hass.socket.socketEvents.emit("label_registry_updated");
                await sleep(5);
                hass.socket.socketEvents.emit("label_registry_updated");
                await sleep(5);
                hass.socket.socketEvents.emit("label_registry_updated");
                await sleep(75);
                hass.socket.socketEvents.emit("label_registry_updated");
              });
              await sleep(200);
              expect(counter).toBe(2);
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

      it("should wait for an update before returning when deleting", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass, event }: TServiceParams) {
            jest
              .spyOn(hass.socket, "sendMessage")
              .mockImplementation(async () => undefined);
            lifecycle.onReady(async () => {
              const response = hass.label.delete("example_label" as TLabelId);
              let order = "";
              setTimeout(() => {
                order += "a";
                event.emit(LABEL_REGISTRY_UPDATED);
              }, 5);
              await response;
              order += "b";
              expect(order).toEqual("ab");
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

      it("should wait for an update before returning when creating", async () => {
        expect.assertions(1);
        application = CreateTestingApplication({
          Test({ lifecycle, hass, event }: TServiceParams) {
            jest
              .spyOn(hass.socket, "sendMessage")
              .mockImplementation(async () => undefined);
            lifecycle.onReady(async () => {
              const response = hass.label.create(EXAMPLE_LABEL);
              let order = "";
              setTimeout(() => {
                order += "a";
                event.emit(LABEL_REGISTRY_UPDATED);
              }, 5);
              await response;
              order += "b";
              expect(order).toEqual("ab");
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
});
