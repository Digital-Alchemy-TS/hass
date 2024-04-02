import { is, TServiceParams } from "@digital-alchemy/core";

export function QuickConfiguration({
  config,
  lifecycle,
  internal,
  hass_testing,
}: TServiceParams) {
  lifecycle.onPreInit(() => {
    const { configuration } = internal.boilerplate;
    if (is.empty(config.hass.TOKEN)) {
      configuration.set("hass", "TOKEN", "BLANK");
    }
    if (
      config.hass_testing.CONNECT_MODE === "none" ||
      config.hass_testing.CONNECT_MODE === "server"
    ) {
      configuration.set("hass", "AUTO_CONNECT_SOCKET", false);
      configuration.set("hass", "AUTO_SCAN_CALL_PROXY", false);
      return;
    }
    if (config.hass_testing.CONNECT_MODE === "testing") {
      configuration.set(
        "hass",
        "BASE_URL",
        `http://localhost:${hass_testing.mock_server.port}`,
      );
    }
  });
}
function Example({ hass }: TServiceParams) {
  const entity = hass.entity.byId("binary_sensor.test");
  entity.onUpdate(() => {
    //
  });
}
