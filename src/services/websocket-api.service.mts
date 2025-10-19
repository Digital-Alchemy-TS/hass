import type { TBlackHole, TServiceParams } from "@digital-alchemy/core";
import { InternalError, SECOND, sleep, START } from "@digital-alchemy/core";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import EventEmitter from "events";
import type { EmptyObject } from "type-fest";
import WS from "ws";

import type {
  ConnectionState,
  EntityUpdateEvent,
  HassWebsocketAPI,
  OnHassEventOptions,
  SocketMessageDTO,
  SocketSubscribeOptions,
} from "../index.mts";

const CONNECTION_OPEN = 1;
const CLEANUP_INTERVAL = 5;
const UNLIMITED = 0;
const CONNECTION_FAILED = 2;
let messageCount = START;
export const SOCKET_CONNECTED = "SOCKET_CONNECTED";

type WaitingMap = Map<
  number,
  {
    sent: unknown;
    callback: (result: unknown) => TBlackHole;
  }
>;

type MessageHandlerMap = Map<string, Array<(message: { type: string }) => TBlackHole>>;

export function WebsocketAPI({
  context,
  event,
  hass,
  config,
  internal,
  lifecycle,
  logger,
  scheduler,
}: TServiceParams): HassWebsocketAPI {
  const { is } = internal.utils;

  /**
   * Local attachment points for socket events
   */
  const socketEvents = new EventEmitter();
  socketEvents.setMaxListeners(UNLIMITED);

  let MESSAGE_TIMESTAMPS: number[] = [];
  let onSocketReady: () => void;
  const waitingCallback: WaitingMap = new Map();
  const messageHandlers: MessageHandlerMap = new Map();
  const isOld = (date: Dayjs) =>
    is.undefined(date) || date.diff(dayjs(), "s") >= config.hass.RETRY_INTERVAL;

  // Start the socket
  lifecycle.onBootstrap(async () => {
    logger.debug({ name: "onBootstrap" }, `auto starting connection`);
    await manageConnection();
    hass.socket.attachScheduledFunctions();
  });

  let lastReceivedMessage: Dayjs;
  let pingSleep: ReturnType<typeof sleep>;
  let lastConnectAttempt: Dayjs;
  let lastPingAttempt: Dayjs;

  // #MARK: setConnectionState
  function setConnectionState(state: ConnectionState) {
    hass.socket.connectionState = state;
    hass.diagnostics.websocket?.set_connection_state.publish({ state });
  }

  // #MARK: handleUnknownConnectionState
  async function handleUnknownConnectionState() {
    const now = dayjs();
    const name = handleUnknownConnectionState;
    const threshold = config.hass.RETRY_INTERVAL * CONNECTION_FAILED;
    if (!isOld(lastPingAttempt)) {
      // if we very recently attempted a ping, do nothing
      return;
    }
    // send a ping message to force a pong
    logger.trace({ name }, `emitting ping`);
    lastPingAttempt = now;
    hass.diagnostics.websocket?.send_ping.publish({});

    // emit a ping, do not wait for reply (inline)
    hass.socket.sendMessage({ type: "ping" }, false);

    // reply will be captured by this, waiting at most a second
    pingSleep = sleep(SECOND);
    await pingSleep;
    pingSleep = undefined;

    if (!isOld(lastReceivedMessage)) {
      // received a least a pong
      hass.socket.setConnectionState("connected");
      logger.trace({ name }, `still there {unknown} => {connected}`);
      return;
    }

    // 😨 hass didn't reply
    if (lastReceivedMessage.diff(now, "s") < threshold) {
      // take a deep breath, and try again
      logger.warn({ name }, "failed to receive expected {pong}");
      return;
    }
    hass.diagnostics.websocket?.failed_ping.publish({});
    // 🪦 oof, get rid of the current connection and try again
    await hass.socket.teardown();
    logger.warn({ name }, "hass stopped replying {unknown} => {offline}");
  }

  // #MARK: ManageConnection
  async function manageConnection() {
    const now = dayjs();
    const name = manageConnection;
    switch (hass.socket.connectionState) {
      // * connected
      case "connected": {
        if (!isOld(lastReceivedMessage)) {
          // if hass is actively sending messages, don't do anything
          return;
        }
        // 🦗 haven't heard from hass in a while
        hass.socket.setConnectionState("unknown");
        logger.trace({ name }, "no replies in a while {connected} => {unknown}");
      }

      // * unknown
      // fall through
      case "unknown": {
        await handleUnknownConnectionState();
        return;
      }

      // * connecting
      case "connecting": {
        if (!isOld(lastConnectAttempt)) {
          // schedule happened in the middle of a connect attempt
          // weird but possible
          return;
        }
        // connect probably stalled somewhere
        // maybe we tried to connect before hass was actually ready for an incoming connection?
        //
        // reset and try again
        await hass.socket.teardown();
        logger.warn({ name }, "connection failed {connecting} => {offline}");
        await manageConnection();
        return;
      }

      // fall through
      case "offline": {
        // ### offline
        // * connection identifies as offline, let's attempt to fix that
        messageCount = START;
        lastConnectAttempt = now;
        hass.socket.setConnectionState("connecting");
        logger.debug({ name }, "initializing new socket {offline} => {connecting}");
        try {
          await hass.socket.init();
          hass.socket.setConnectionState("connected");
          logger.debug({ name }, "auth success {connecting} => {connected}");
        } catch (error) {
          logger.error({ error, name }, "init failed {connecting} => {offline}");
          await hass.socket.teardown();
        }
        return;
      }

      case "invalid": {
        // ### error
        logger.error({ name }, "socket received error, check credentials and restart application");
        return;
      }
    }
  }

  // #MARK: attachScheduledFunctions
  function attachScheduledFunctions() {
    logger.trace({ name: attachScheduledFunctions }, `attaching interval schedules`);
    scheduler.setInterval(
      async () => await manageConnection(),
      config.hass.RETRY_INTERVAL * SECOND,
    );
    scheduler.setInterval(() => {
      const target = Date.now() - SECOND * config.hass.SOCKET_AVG_DURATION;
      MESSAGE_TIMESTAMPS = MESSAGE_TIMESTAMPS.filter(time => time > target);
    }, CLEANUP_INTERVAL * SECOND);
  }

  lifecycle.onShutdownStart(async () => {
    logger.debug({ name: "onShutdownStart" }, `shutdown - tearing down connection`);
    await hass.socket.teardown();
    socketEvents.removeAllListeners();
  });

  // #MARK: teardown
  async function teardown() {
    if (!hass.socket.connection) {
      return;
    }
    if (hass.socket.connection.readyState === CONNECTION_OPEN) {
      logger.debug({ name: teardown }, `closing current connection`);
      hass.socket.connection.close();
    }
    hass.socket.connection = undefined;
    hass.socket.setConnectionState("offline");
  }

  // #MARK: fireEvent
  async function fireEvent(event_type: string, event_data: object = {}) {
    const result = await hass.socket.sendMessage({
      event_data,
      event_type,
      type: "fire_event",
    });
    hass.diagnostics.websocket?.fire_event.publish({ event_data, event_type, result });
    return result;
  }

  // #MARK: sendMessage
  async function sendMessage<RESPONSE_VALUE extends unknown = unknown>(
    data: {
      type: string;
      id?: number;
      [key: string]: unknown;
    },
    waitForResponse = true,
    subscription?: () => void,
  ): Promise<RESPONSE_VALUE> {
    if (hass.socket.connectionState === "offline") {
      logger.error({ name: sendMessage }, "socket is closed, cannot send message");
      return undefined;
    }

    if (hass.socket.pauseMessages && data.type !== "ping") {
      return undefined;
    }
    countMessage();
    const id = messageCount;
    if (data.type !== "auth") {
      data.id = id;
    }
    hass.diagnostics.websocket?.send_message.publish({ data, waitForResponse });
    const json = JSON.stringify(data);
    const sentAt = new Date();

    // ? not defined for unit tests
    hass.socket.connection?.send(json);
    if (subscription) {
      return data.id as RESPONSE_VALUE;
    }
    if (!waitForResponse) {
      return undefined;
    }
    return await new Promise<RESPONSE_VALUE>(async done => {
      waitingCallback.set(id, {
        callback: done as (result: unknown) => TBlackHole,
        sent: data,
      });
      await hass.socket.waitForReply(id, data, sentAt);
    });
  }

  async function waitForReply(id: number, data: object, sentAt: Date) {
    await sleep(config.hass.EXPECT_RESPONSE_AFTER * SECOND);
    if (!waitingCallback.has(id)) {
      return;
    }
    const { sent } = waitingCallback.get(id);
    // this could happen around dropped connections, or a number of other reasons
    //
    // discard the promise so whatever flow is depending on this can get garbage collected
    waitingCallback.delete(id);
    hass.diagnostics.websocket?.missed_reply.publish({ data, sentAt });
    logger.warn(
      {
        message: data,
        name: waitForReply,
        sent,
        sentAt: internal.utils.relativeDate(sentAt),
      },
      `sent message, did not receive reply`,
    );
  }

  // #MARK: registerMessageHandler
  function registerMessageHandler<T extends { type: string }>(
    type: string,
    callback: (message: T) => TBlackHole,
  ) {
    if (!messageHandlers.has(type)) {
      messageHandlers.set(type, []);
    }
    messageHandlers.get(type)!.push(callback as (message: { type: string }) => TBlackHole);
  }

  // #MARK: countMessage
  function countMessage(): void | never {
    messageCount++;
    const now = Date.now();
    MESSAGE_TIMESTAMPS.push(now);
    const avgWindow = config.hass.SOCKET_AVG_DURATION;

    const perSecondAverage = Math.ceil(
      MESSAGE_TIMESTAMPS.filter(time => time > now - SECOND * avgWindow).length / avgWindow,
    );

    const { SOCKET_CRASH_REQUESTS_PER_SEC: crashCount, SOCKET_WARN_REQUESTS_PER_SEC: warnCount } =
      config.hass;

    if (perSecondAverage > crashCount) {
      logger.fatal(
        { name: countMessage },
        `exceeded {CRASH_REQUESTS_PER_MIN} ([%s]) threshold`,
        crashCount,
      );
      process.exit();
    }
    if (perSecondAverage > warnCount) {
      logger.warn(
        { name: countMessage },
        `message traffic [%s] > [%s] > [%s]`,
        crashCount,
        perSecondAverage,
        warnCount,
      );
    }
  }

  // #MARK: getUrl
  function getUrl() {
    const url = new URL(config.hass.BASE_URL);
    const protocol = url.protocol === `http:` ? `ws:` : `wss:`;
    const path = url.pathname === "/" ? "" : url.pathname;
    const port = url.port ? `:${url.port}` : "";
    return `${protocol}//${url.hostname}${port}${path}/api/websocket`;
  }

  // #MARK: init
  async function init(): Promise<void> {
    if (hass.socket.connection) {
      throw new InternalError(
        context,
        "ExistingConnection",
        `Destroy the current connection before creating a new one`,
      );
    }
    messageCount = START;
    const url = getUrl();
    try {
      hass.socket.connection = hass.socket.createConnection(url);
      hass.socket.connection.on("message", async (message: string) => {
        try {
          lastReceivedMessage = dayjs();
          const data = JSON.parse(message.toString());
          await onMessage(data);
          pingSleep?.kill("continue");
        } catch (error) {
          // My expectation is `internal.safeExec` should trap any application errors
          // This try/catch should actually be excessive
          // If this error happens, something weird is happening
          logger.error(
            { error, name: init },
            `💣 error bubbled up from websocket message event handler`,
          );
        }
      });

      hass.socket.connection.on("error", async (error: Error) => {
        logger.error({ error: error, name: init }, "socket error");
        if (hass.socket.connectionState === "connected") {
          hass.socket.setConnectionState("unknown");
        }
      });

      hass.socket.connection.on("close", async (code, reason) => {
        if (!config.boilerplate.IS_TEST) {
          logger.warn({ code, name: init, reason: reason.toString() }, "connection closed");
        }
        await hass.socket.teardown();
      });

      await new Promise<void>(done => (onSocketReady = done));
    } catch (error) {
      logger.error({ error, name: init, url }, `initConnection error`);
      hass.socket.setConnectionState("offline");
    }
  }

  // #MARK: onMessage
  /**
   * Called on incoming message.
   * Intended to interpret the basic concept of the message,
   * and route it to the correct callback / global channel / etc
   *
   * ## auth_required
   * Hello message from server, should reply back with an auth msg
   * ## auth_ok
   * Follow up with a request to receive all events, and request a current state listing
   * ## event
   * Something updated it's state
   * ## pong
   * Reply to outgoing ping()
   * ## result
   * Response to an outgoing emit
   */
  async function onMessage(message: SocketMessageDTO) {
    setImmediate(() => hass.diagnostics.websocket?.message_received.publish({ message }));

    const handlers = messageHandlers.get(message.type);
    if (is.empty(handlers)) {
      logger.error(`unknown websocket message type: ${message.type}`);
      return;
    }

    // Execute all registered handlers for this message type
    for (const handler of handlers) {
      await handler(message as { type: string });
    }
  }

  // #MARK: onMessageEvent
  function onMessageEvent(id: number, message: SocketMessageDTO) {
    if (message.event.event_type === "state_changed") {
      const { new_state, old_state } = message.event.data;
      const id = new_state?.entity_id || old_state.entity_id;
      if (is.empty(id)) {
        throw new InternalError(
          context,
          "NO_ID",
          "Received state change, but could not identify an entity_id",
        );
      }
      // ? null = deleted entity
      // TODO: handle renames properly
      if (new_state || new_state === null) {
        hass.entity._entityUpdateReceiver(id, new_state, old_state);
      } else {
        // FIXME: probably removal / rename?
        // It's an edge case for sure, and not positive this code should handle it
        // If you have thoughts, chime in somewhere and we can do more sane things
        logger.debug(
          { message, name: onMessageEvent },
          `no new state for entity, what caused this?`,
        );
        return;
      }
    }

    if (hass.socket.pauseMessages) {
      return;
    }
    if (waitingCallback.has(id)) {
      const { callback } = waitingCallback.get(id);
      waitingCallback.delete(id);
      callback(message.event.result);
    }
    socketEvents.emit(message.event.event_type, message.event);
  }

  function onMessageResult(id: number, message: SocketMessageDTO) {
    if (waitingCallback.has(id)) {
      const { callback, sent } = waitingCallback.get(id);
      waitingCallback.delete(id);
      if (message.error) {
        logger.error({ message, name: "onMessageResult", sent }, "message result error");
        return;
      }
      callback(message.result);
    }
  }

  // #MARK: onEvent
  function onEvent<DATA extends object>({ context, event, once, exec }: OnHassEventOptions<DATA>) {
    logger.trace({ context, event, name: onEvent }, `attaching socket event listener`);
    const callback = async (data: EntityUpdateEvent) => {
      await internal.safeExec(async () => await exec(data as DATA));
    };
    if (once) {
      socketEvents.once(event, callback);
    } else {
      socketEvents.on(event, callback);
    }
    return internal.removeFn(() => {
      logger.trace({ context, event, name: onEvent }, `removing socket event listener`);
      socketEvents.removeListener(event, callback);
    });
  }

  // #MARK: subscribe
  async function subscribe<
    EVENT extends string,
    PAYLOAD extends Record<string, unknown> = EmptyObject,
  >({ event_type, context, exec }: SocketSubscribeOptions<EVENT, PAYLOAD>) {
    await hass.socket.sendMessage({ event_type, type: "subscribe_events" });
    return hass.socket.onEvent({
      context,
      event: event_type,
      exec,
    });
  }

  // #MARK: onConnect
  function onConnect(callback: () => TBlackHole) {
    const wrapped = async () => {
      await internal.safeExec(async () => await callback());
    };
    if (hass.socket.connectionState === "connected") {
      logger.debug(
        { name: "onConnect" },
        `added callback after socket was already connected, running immediately`,
      );
      setImmediate(wrapped);
      // attach anyways, for restarts or whatever
    }
    event.on(SOCKET_CONNECTED, wrapped);
    return internal.removeFn(() => event.removeListener(SOCKET_CONNECTED, wrapped));
  }

  lifecycle.onPreInit(() => {
    // Register all current message handlers
    hass.socket.registerMessageHandler("auth_required", async (_message: SocketMessageDTO) => {
      logger.trace({ name: onMessage }, `sending authentication`);
      void hass.socket.sendMessage({ access_token: config.hass.TOKEN, type: "auth" }, false);
    });

    hass.socket.registerMessageHandler("auth_ok", async (_message: SocketMessageDTO) => {
      // * Flag as valid connection
      logger.trace({ name: onMessage }, `event subscriptions starting`);
      await hass.socket.sendMessage({ type: "subscribe_events" }, false);
      onSocketReady?.();
      event.emit(SOCKET_CONNECTED);
    });

    hass.socket.registerMessageHandler("event", async (message: SocketMessageDTO) => {
      const id = Number(message.id);
      return await onMessageEvent(id, message);
    });

    hass.socket.registerMessageHandler("pong", async (_message: SocketMessageDTO) => {
      // nothing in particular needs to be done, just don't log an error (default)
    });

    hass.socket.registerMessageHandler("result", async (message: SocketMessageDTO) => {
      const id = Number(message.id);
      return await onMessageResult(id, message);
    });

    hass.socket.registerMessageHandler("auth_invalid", async (message: SocketMessageDTO) => {
      hass.socket.setConnectionState("invalid");
      logger.fatal({ message, name: onMessage }, "received auth invalid {connecting} => {invalid}");
      // ? If you have a use case for making this exit configurable, open a ticket
      process.exit();
    });
  });

  // #MARK: return object
  return {
    attachScheduledFunctions,
    connection: undefined as WS,
    connectionState: "offline" as ConnectionState,
    createConnection: (url: string) => new WS(url),
    fireEvent,
    init,
    onConnect,
    onEvent,
    onMessage,
    pauseMessages: false,
    registerMessageHandler,
    sendMessage,
    setConnectionState,
    socketEvents,
    subscribe,
    teardown,
    waitForReply,
  };
}
