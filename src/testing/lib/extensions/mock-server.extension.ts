import { is, TServiceParams } from "@digital-alchemy/core";
import { createServer } from "http";
import { Server, WebSocket } from "ws";

import { HassTestLifecycle } from "../helpers/lifecycle";

async function getFreePort(): Promise<number> {
  return new Promise(done => {
    const server = createServer();
    server.listen(undefined, () => {
      const address = server.address();
      if (is.string(address)) {
        return;
      }
      server.close(() => done(address.port));
    });
  });
}

export function MockServer({ internal, logger, lifecycle }: TServiceParams) {
  let server: Server;
  let port: number;
  let last: WebSocket;

  lifecycle.onPreInit(async () => {
    //
  }, HassTestLifecycle.setupMockServer);

  async function nextReply<T>() {
    return await new Promise<T>(done => {
      last.once("message", response => {
        setImmediate(() => done(JSON.parse(response.toString())));
      });
    });
  }

  async function Init() {
    port = await getFreePort();
    logger.info({ port }, `setting up mock server`);
    internal.boilerplate.configuration.set(
      "hass",
      "BASE_URL",
      `http://localhost:${port}`,
    );
    internal.boilerplate.configuration.set(
      "hass",
      "BASE_URL",
      `http://localhost:${port}`,
    );
    server = new Server({ port });

    server.on("connection", connection => {
      last = connection;
      logger.debug(`incoming connection`);
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
    quickAuth,
    respond,
    sendAuthOk,
    sendAuthRequired,
  };
  return mock;
}
