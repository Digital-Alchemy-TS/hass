import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  TServiceParams,
} from "@digital-alchemy/core";
import dayjs from "dayjs";

import { ANY_ENTITY, ENTITY_STATE } from "../helpers";
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

  describe("refBy.id", () => {
    it("can grab references by id", async () => {
      expect.assertions(2);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.id("sensor.magic");
            expect(sensor).toBeDefined();
            expect(sensor.state).toBe("unavailable");
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("references have attributes", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.id("sensor.magic");
            expect(sensor.attributes).toEqual(
              expect.objectContaining({ friendly_name: "magic" }),
            );
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("references do not return random attributes", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.id("sensor.magic");
            // @ts-expect-error it's the test
            expect(sensor.foo).toBeUndefined();
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("references provide last_* as dayjs", async () => {
      expect.assertions(3);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.id("sensor.magic");
            expect(sensor.last_changed instanceof dayjs).toBe(true);
            expect(sensor.last_reported instanceof dayjs).toBe(true);
            expect(sensor.last_updated instanceof dayjs).toBe(true);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("passes through history calls", async () => {
      expect.assertions(2);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            const result = [] as ENTITY_STATE<ANY_ENTITY>[];
            const spy = jest
              .spyOn(hass.fetch, "fetchEntityHistory")
              .mockImplementation(async () => result);
            const from = new Date();
            const to = new Date();
            const entity_id = "sensor.magic";

            const entity = hass.refBy.id(entity_id);
            const out = await entity.history(from, to);
            expect(spy).toHaveBeenCalledWith(entity_id, from, to);
            expect(out).toBe(result);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });
  });

  describe("domain", () => {
    it("load references by domain", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.domain("sensor");
            expect(sensor.length).toBe(8);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });
  });

  describe("unique_id", () => {
    it("load references by unique_id", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const sensor = hass.refBy.unique_id(
              "e1806fdc93296bbd5ab42967003cd38729ff9ba6cfeefc3e15a03ad01ac894fe",
            );
            expect(sensor.entity_id).toBe("sensor.magic");
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });
  });

  describe("label", () => {
    it("load references by label", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const list = hass.refBy.label("synapse");
            expect(list.length).toBe(7);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("load references by label limiting by domain", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const list = hass.refBy.label("synapse", "light");
            expect(list.length).toBe(0);
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
