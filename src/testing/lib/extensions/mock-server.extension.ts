/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TServiceParams } from "@digital-alchemy/core";
import { Server, WebSocket } from "ws";

import { getFreePort } from "..";
import { HassTestLifecycle } from "../helpers/lifecycle";

let port: number;
export function MockServer({
  internal,
  logger,
  lifecycle,
  config,
}: TServiceParams) {
  let server: Server;
  let last: WebSocket;

  lifecycle.onPreInit(async () => {
    if (config.hass_testing.CONNECT_MODE !== "server") {
      return;
    }
    logger.info("starting server");
    await Init();
    logger.info("done");
  }, HassTestLifecycle.setupMockServer);

  lifecycle.onShutdownStart(() => {
    server.close();
  }, -1);

  async function nextReply<T>() {
    return await new Promise<T>(done => {
      last.once("message", response => {
        setImmediate(() => done(JSON.parse(response.toString())));
      });
    });
  }

  async function Init() {
    port = await getFreePort();
    mock.port = port;
    logger.info({ port }, `setting up mock server`);
    server = new Server({ port });

    server.on("connection", connection => {
      last = connection;
      logger.debug(`incoming connection`);
      sendAuthOk();
    });
  }

  function respond(id: number, result: object) {
    last.send(JSON.stringify({ id, result, type: "result" }));
  }

  function sendAuthOk(): void {
    last.send(JSON.stringify({ type: "auth_ok" }));
  }

  function sendAuthRequired(): void {
    last.send(JSON.stringify({ type: "auth_required" }));
  }

  async function quickAuth() {
    last.send(JSON.stringify({ type: "auth_required" }));
    await nextReply();
    last.send(JSON.stringify({ type: "auth_ok" }));
  }

  const mock = {
    Init,
    port,
    quickAuth,
    respond,
    sendAuthOk,
    sendAuthRequired,
  };
  return mock;
}
