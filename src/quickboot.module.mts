import type { TServiceParams } from "@digital-alchemy/core";
import { CreateApplication } from "@digital-alchemy/core";

import { LIB_HASS } from "./index.mts";

/**
 * Use from the node command line to probe apis
 * Not for normal application usage
 */
export async function QuickBoot(name: string) {
  let out: TServiceParams;
  const app = CreateApplication({
    libraries: [LIB_HASS],
    // @ts-expect-error fake app, name used for loading credentials
    name,
    services: {
      Loader(params: TServiceParams) {
        out = params;
      },
    },
  });
  await app.bootstrap();
  return out;
}
