import {
  BootstrapOptions,
  is,
  PartialConfiguration,
} from "@digital-alchemy/core";
import { createServer } from "http";

export const SILENT_BOOT = (
  configuration: PartialConfiguration = {},
): BootstrapOptions => ({
  configuration,
  // quiet time
  customLogger: {
    debug: () => {},
    error: () => {},
    fatal: () => {},
    info: () => {},
    trace: () => {},
    warn: () => {},
  },
});
/**
 * Find a random free port on the system
 */
export async function getFreePort(): Promise<number> {
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
