import {
  BootstrapException,
  InternalError,
  TServiceParams,
} from "@digital-alchemy/core";
import { existsSync, readFileSync } from "fs";

import { ScannerCacheData } from "../helpers";

const MEGA_HIGH_PRIORITY = 1000;
export function Fixtures({
  hass,
  lifecycle,
  config,
  context,
  mock_assistant,
}: TServiceParams) {
  hass.area.list = async () => mock_assistant.fixtures.data?.areas ?? [];
  hass.floor.list = async () => mock_assistant.fixtures.data?.floors ?? [];
  hass.label.list = async () => mock_assistant.fixtures.data?.labels ?? [];
  hass.device.list = async () => mock_assistant.fixtures.data?.devices ?? [];
  hass.fetch.getAllEntities = async () =>
    mock_assistant.fixtures.data?.entities ?? [];
  hass.fetch.listServices = async () =>
    mock_assistant.fixtures.data?.services ?? [];

  lifecycle.onPreInit(() => {
    const { MOCK_SOCKET } = config.hass;
    const { FIXTURES_FILE } = config.mock_assistant;
    if (!MOCK_SOCKET) {
      // There needs to be a shared understanding that nobody is actually sending message traffic anywhere
      // Otherwise the mocking is gonna cause some weirdness
      throw new InternalError(
        context,
        "SOCKET_NOT_MOCKED",
        "Not for testing with live connections",
      );
    }
    if (!existsSync(FIXTURES_FILE)) {
      throw new BootstrapException(
        context,
        "MISSING_FIXTURES_FILE",
        `${FIXTURES_FILE} does not exist`,
      );
    }

    mock_assistant.fixtures.data = JSON.parse(
      readFileSync(FIXTURES_FILE, "utf8"),
    );
  }, MEGA_HIGH_PRIORITY);

  return {
    data: undefined as ScannerCacheData,
  };
}
