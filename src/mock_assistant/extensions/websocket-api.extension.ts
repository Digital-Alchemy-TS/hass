/* eslint-disable unicorn/consistent-function-scoping */
import EventEmitter from "events";

import { WebsocketAPI } from "../..";

export function MockWebsocketAPI(): ReturnType<typeof WebsocketAPI> {
  const noop = () => {};
  const asyncNoop = async () => {};
  const socketEvents = new EventEmitter();

  const sendMessage = async <T>() => undefined as T;
  return {
    connectionState: "offline",
    fireEvent: asyncNoop,
    init: asyncNoop,
    onConnect: noop,
    onEvent: () => noop,
    onMessage: asyncNoop,
    pauseMessages: false,
    sendMessage,
    setConnectionState: noop,
    socketEvents,
    subscribe: asyncNoop,
    teardown: asyncNoop,
  };
}
