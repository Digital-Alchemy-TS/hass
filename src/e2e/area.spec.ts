import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  sleep,
  TServiceParams,
} from "@digital-alchemy/core";

import { TAreaId } from "../dynamic";
import { AREA_REGISTRY_UPDATED } from "../helpers";
import { CreateTestingApplication, SILENT_BOOT } from "../mock_assistant";
import { BASE_URL, TOKEN } from "./utils";

describe("Area E2E", () => {
  let application: ApplicationDefinition<
    ServiceMap,
    OptionalModuleConfiguration
  >;
  const testArea = "test" as TAreaId;

  afterEach(async () => {
    if (application) {
      await application.teardown();
      application = undefined;
    }
    jest.restoreAllMocks();
  });

  it("should fire events on registry updated", async () => {
    expect.assertions(1);
    application = CreateTestingApplication({
      Test({ lifecycle, hass, event }: TServiceParams) {
        lifecycle.onReady(async () => {
          let hit = false;
          event.on(AREA_REGISTRY_UPDATED, () => (hit = true));
          await hass.socket.fireEvent("area_registry_updated");
          await sleep(50);
          expect(hit).toBe(true);
          await application.teardown();
        });
      },
    });
    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });

  it("should create a label", async () => {
    expect.assertions(1);
    application = CreateTestingApplication({
      Test({ lifecycle, hass }: TServiceParams) {
        lifecycle.onReady(async () => {
          await hass.area.create({
            floor_id: "downstairs",
            icon: "mdi:account",
            labels: [],
            name: "test",
            picture: "",
          });
          expect(hass.area.current.some(i => i.area_id === testArea)).toBe(
            true,
          );
          await application.teardown();
        });
      },
    });

    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });

  it("should update a label", async () => {
    expect.assertions(1);
    application = CreateTestingApplication({
      Test({ lifecycle, hass }: TServiceParams) {
        lifecycle.onReady(async () => {
          const item = hass.area.current.find(i => i.area_id === testArea);
          await hass.area.update({
            ...item,
            name: "extra test",
          });
          expect(
            hass.area.current.find(i => i.area_id === testArea)?.name,
          ).toBe("extra test");
          await application.teardown();
        });
      },
    });
    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });

  it("should delete a label", async () => {
    expect.assertions(2);
    application = CreateTestingApplication({
      Test({ lifecycle, hass }: TServiceParams) {
        lifecycle.onReady(async () => {
          expect(hass.area.current.some(i => i.area_id === testArea)).toBe(
            true,
          );
          await hass.area.delete(testArea);
          expect(hass.area.current.some(i => i.area_id === testArea)).toBe(
            false,
          );
          await application.teardown();
        });
      },
    });
    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });
});
