import { BootstrapOptions, PartialConfiguration } from "@digital-alchemy/core";

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
