import { LibraryTestRunner, sleep, TestRunner } from "@digital-alchemy/core";

import { LIB_HASS } from "..";
import { TLabelId } from "../dynamic";
import { HassConfig, LABEL_REGISTRY_UPDATED, LabelDefinition } from "../helpers";
import { LIB_MOCK_ASSISTANT } from "../mock_assistant";

describe("Label", () => {
  const EXAMPLE_LABEL = {
    color: "accent",
    description: "test",
    icon: "mdi:brain",
    label_id: "synapse",
    name: "synapse",
  } as unknown as LabelDefinition;
  let runner: LibraryTestRunner<typeof LIB_HASS>;

  beforeEach(() => {
    runner = TestRunner({ target: LIB_HASS })
      .appendLibrary(LIB_MOCK_ASSISTANT)
      .appendService(({ hass }) => {
        jest
          .spyOn(hass.fetch, "getConfig")
          .mockImplementation(async () => ({ version: "2024.4.1" }) as HassConfig);
      })
      .configure({
        configuration: {
          hass: {
            AUTO_CONNECT_SOCKET: false,
            AUTO_SCAN_CALL_PROXY: false,
            MOCK_SOCKET: true,
          },
        },
      });
  });

  afterEach(async () => {
    await runner.teardown();
    jest.restoreAllMocks();
  });

  describe("Lifecycle", () => {
    it("should force values to be available before ready", async () => {
      expect.assertions(1);
      await runner.run(({ lifecycle, hass }) => {
        const spy = jest
          .spyOn(hass.socket, "sendMessage")
          .mockImplementation(async () => [EXAMPLE_LABEL]);
        lifecycle.onReady(async () => {
          await hass.label.list();
          expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({ type: "config/label_registry/list" }),
          );
        });
      });
    });
  });

  describe("API", () => {
    describe("Formatting", () => {
      it("should call list properly", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass }) => {
          const spy = jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => []);
          lifecycle.onReady(async () => {
            await hass.label.list();
            expect(spy).toHaveBeenCalledWith(
              expect.objectContaining({ type: "config/label_registry/list" }),
            );
          });
        });
      });

      it("should call update properly", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass, event }) => {
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
        });
      });

      it("should call delete properly", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass, event }) => {
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
        });
      });

      it("should call create properly", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass, event }) => {
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
        });
      });
    });

    describe("Order of operations", () => {
      it("should wait for an update before returning when updating", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass, event }) => {
          jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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
        });
      });

      it("should debounce updates properly", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass }) => {
          jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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
        });
      });

      it("should wait for an update before returning when deleting", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass, event }) => {
          jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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
        });
      });

      it("should wait for an update before returning when creating", async () => {
        expect.assertions(1);
        await runner.run(({ lifecycle, hass, event }) => {
          jest.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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
        });
      });
    });
  });
});
