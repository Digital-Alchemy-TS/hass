import { is, TServiceParams } from "@digital-alchemy/core";

export function QuickConfiguration({
  config,
  lifecycle,
  internal,
}: TServiceParams) {
  lifecycle.onPreInit(() => {
    const { configuration } = internal.boilerplate;
    if (is.empty(config.hass.TOKEN)) {
      configuration.set("hass", "TOKEN", "BLANK");
    }
    if (config.hass_testing.CONNECT_MODE === "none") {
      configuration.set("hass", "AUTO_CONNECT_SOCKET", false);
      configuration.set("hass", "AUTO_SCAN_CALL_PROXY", false);
    }
  });
}
