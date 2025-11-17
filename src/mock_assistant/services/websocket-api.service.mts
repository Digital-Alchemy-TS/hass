import type { TBlackHole, TServiceParams } from "@digital-alchemy/core";
import { START } from "@digital-alchemy/core";
import EventEmitter from "events";
import type { PartialDeep, WritableDeep } from "type-fest";
import type WS from "ws";

import type { SocketMessageDTO } from "../../helpers/index.mts";
import { SOCKET_CONNECTED } from "../../services/websocket-api.service.mts";

const CONNECTION_CLOSED = 0;
// const CONNECTION_OPEN = 1;
// const CONNECTION_FAILED = 2;
const UNLIMITED = 0;

export const INTERNAL_MESSAGE = "INTERNAL_MESSAGE";

export function MockWebsocketAPI({ hass, config, lifecycle, event }: TServiceParams) {
  const connection = new EventEmitter() as WritableDeep<WS>;
  connection.setMaxListeners(UNLIMITED);
  lifecycle.onShutdownStart(() => {
    connection.removeAllListeners();
  });

  connection.readyState = CONNECTION_CLOSED;
  let id = START;
  connection.close = () => {
    connection.readyState = CONNECTION_CLOSED;
  };
  // connection.send = (...data) =>

  hass.socket.createConnection = () => {
    // Use Promise.resolve().then() instead of setImmediate for better compatibility with fake timers
    Promise.resolve().then(() => {
      if (!config.mock_assistant.PASS_AUTH) {
        return;
      }
      sendMessage({ type: "auth_ok" });
    });
    return connection;
  };

  // Mock init - resolves immediately for tests
  // The real service's init() waits for onSocketReady, but in tests we don't need that
  async function init(): Promise<void> {
    if (hass.socket.connection) {
      return;
    }
    hass.socket.connection = hass.socket.createConnection("");
    hass.socket.setConnectionState("connecting");

    // Set up message handler - the real service's handlers registered in onPreInit
    // will process messages via registerMessageHandler
    connection.on("message", async (message: string) => {
      try {
        JSON.parse(message.toString());
        // Real service's handlers will process this via onMessage/registerMessageHandler
      } catch {
        // Ignore parse errors
      }
    });

    // In tests, we can resolve immediately without waiting for real socket handshake
    // The real service's onBootstrap calls this, and it needs to complete for lifecycle to progress
    hass.socket.setConnectionState("connected");

    // Emit auth_ok to trigger the real service's handlers (registered in onPreInit)
    // This allows the real service's auth_ok handler to run and do its setup
    if (config.mock_assistant.PASS_AUTH) {
      // Use microtask to ensure handlers are registered first
      await Promise.resolve();
      sendMessage({ type: "auth_ok" });
      event.emit(SOCKET_CONNECTED);
    }
  }

  connection.send = (data: string) => {
    const payload = JSON.parse(data) as { type: string; id: number };
    connection.emit(INTERNAL_MESSAGE, payload);
    switch (payload.type) {
      case "ping": {
        sendMessage({ id: id++, type: "pong" });
        return;
      }
      case "auth": {
        return;
      }
      default: {
        Promise.resolve().then(() => {
          sendMessage({
            id: payload.id,
            result: null,
            type: "result",
          });
        });
      }
    }
  };

  function sendMessage(data: PartialDeep<SocketMessageDTO>) {
    // Use Promise.resolve() instead of setImmediate for better fake timer compatibility
    Promise.resolve().then(() => {
      connection.emit("message", JSON.stringify(data));
    });
  }

  return {
    attachScheduledFunctions: () => {
      // Mock implementation - no-op for tests
      // The real websocket service sets up intervals here, but we don't need them in tests
    },
    connection: connection as WS,
    init,
    onMessage<DATA extends object>(
      type: string,
      callback: (data: DATA & MessageData) => TBlackHole,
    ) {
      connection.on(INTERNAL_MESSAGE, (data: DATA & MessageData) => {
        if (data.type === type) {
          callback(data as DATA & MessageData);
        }
      });
    },
    sendMessage,
  };
}

type MessageData = { id: number; type: string };
