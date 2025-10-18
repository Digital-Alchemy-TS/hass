import type { TBlackHole, TServiceParams } from "@digital-alchemy/core";
import { START } from "@digital-alchemy/core";
import EventEmitter from "events";
import type { PartialDeep, WritableDeep } from "type-fest";
import type WS from "ws";

import type { SocketMessageDTO } from "../../helpers/index.mts";

const CONNECTION_CLOSED = 0;
// const CONNECTION_OPEN = 1;
// const CONNECTION_FAILED = 2;
const UNLIMITED = 0;

export const INTERNAL_MESSAGE = "INTERNAL_MESSAGE";

export function MockWebsocketAPI({ hass, config, lifecycle }: TServiceParams) {
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
    setImmediate(() => {
      if (!config.mock_assistant.PASS_AUTH) {
        return;
      }
      sendMessage({ type: "auth_ok" });
    });
    return connection;
  };

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
        setImmediate(() => {
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
    setImmediate(() => {
      connection.emit("message", JSON.stringify(data));
    });
  }

  return {
    connection: connection as WS,
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
