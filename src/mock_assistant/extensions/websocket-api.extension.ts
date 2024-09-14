import { START, TBlackHole, TServiceParams } from "@digital-alchemy/core";
import EventEmitter from "events";
import { WritableDeep } from "type-fest";
import WS from "ws";

import { SocketMessageDTO } from "../../helpers";

const CONNECTION_CLOSED = 0;
const CONNECTION_OPEN = 1;
const CONNECTION_FAILED = 2;

export const INTERNAL_MESSAGE = "INTERNAL_MESSAGE";

export function MockWebsocketAPI({ hass, config }: TServiceParams) {
  const connection = new EventEmitter() as WritableDeep<WS>;
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

  function sendMessage(data: Partial<SocketMessageDTO>) {
    connection.emit("message", JSON.stringify(data));
  }

  return {
    connection: connection as WS,
    onMessage(type: string, callback: (data: object) => TBlackHole) {
      connection.on(INTERNAL_MESSAGE, (data: { type: string }) => {
        if (data.type === type) {
          callback(data);
        }
      });
    },
    sendMessage,
  };
}
