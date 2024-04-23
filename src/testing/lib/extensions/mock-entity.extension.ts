import { TBlackHole, TServiceParams } from "@digital-alchemy/core";

import { ENTITY_PROP, PICK_ENTITY, PICK_SERVICE } from "../../../helpers";

export type EntityCallbackOptions<ENTITY extends PICK_ENTITY> = {
  get: () => RegistryItem<ENTITY>;
  set: (options: Partial<RegistryItem<ENTITY>>) => Promise<void>;
};

export type RegisterMockEntity<ENTITY extends PICK_ENTITY> = {
  onReset: () => TBlackHole;
  onServiceCall: <SERVICE extends PICK_SERVICE, DATA extends object>(
    service: SERVICE,
    data: DATA,
  ) => TBlackHole;
  entity_id: ENTITY;
};

type RegistryItem<ENTITY extends PICK_ENTITY> = {
  state: ENTITY_PROP<ENTITY, "state">;
  attributes: ENTITY_PROP<ENTITY, "attributes">;
};
type RegistryInformation = Partial<
  Record<PICK_ENTITY, RegistryItem<PICK_ENTITY>>
>;

export function MockEntity({ internal, hass_testing, logger }: TServiceParams) {
  const REGISTRY: RegistryInformation = {};
  async function RegisterEntity<ENTITY extends PICK_ENTITY>(
    { entity_id, onReset, onServiceCall }: RegisterMockEntity<ENTITY>,
    manage: (options: EntityCallbackOptions<ENTITY>) => TBlackHole,
  ) {
    logger.debug({ name: entity_id }, `registering mock entity`);
    hass_testing.reset.register(onReset);
    REGISTRY[entity_id] = { attributes: undefined, state: undefined };

    await internal.safeExec(async () => {
      manage({
        get() {
          return REGISTRY[entity_id] as RegistryItem<ENTITY>;
        },
        async set({ attributes, state }: Partial<RegistryItem<ENTITY>>) {
          REGISTRY[entity_id].attributes =
            attributes ?? REGISTRY[entity_id].attributes;
          REGISTRY[entity_id].state = state ?? REGISTRY[entity_id].state;
        },
      });
    });
  }

  return { RegisterEntity };
}
