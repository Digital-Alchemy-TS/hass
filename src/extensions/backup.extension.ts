import { HALF, SECOND, sleep, TServiceParams } from "@digital-alchemy/core";

import { BackupResponse, HomeAssistantBackup } from "../helpers";

export function Backup({ logger, hass }: TServiceParams) {
  async function generate(): Promise<HomeAssistantBackup> {
    let current = await list();
    // const originalLength = current.backups.length;
    if (current.backing_up) {
      logger.warn(
        { name: generate },
        `a backup is currently in progress. Waiting for that to complete instead.`,
      );
    } else {
      logger.info({ name: generate }, "initiating new backup");
      hass.socket.sendMessage({ type: "backup/generate" });
      while (current.backing_up === false) {
        logger.debug({ name: generate }, "... waiting");
        await sleep(HALF * SECOND);
        current = await list();
      }
    }
    while (current.backing_up === true) {
      logger.debug({ name: generate }, "... waiting");
      await sleep(HALF * SECOND);
      current = await list();
    }
    logger.info({ name: generate }, `backup complete`);
    return current.backups.pop();
  }

  async function list(): Promise<BackupResponse> {
    logger.trace({ name: list }, "send");
    return await hass.socket.sendMessage<BackupResponse>({
      type: "backup/info",
    });
  }

  async function remove(slug: string): Promise<void> {
    logger.trace({ name: remove }, "send");
    await hass.socket.sendMessage({ slug, type: "backup/remove" }, false);
  }

  return { generate, list, remove };
}
