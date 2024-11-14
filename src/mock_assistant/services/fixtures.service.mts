import { BootstrapException, is, TServiceParams } from "@digital-alchemy/core";
import { existsSync, readFileSync } from "fs";

import { ANY_ENTITY, ENTITY_STATE } from "../../helpers/index.mts";
import { ScannerCacheData } from "../helpers/index.mts";

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
  // This file DELIBERATELY breaks some rules
  // Setup actions that depend on config are not NORMALLY expected to run inside constructor

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
  mock_assistant.device.loadFixtures(data.devices);
  mock_assistant.floor.loadFixtures(data.floors);
  mock_assistant.area.loadFixtures(data.areas);
  mock_assistant.label.loadFixtures(data.labels);
  mock_assistant.config.loadFixtures(data.config);
  mock_assistant.entity.loadFixtures(data.entities);
  mock_assistant.entity_registry.loadFixtures(data.entity_registry);
  mock_assistant.services.loadFixtures(data.services);
  // TODO zones are not currently included in fixtures
  // more of a completion thing than them having any particular use
  //
  // mock_assistant.zone.set(data.);

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
    data,
    replace,
    setState,
  };
}
