import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  sleep,
  TServiceParams,
} from "@digital-alchemy/core";

import { PICK_ENTITY } from "../helpers";
import { CreateTestingApplication, SILENT_BOOT } from "../mock_assistant";
import { BASE_URL, TOKEN } from "./utils";

describe("Entity E2E", () => {
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

  describe("Proxy Objects", () => {
    it("should maintain accurate state", async () => {
      expect.assertions(3);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            const porch = hass.refBy.id("switch.porch_light");
            const startRaw = hass.entity.getCurrentState("switch.porch_light");
            expect(porch.state).toBe(startRaw.state);
            hass.call.switch.toggle({ entity_id: "switch.porch_light" });
            const updated = await porch.nextState();
            const endRaw = hass.entity.getCurrentState("switch.porch_light");
            expect(updated.state).toBe(porch.state);
            expect(endRaw.state).toBe(porch.state);
            await application.teardown();
          });
        },
      });
      await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
    });

    it("should provide all the properties", async () => {
      expect.assertions(6);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            const porch = hass.refBy.id("switch.porch_light");
            const raw = hass.entity.getCurrentState("switch.porch_light");
            expect(porch.state).toBe(raw.state);
            expect(porch.attributes).toEqual(raw.attributes);
            expect(porch.last_changed).toBe(raw.last_changed);
            expect(porch.last_updated).toBe(raw.last_updated);
            expect(porch.last_reported).toBe(raw.last_reported);
            expect(porch.entity_id).toBe(raw.entity_id);
            await application.teardown();
          });
        },
      });
      await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
    });

    it("should run callbacks onUpdate", async () => {
      expect.assertions(1);
      let counter = 0;
      const expected = 3;
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            const porch = hass.refBy.id("switch.porch_light");
            porch.onUpdate(() => counter++);
            for (let i = 0; i < expected; i++) {
              await hass.call.switch.toggle({
                entity_id: "switch.porch_light",
              });
              await sleep(100);
            }
            expect(counter).toBe(expected);
            await application.teardown();
          });
        },
      });
      await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
    });

    it("should able to remove onUpdate via param", async () => {
      expect.assertions(1);
      let counter = 0;
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            const porch = hass.refBy.id("switch.porch_light");
            porch.onUpdate((_new_state, _old_state, remove) => {
              remove();
              counter++;
            });
            for (let i = 0; i <= 3; i++) {
              await hass.call.switch.toggle({
                entity_id: "switch.porch_light",
              });
              await sleep(100);
            }
            expect(counter).toBe(1);
            await application.teardown();
          });
        },
      });
      await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
    });

    it("should able to remove onUpdate via return", async () => {
      expect.assertions(1);
      let counter = 0;
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            const porch = hass.refBy.id("switch.porch_light");
            const { remove } = porch.onUpdate(() => {
              remove();
              counter++;
            });
            for (let i = 0; i <= 3; i++) {
              await hass.call.switch.toggle({
                entity_id: "switch.porch_light",
              });
              await sleep(100);
            }
            expect(counter).toBe(1);
            await application.teardown();
          });
        },
      });
      await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
    });

    it("should able to remove onUpdate via removeAll", async () => {
      expect.assertions(1);
      let counter = 0;
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            const porch = hass.refBy.id("switch.porch_light");
            porch.onUpdate(() => {
              porch.removeAllListeners();
              counter++;
            });
            for (let i = 0; i <= 3; i++) {
              await hass.call.switch.toggle({
                entity_id: "switch.porch_light",
              });
              await sleep(100);
            }
            expect(counter).toBe(1);
            await application.teardown();
          });
        },
      });
      await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
    });

    it("should run callbacks once", async () => {
      expect.assertions(1);
      let counter = 0;
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            const porch = hass.refBy.id("switch.porch_light");
            porch.once(() => counter++);
            for (let i = 0; i <= 2; i++) {
              await hass.call.switch.toggle({
                entity_id: "switch.porch_light",
              });
              await sleep(100);
            }
            expect(counter).toBe(1);
            await application.teardown();
          });
        },
      });
      await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
    });

    it("should get next state", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            const porch = hass.refBy.id("switch.porch_light");
            setImmediate(async () => {
              const next = await porch.nextState();
              expect(next.state).toBe(porch.state);
            });
            await hass.call.switch.toggle({ entity_id: "switch.porch_light" });
            await sleep(100);
            await application.teardown();
          });
        },
      });
      await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
    });

    it("should run callbacks onUpdate", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            const porch = hass.refBy.id("switch.porch_light");
            setImmediate(async () => {
              const next = await porch.nextState();
              expect(next.state).toBe(porch.state);
            });
            await hass.call.switch.toggle({ entity_id: "switch.porch_light" });
            await sleep(100);
            await application.teardown();
          });
        },
      });
      await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
    });
  });

  describe("Lifecycle", () => {
    it("should have data available onReady", async () => {
      expect.assertions(6);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            expect(hass.entity.listEntities().length).toEqual(18);
            expect(hass.area.current.length).toEqual(3);
            expect(hass.floor.current.length).toEqual(2);
            expect(hass.device.current.length).toEqual(1);
            expect(hass.label.current.length).toEqual(1);
            expect(hass.entity.registry.current.length).toEqual(19);
            await application.teardown();
          });
        },
      });
      await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
    });
  });

  describe("Querying", () => {
    it("should return properly byArea", async () => {
      expect.assertions(3);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            expect(hass.idBy.area("bedroom")).toEqual([
              "switch.bedroom_lamp",
            ] as PICK_ENTITY[]);
            expect(hass.idBy.area("living_room")).toEqual([
              "switch.living_room_mood_lights",
            ] as PICK_ENTITY[]);
            expect(hass.idBy.area("kitchen")).toEqual([
              "switch.kitchen_cabinets",
            ] as PICK_ENTITY[]);
            await application.teardown();
          });
        },
      });
      await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
    });

    it("should return properly byFloor", async () => {
      expect.assertions(2);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            expect(hass.idBy.floor("upstairs")).toEqual([
              "switch.bedroom_lamp",
            ] as PICK_ENTITY[]);
            expect(hass.idBy.floor("downstairs")).toEqual([
              "switch.kitchen_cabinets",
              "switch.living_room_mood_lights",
            ] as PICK_ENTITY[]);
            await application.teardown();
          });
        },
      });
      await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
    });

    it("should return properly byLabel", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            expect(hass.idBy.label("synapse")).toEqual([
              "binary_sensor.hass_e2e_online",
              "sensor.magic",
              "binary_sensor.toggles",
              "switch.bedroom_lamp",
              "switch.kitchen_cabinets",
              "switch.living_room_mood_lights",
              "switch.porch_light",
            ] as PICK_ENTITY[]);
            await application.teardown();
          });
        },
      });
      await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
    });

    it("should return properly byPlatform", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            expect(hass.idBy.platform("synapse")).toEqual([
              "binary_sensor.hass_e2e_online",
              "sensor.magic",
              "binary_sensor.toggles",
              "switch.bedroom_lamp",
              "switch.kitchen_cabinets",
              "switch.living_room_mood_lights",
              "switch.porch_light",
            ] as PICK_ENTITY[]);
            await application.teardown();
          });
        },
      });
      await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
    });

    it("should return properly byDevice", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            expect(
              hass.idBy.device("308e39cf50a9fc6c30b4110724ed1f2e"),
            ).toEqual([
              "sensor.sun_next_dawn",
              "sensor.sun_next_dusk",
              "sensor.sun_next_midnight",
              "sensor.sun_next_noon",
              "sensor.sun_next_rising",
              "sensor.sun_next_setting",
              "sensor.sun_solar_elevation",
              "sensor.sun_solar_azimuth",
              "sensor.sun_solar_rising",
            ] as PICK_ENTITY[]);
            await application.teardown();
          });
        },
      });
      await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
    });
  });
});
