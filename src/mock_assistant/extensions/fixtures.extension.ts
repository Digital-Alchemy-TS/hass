import {
  BootstrapException,
  InternalError,
  TServiceParams,
} from "@digital-alchemy/core";
import { existsSync, readFileSync } from "fs";

import { ScannerCacheData } from "../helpers";

const MEGA_HIGH_PRIORITY = 1000;
export function Fixtures({ hass, lifecycle, config, context }: TServiceParams) {
  let fixturesData: ScannerCacheData;

  hass.area.list = async () => fixturesData?.areas ?? [];
  hass.floor.list = async () => fixturesData?.floors ?? [];
  hass.label.list = async () => fixturesData?.labels ?? [];
  hass.device.list = async () => fixturesData?.devices ?? [];
  hass.fetch.getAllEntities = async () => fixturesData?.entities ?? [];
  hass.fetch.listServices = async () => fixturesData?.services ?? [];

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

    fixturesData = JSON.parse(readFileSync(FIXTURES_FILE, "utf8"));
  }, MEGA_HIGH_PRIORITY);
}
