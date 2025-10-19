import { hassTestRunner } from "../mock_assistant/index.mts";

describe("Websocket", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  describe("API Interactions", () => {
    it("should emit events onConnect", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        let hit = false;
        hass.socket.onConnect(() => (hit = true));
        lifecycle.onReady(() => {
          expect(hit).toBe(true);
        });
      });
    });

    it("should emit a socket message with subscribeEvents", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass, context }) => {
        const spy = vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const spy = vi.spyOn(hass.socket, "sendMessage").mockImplementation(async () => undefined);
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

  describe("Message Handler Registration", () => {
    it("should register and execute message handlers", async () => {
      expect.assertions(4);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        let handler1Called = false;
        let handler2Called = false;

        hass.socket.registerMessageHandler("test_message", async message => {
          handler1Called = true;
          expect(message.type).toBe("test_message");
        });

        hass.socket.registerMessageHandler("test_message", async message => {
          handler2Called = true;
          expect(message.type).toBe("test_message");
        });

        lifecycle.onReady(async () => {
          await hass.socket.onMessage({
            data: { test: "data" },
            id: 1,
            type: "test_message",
          });

          expect(handler1Called).toBe(true);
          expect(handler2Called).toBe(true);
        });
      });
    });

    it("should handle generic message types", async () => {
      expect.assertions(2);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        interface CustomMessage {
          type: string;
          customProperty: string;
          id: number;
        }

        let handlerCalled = false;

        hass.socket.registerMessageHandler<CustomMessage>("custom_type", async message => {
          handlerCalled = true;
          expect(message.customProperty).toBe("test_value");
        });

        lifecycle.onReady(async () => {
          await hass.socket.onMessage({
            customProperty: "test_value",
            id: 1,
            type: "custom_type",
          });

          expect(handlerCalled).toBe(true);
        });
      });
    });

    it("should handle unknown message types gracefully", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        let errorOccurred = false;

        lifecycle.onReady(async () => {
          try {
            // Use a message type that definitely won't have handlers and won't trigger auth flow
            await hass.socket.onMessage({
              id: 1,
              type: "completely_unknown_type_12345",
            });
          } catch {
            errorOccurred = true;
          }

          // The function should complete without throwing an error
          expect(errorOccurred).toBe(false);
        });
      });
    });

    it("should execute multiple handlers for the same message type", async () => {
      expect.assertions(4);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        const executionOrder: string[] = [];

        hass.socket.registerMessageHandler("multi_handler", async message => {
          executionOrder.push("first");
          expect(message.type).toBe("multi_handler");
        });

        hass.socket.registerMessageHandler("multi_handler", async message => {
          executionOrder.push("second");
          expect(message.type).toBe("multi_handler");
        });

        hass.socket.registerMessageHandler("multi_handler", async message => {
          executionOrder.push("third");
          expect(message.type).toBe("multi_handler");
        });

        lifecycle.onReady(async () => {
          await hass.socket.onMessage({
            id: 1,
            type: "multi_handler",
          });

          expect(executionOrder).toEqual(["first", "second", "third"]);
        });
      });
    });

    it("should handle async handlers correctly", async () => {
      expect.assertions(2);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        let asyncHandlerCompleted = false;

        hass.socket.registerMessageHandler("async_test", async message => {
          await new Promise(resolve => setTimeout(resolve, 10));
          asyncHandlerCompleted = true;
          expect(message.type).toBe("async_test");
        });

        lifecycle.onReady(async () => {
          await hass.socket.onMessage({
            id: 1,
            type: "async_test",
          });

          expect(asyncHandlerCompleted).toBe(true);
        });
      });
    });

    it("should work with existing message types", async () => {
      expect.assertions(2);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        let customAuthHandlerCalled = false;

        // Register an additional handler for auth_required
        hass.socket.registerMessageHandler("auth_required", async message => {
          customAuthHandlerCalled = true;
          expect(message.type).toBe("auth_required");
        });

        lifecycle.onReady(async () => {
          await hass.socket.onMessage({
            id: 1,
            type: "auth_required",
          });

          expect(customAuthHandlerCalled).toBe(true);
        });
      });
    });
  });
});
