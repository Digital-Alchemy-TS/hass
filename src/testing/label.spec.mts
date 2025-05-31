import { subscribe } from "node:diagnostics_channel";

import { sleep } from "@digital-alchemy/core";

import { LABEL_REGISTRY_UPDATED, LabelDefinition } from "../helpers/index.mts";
import { hassTestRunner } from "../mock_assistant/index.mts";
import { TLabelId } from "../user.mts";

describe("Label", () => {
  const EXAMPLE_LABEL = {
    color: "accent",
    description: "test",
    icon: "mdi:brain",
    label_id: "synapse",
    name: "synapse",
  } as unknown as LabelDefinition;

  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  describe("Lifecycle", () => {
    it("should force values to be available before ready", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi
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
        await hassTestRunner.run(({ lifecycle, hass }) => {
          const spy = vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => []);
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
        await hassTestRunner.run(({ lifecycle, hass, event }) => {
          const spy = vi
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
        await hassTestRunner.run(({ lifecycle, hass, event }) => {
          const spy = vi
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
        await hassTestRunner.run(({ lifecycle, hass, event }) => {
          const spy = vi
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

      it("should publish diagnostics on label registry update", async () => {
        expect.assertions(1);
        hassTestRunner.configure({ hass: { EMIT_DIAGNOSTICS: true } });
        await hassTestRunner.run(({ lifecycle, hass }) => {
          vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
          const spy = vi.fn();
          subscribe(hass.diagnostics.label.registry_update.name, spy);
          lifecycle.onReady(async () => {
            setImmediate(async () => {
              hass.socket.socketEvents.emit("label_registry_updated");
            });
            await sleep(100);
            expect(spy).toHaveBeenCalledWith(
              expect.objectContaining({ ms: expect.any(Number) }),
              hass.diagnostics.label.registry_update.name,
            );
          });
        });
      });
    });

    describe("Order of operations", () => {
      it("should wait for an update before returning when updating", async () => {
        expect.assertions(1);
        await hassTestRunner.run(({ lifecycle, hass, event }) => {
          vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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
        await hassTestRunner.run(({ lifecycle, hass }) => {
          vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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
        await hassTestRunner.run(({ lifecycle, hass, event }) => {
          vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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
        await hassTestRunner.run(({ lifecycle, hass, event }) => {
          vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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
