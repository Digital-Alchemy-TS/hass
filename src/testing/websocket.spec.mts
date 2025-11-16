import { sleep } from "@digital-alchemy/core";

import { hassTestRunner } from "../mock_assistant/index.mts";

describe("Websocket", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });
  beforeEach(() => {
    hassTestRunner.emitLogs("silent");
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

  describe("Memory Leak Detection", () => {
    it("should NOT warn when subscribe is called outside onConnect", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass, logger, context }) => {
        const warnSpy = vi.spyOn(logger, "warn").mockImplementation(() => {});

        lifecycle.onReady(async () => {
          await hass.socket.subscribe({
            context,
            event_type: "test_event",
            exec: () => {},
          });

          // Should not have been called with memory leak warning
          const memoryLeakWarnings = warnSpy.mock.calls.filter(call =>
            call[1]?.toString().includes("MEMORY LEAK DETECTED"),
          );
          expect(memoryLeakWarnings.length).toBe(0);
        });
      });
    });

    it("should warn when subscribe is called inside onConnect callback", async () => {
      expect.assertions(2);
      // const customLogger = createMockLogger();
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      await hassTestRunner.emitLogs("warn").run(({ lifecycle, hass, internal, context, event }) => {
        internal.boilerplate.configuration.set("boilerplate", "LOG_LEVEL", "warn");
        lifecycle.onReady(async () => {
          // Wait for initial connection to complete
          await new Promise(resolve => setTimeout(resolve, 100));

          // Ensure socket is connected
          expect(hass.socket.connectionState).toBe("connected");

          // Register onConnect callback that subscribes (this should trigger warning)
          hass.socket.onConnect(async () => {
            await hass.socket.subscribe({
              context,
              event_type: "test_event_warn",
              exec: () => {},
            });
          });

          // Trigger onConnect by emitting SOCKET_CONNECTED event again
          event.emit("SOCKET_CONNECTED");
          await sleep(0);

          expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("MEMORY LEAK DETECTED"));
        });
      });
    });
  });

  describe("Subscription Registry", () => {
    it("should prevent duplicate subscriptions", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass, context }) => {
        const sendMessageSpy = vi
          .spyOn(hass.socket, "sendMessage")
          .mockImplementation(async () => undefined);

        lifecycle.onReady(async () => {
          // Clear spy after initial bootstrap subscriptions
          sendMessageSpy.mockClear();

          // Subscribe to the same event twice (even with same context)
          // Since registry tracks by event_type only, second subscription won't send message
          await hass.socket.subscribe({
            context,
            event_type: "duplicate_test",
            exec: () => {},
          });

          await hass.socket.subscribe({
            context,
            event_type: "duplicate_test",
            exec: () => {},
          });

          // Should only send subscribe message once (duplicate event_type is prevented)
          const subscribeCalls = sendMessageSpy.mock.calls.filter(
            call =>
              call[0]?.type === "subscribe_events" && call[0]?.event_type === "duplicate_test",
          );
          expect(subscribeCalls.length).toBe(1);
        });
      });
    });

    it("should allow different event types with same context", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass, context }) => {
        const sendMessageSpy = vi
          .spyOn(hass.socket, "sendMessage")
          .mockImplementation(async () => undefined);

        lifecycle.onReady(async () => {
          await hass.socket.subscribe({
            context,
            event_type: "event_type_1",
            exec: () => {},
          });

          await hass.socket.subscribe({
            context,
            event_type: "event_type_2",
            exec: () => {},
          });

          // Should send subscribe message for both
          const subscribeCalls = sendMessageSpy.mock.calls.filter(
            call => call[0]?.type === "subscribe_events",
          );
          expect(subscribeCalls.length).toBeGreaterThanOrEqual(2);
        });
      });
    });

    it("should re-establish subscriptions on reconnect", async () => {
      expect.assertions(2);
      await hassTestRunner.run(({ lifecycle, hass, context, event }) => {
        const sendMessageSpy = vi
          .spyOn(hass.socket, "sendMessage")
          .mockImplementation(async () => undefined);

        lifecycle.onReady(async () => {
          // Register a subscription
          await hass.socket.subscribe({
            context,
            event_type: "reconnect_test",
            exec: () => {},
          });

          // Clear the spy to only track re-establishment calls
          sendMessageSpy.mockClear();

          // Register an onConnect callback that will trigger re-establishment
          hass.socket.onConnect(async () => {
            // This callback will trigger re-establishment
          });

          // Trigger reconnect by emitting SOCKET_CONNECTED event
          event.emit("SOCKET_CONNECTED");

          // Wait for async operations
          await new Promise(resolve => setTimeout(resolve, 50));

          // Should have re-established the subscription
          const reestablishCalls = sendMessageSpy.mock.calls.filter(
            call =>
              call[0]?.type === "subscribe_events" && call[0]?.event_type === "reconnect_test",
          );
          expect(reestablishCalls.length).toBeGreaterThan(0);
          expect(sendMessageSpy).toHaveBeenCalled();
        });
      });
    });

    it("should re-establish multiple subscriptions on reconnect", async () => {
      expect.assertions(4);
      await hassTestRunner.run(({ lifecycle, hass, context, event }) => {
        const sendMessageSpy = vi
          .spyOn(hass.socket, "sendMessage")
          .mockImplementation(async () => undefined);

        lifecycle.onReady(async () => {
          // Wait for initial connection to complete
          await new Promise(resolve => setTimeout(resolve, 50));

          // Register multiple subscriptions
          await hass.socket.subscribe({
            context,
            event_type: "multi_test_1",
            exec: () => {},
          });

          await hass.socket.subscribe({
            context,
            event_type: "multi_test_2",
            exec: () => {},
          });

          await hass.socket.subscribe({
            context,
            event_type: "multi_test_3",
            exec: () => {},
          });

          // Clear the spy to only track re-establishment calls
          sendMessageSpy.mockClear();

          // Register an onConnect callback that will trigger re-establishment
          hass.socket.onConnect(async () => {
            // This callback will trigger re-establishment
          });

          // Trigger reconnect by emitting SOCKET_CONNECTED event
          event.emit("SOCKET_CONNECTED");

          // Wait for async operations
          await new Promise(resolve => setTimeout(resolve, 150));

          // Should have re-established our specific subscriptions (along with others)
          const reestablishCalls = sendMessageSpy.mock.calls.filter(
            call =>
              call[0]?.type === "subscribe_events" &&
              (call[0]?.event_type === "multi_test_1" ||
                call[0]?.event_type === "multi_test_2" ||
                call[0]?.event_type === "multi_test_3"),
          );
          // Verify each specific subscription was re-established
          expect(reestablishCalls.length).toBe(3);
          expect(reestablishCalls.some(call => call[0]?.event_type === "multi_test_1")).toBe(true);
          expect(reestablishCalls.some(call => call[0]?.event_type === "multi_test_2")).toBe(true);
          expect(reestablishCalls.some(call => call[0]?.event_type === "multi_test_3")).toBe(true);
        });
      });
    });
  });
});
