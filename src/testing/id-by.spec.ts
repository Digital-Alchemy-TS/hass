import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  TServiceParams,
} from "@digital-alchemy/core";

import { PICK_ENTITY } from "../helpers";
import { CreateTestingApplication, SILENT_BOOT } from "../mock_assistant";

describe("ID By", () => {
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

  describe("area", () => {
    it("find entities by area", async () => {
      expect.assertions(2);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const bedroom = hass.idBy.area("bedroom");
            const kitchen = hass.idBy.area("kitchen");
            expect(bedroom.length).toBe(2);
            expect(kitchen.length).toBe(1);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("finds entities only related by device", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            // merges 1 from direct area, 2 via device
            // ignores 2 from the device assigned to another area
            const list = hass.idBy.area("test") as PICK_ENTITY[];
            const expected = [
              "sensor.sun_next_dusk",
              "climate.hallway_thermostat",
              "binary_sensor.garage_door",
            ] as PICK_ENTITY[];
            expect(expected.every(expected => list.includes(expected))).toBe(
              true,
            );
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("find entities by area limiting by domain", async () => {
      expect.assertions(2);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const bedroom = hass.idBy.area("bedroom", "light");
            const kitchen = hass.idBy.area("kitchen", "light");
            expect(bedroom.length).toBe(1);
            expect(kitchen.length).toBe(0);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });
  });

  describe("label", () => {
    it("find entities by label", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const synapse = hass.idBy.label("synapse");
            expect(synapse.length).toBe(7);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("find entities by label limiting by domain", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const synapse = hass.idBy.label("synapse", "light");
            expect(synapse.length).toBe(0);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });
  });

  describe("device", () => {
    it("find entities by device", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const synapse = hass.idBy.device(
              "308e39cf50a9fc6c30b4110724ed1f2e",
            );
            expect(synapse.length).toBe(9);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("find entities by device limiting by domain", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const synapse = hass.idBy.device(
              "308e39cf50a9fc6c30b4110724ed1f2e",
              "light",
            );
            expect(synapse.length).toBe(0);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });
  });

  describe("platform", () => {
    it("find entities by platform", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const synapse = hass.idBy.platform("synapse");
            expect(synapse.length).toBe(7);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("find entities by platform limiting by domain", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const synapse = hass.idBy.platform("synapse", "light");
            expect(synapse.length).toBe(0);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });
  });

  describe("floor", () => {
    it("find entities by floor", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const synapse = hass.idBy.floor("downstairs");
            expect(synapse.length).toBe(3);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("find entities by floor limiting by domain", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const synapse = hass.idBy.floor("downstairs", "light");
            expect(synapse.length).toBe(0);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });
  });
});
