import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  sleep,
  TServiceParams,
} from "@digital-alchemy/core";

import { TFloorId } from "../dynamic";
import { FLOOR_REGISTRY_UPDATED } from "../helpers";
import { CreateTestingApplication, SILENT_BOOT } from "../mock_assistant";
import { BASE_URL, TOKEN } from "./utils";

describe("Floor E2E", () => {
  let application: ApplicationDefinition<
    ServiceMap,
    OptionalModuleConfiguration
  >;
  const testFloor = "test" as TFloorId;

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
          event.on(FLOOR_REGISTRY_UPDATED, () => (hit = true));
          await hass.socket.fireEvent("floor_registry_updated");
          await sleep(100);
          expect(hit).toBe(true);
          await application.teardown();
        });
      },
    });
    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });

  it("should create a floor", async () => {
    expect.assertions(1);
    application = CreateTestingApplication({
      Test({ lifecycle, hass }: TServiceParams) {
        lifecycle.onReady(async () => {
          await hass.floor.create({
            level: 1,
            name: "test",
          });
          expect(hass.floor.current.some(i => i.floor_id === testFloor)).toBe(
            true,
          );
          await application.teardown();
        });
      },
    });

    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });

  it("should update a floor", async () => {
    expect.assertions(1);
    application = CreateTestingApplication({
      Test({ lifecycle, hass }: TServiceParams) {
        lifecycle.onReady(async () => {
          const item = hass.floor.current.find(i => i.floor_id === testFloor);
          await hass.floor.update({
            ...item,
            name: "extra test",
          });
          expect(
            hass.floor.current.find(i => i.floor_id === testFloor)?.name,
          ).toBe("extra test");
          await application.teardown();
        });
      },
    });
    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });

  it("should delete a floor", async () => {
    expect.assertions(2);
    application = CreateTestingApplication({
      Test({ lifecycle, hass }: TServiceParams) {
        lifecycle.onReady(async () => {
          expect(hass.floor.current.some(i => i.floor_id === testFloor)).toBe(
            true,
          );
          await hass.floor.delete(testFloor);
          expect(hass.floor.current.some(i => i.floor_id === testFloor)).toBe(
            false,
          );
          await application.teardown();
        });
      },
    });
    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });
});
