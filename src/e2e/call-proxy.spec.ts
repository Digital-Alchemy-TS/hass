import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  sleep,
  TServiceParams,
} from "@digital-alchemy/core";

import { CreateTestingApplication, SILENT_BOOT } from "../mock_assistant";
import { BASE_URL, TOKEN } from "./utils";

const SETTLE_TIMEOUT = 1000;

describe("Call Proxy E2E", () => {
  let application: ApplicationDefinition<
    ServiceMap,
    OptionalModuleConfiguration
  >;

  afterEach(async () => {
    if (application) {
      await application.teardown();
      application = undefined;
    }
    jest.restoreAllMocks();
  });

  it("should cause a service call to happen", async () => {
    expect.assertions(1);
    application = CreateTestingApplication({
      Test({ lifecycle, hass }: TServiceParams) {
        lifecycle.onReady(async () => {
          let hit = false;
          const wait = sleep(SETTLE_TIMEOUT);
          hass.entity.byId("switch.porch_light").onUpdate(() => {
            hit = true;
            wait.kill("continue");
          });
          await hass.call.switch.toggle({
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

  it("should be possible to mock a call", async () => {
    expect.assertions(1);
    application = CreateTestingApplication({
      Test({ lifecycle, hass }: TServiceParams) {
        lifecycle.onReady(async () => {
          const spy = jest
            .spyOn(hass.call.switch, "toggle")
            .mockImplementation(async () => undefined);
          await hass.call.switch.toggle({
            entity_id: "switch.porch_light",
          });
          expect(spy).toHaveBeenCalledWith({ entity_id: "switch.porch_light" });
          await application.teardown();
        });
      },
    });
    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });
});
