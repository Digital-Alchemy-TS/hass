import {
  ApplicationDefinition,
  is,
  OptionalModuleConfiguration,
  ServiceMap,
  sleep,
  TServiceParams,
} from "@digital-alchemy/core";

import { CreateTestingApplication, SILENT_BOOT } from "../mock_assistant/index.mts";
import { BASE_URL, TOKEN } from "./utils";

const SETTLE_TIMEOUT = 1000;

describe("Fetch API E2E", () => {
  let application: ApplicationDefinition<ServiceMap, OptionalModuleConfiguration>;

  afterEach(async () => {
    if (application) {
      await application.teardown();
      application = undefined;
    }
    jest.restoreAllMocks();
  });

  it("should perform service calls", async () => {
    expect.assertions(1);
    application = CreateTestingApplication({
      Test({ lifecycle, hass }: TServiceParams) {
        lifecycle.onReady(async () => {
          let hit = false;
          const wait = sleep(SETTLE_TIMEOUT);
          hass.refBy.id("switch.porch_light").onUpdate(() => {
            hit = true;
            wait.kill("continue");
          });
          await hass.fetch.callService("switch.toggle", {
            entity_id: "switch.porch_light",
          });
          await wait;
          expect(hit).toBe(true);
          await application.teardown();
        });
      },
    });
    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });

  it("should check config", async () => {
    expect.assertions(1);
    application = CreateTestingApplication({
      Test({ lifecycle, hass }: TServiceParams) {
        lifecycle.onReady(async () => {
          const result = await hass.fetch.checkConfig();
          expect(result.result).toBe("valid");
          await application.teardown();
        });
      },
    });
    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });

  it("should retrieve entities", async () => {
    expect.assertions(1);
    application = CreateTestingApplication({
      Test({ lifecycle, hass }: TServiceParams) {
        lifecycle.onReady(async () => {
          const result = await hass.fetch.getAllEntities();
          expect(result.length).toBe(hass.entity.listEntities().length);
          await application.teardown();
        });
      },
    });
    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });

  it("should retrieve services", async () => {
    expect.assertions(2);
    application = CreateTestingApplication({
      Test({ lifecycle, hass }: TServiceParams) {
        lifecycle.onReady(async () => {
          const result = await hass.fetch.getAllEntities();
          expect(is.array(result)).toBe(true);
          expect(result.length).toBe(18);
          await application.teardown();
        });
      },
    });
    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });
});
