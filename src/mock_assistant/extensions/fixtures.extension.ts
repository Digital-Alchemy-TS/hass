import { BootstrapException, is, TServiceParams } from "@digital-alchemy/core";
import { existsSync, readFileSync } from "fs";

import { ANY_ENTITY, ENTITY_STATE } from "../../helpers";
import { ScannerCacheData } from "../helpers";

const MEGA_HIGH_PRIORITY = 1000;

type StateOptions = Partial<{
  [entity in ANY_ENTITY]: Partial<ENTITY_STATE<entity>>;
}>;

// this naming pattern is confusing sometimes
// don't think about it too much
export function MockFixtures({
  lifecycle,
  config,
  internal,
  context,
  mock_assistant,
}: TServiceParams) {
  lifecycle.onPreInit(() => {
    const { FIXTURES_FILE } = config.mock_assistant;
    if (!existsSync(FIXTURES_FILE)) {
      throw new BootstrapException(
        context,
        "MISSING_FIXTURES_FILE",
        `${FIXTURES_FILE} does not exist`,
      );
    }
    if (is.empty(config.hass.TOKEN)) {
      // prevents throwing errors
      internal.boilerplate.configuration.set("hass", "TOKEN", "--");
    }
    const data = JSON.parse(readFileSync(FIXTURES_FILE, "utf8")) as ScannerCacheData;
    mock_assistant.fixtures.data = data;
    mock_assistant.device.set(data.devices);
    mock_assistant.floor.set(data.floors);
    mock_assistant.area.set(data.areas);
    mock_assistant.label.set(data.labels);
    mock_assistant.config.replace(data.config);
    mock_assistant.entity.setEntities(data.entities);
    mock_assistant.entity.setRegistry(data.entity_registry);
    mock_assistant.services.set(data.services);
    // TODO zones are not currently included in fixtures
    // more of a completion thing than them having any particular use
    //
    // mock_assistant.zone.set(data.);
  }, MEGA_HIGH_PRIORITY);

  function setState(options: StateOptions) {
    lifecycle.onPreInit(() => {
      const entities = Object.keys(options) as ANY_ENTITY[];
      entities.forEach(i => replace(i, options[i]));
    });
  }

  function byId(entity: ANY_ENTITY) {
    return mock_assistant.fixtures.data.entities.find(i => i.entity_id === entity);
  }

  function replace<ENTITY extends ANY_ENTITY>(
    entity: ENTITY,
    new_state: Partial<ENTITY_STATE<ENTITY>>,
  ): ENTITY_STATE<ENTITY> {
    const old_state = byId(entity);
    const { data } = mock_assistant.fixtures;
    data.entities = data.entities.filter(i => i.entity_id !== entity);

    const updated = { ...old_state, ...new_state } as ENTITY_STATE<ENTITY>;
    mock_assistant.fixtures.data.entities.push(updated);
    return updated;
  }

  return {
    byId,
    data: undefined as ScannerCacheData,
    replace,
    setState,
  };
}
