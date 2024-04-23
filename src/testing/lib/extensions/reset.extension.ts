import { each, TBlackHole, TServiceParams } from "@digital-alchemy/core";

type TResetCallback = () => TBlackHole;

export function Reset({ logger }: TServiceParams) {
  const callbacks = new Set<TResetCallback>();
  return {
    async Reset() {
      logger.info("resetting");
      await each([...callbacks.values()], async item => await item());
    },
    register(callback: TResetCallback) {
      callbacks.add(callback);
    },
  };
}
