import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  TServiceParams,
} from "@digital-alchemy/core";

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

  describe("id", () => {
    //
  });

  describe("label", () => {
    it("load references by label", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.id("sensor.sun_next_dawn");
            expect(sensor.state).toBe("2024-05-03T03:24:45+00:00");
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });
  });

  describe("area", () => {
    it("load references by area", async () => {
      expect.assertions(2);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const bedroom = hass.refBy.area("bedroom");
            const kitchen = hass.refBy.area("kitchen");
            expect(bedroom.length).toBe(1);
            expect(kitchen.length).toBe(1);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("load references by area limiting by domain", async () => {
      expect.assertions(2);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const bedroom = hass.refBy.area("bedroom", "light");
            const kitchen = hass.refBy.area("kitchen", "light");
            expect(bedroom.length).toBe(0);
            expect(kitchen.length).toBe(0);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });
  });

  describe("device", () => {
    it("load references by device", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.device(
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

    it("load references by device limiting by domain", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.device(
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
    it("load references by platform", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.platform("synapse");
            expect(synapse.length).toBe(7);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("load references by platform limiting by domain", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.platform("synapse", "light");
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
    it("load references by floor", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.floor("downstairs");
            expect(synapse.length).toBe(2);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("load references by floor limiting by domain", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const synapse = hass.refBy.floor("downstairs", "light");
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
