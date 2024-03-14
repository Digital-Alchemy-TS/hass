/* eslint-disable @typescript-eslint/no-magic-numbers */
import { is, TServiceParams } from "@digital-alchemy/core";
import { env, exit } from "process";

import { PostConfigPriorities } from "..";
export function Configure({
  logger,
  lifecycle,
  hass,
  config,
  internal,
}: TServiceParams) {
  /**
   * Check for environment defined tokens provided by Home Assistant
   *
   * If available, override defaults to match
   */
  lifecycle.onPreInit(() => {
    const token = env.HASSIO_TOKEN || env.SUPERVISOR_TOKEN;
    if (is.empty(token)) {
      return;
    }
    logger.debug(
      { name: "onPreInit" },
      `auto configuring from addon environment`,
    );
    internal.config.set(
      "hass",
      "BASE_URL",
      env.HASS_SERVER || "http://supervisor/core",
    );
    internal.config.set("hass", "TOKEN", token);
  });

  /**
   * Request by someone to validate the provided credentials are valid
   *
   * Send a test request, and provide feedback on what happened
   */
  lifecycle.onPostConfig(async () => {
    if (!config.hass.VALIDATE_CONFIGURATION) {
      return;
    }
    internal.logger.setLogLevel("trace");
    logger.info({ name: "onPostConfig" }, `validating credentials`);
    try {
      const result = await hass.fetch.checkCredentials();
      if (is.object(result)) {
        // * all good
        logger.info({ name: "onPostConfig" }, result.message);
        exit(1);
      }
      // * bad token
      logger.error({ name: "onPostConfig" }, String(result));
      exit(0);
    } catch (error) {
      // * bad BASE_URL
      logger.error({ error, name: "onPostConfig" }, "failed to send request");
      exit(0);
    }
  }, PostConfigPriorities.VALIDATE);
}
