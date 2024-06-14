import { mock } from "node:test";

import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  TServiceParams,
} from "@digital-alchemy/core";

import { ANY_ENTITY, ENTITY_STATE } from "../helpers";
import { CreateTestingApplication, SILENT_BOOT } from "../mock_assistant";

describe("Entity", () => {
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

  describe("API", () => {
    it("should emit events onConnect", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          let hit = false;
          hass.socket.onConnect(() => (hit = true));
          lifecycle.onReady(() => {
            expect(hit).toBe(true);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("should find entities by unique_id", async () => {
      expect.assertions(2);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const entity = hass.refBy.unique_id<"sensor.sun_next_dawn">(
              "5622d76001a335e3ea893c4d60d31b3d-next_dawn",
            );
            expect(entity).toBeDefined();
            expect(entity.entity_id).toBe("sensor.sun_next_dawn");
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("should return unmodified entity state with .raw", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const allData = hass.entity._masterState();
            const single = hass.entity.raw("sun.sun");
            expect(single).toBe(allData.sun.sun);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("should return previous entity state with .previous", async () => {
      expect.assertions(3);
      application = CreateTestingApplication({
        Test({ lifecycle, hass, mock_assistant }: TServiceParams) {
          const entity_id = "sensor.magic";
          const value = "bar";
          lifecycle.onReady(async () => {
            const start = hass.entity.raw(entity_id);
            await mock_assistant.events.emitEntityUpdate(entity_id, {
              state: value,
            });
            const updated = hass.entity.raw(entity_id);
            const previous = hass.entity.previousState(entity_id);
            expect(updated.state).toBe(value);
            expect(start.state).not.toBe(value);
            expect(start).toEqual(previous);
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("should return undefined for no matches", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(() => {
            const entity = hass.refBy.unique_id(
              "5622d76001a335e3ea893c4d60d31b3d-previous_dawn",
            );
            expect(entity).not.toBeDefined();
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });
  });

  describe("Refresh", () => {
    it("should attempt to load entities onBootstrap", async () => {
      expect.assertions(2);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(hass.entity, "refresh")
            .mockImplementation(async () => undefined);

          lifecycle.onPostConfig(function latePostConfig() {
            expect(spy).toHaveBeenCalled();
          }, -1);
          lifecycle.onPostConfig(function earlyPostConfig() {
            expect(spy).not.toHaveBeenCalled();
          }, 0);
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true } }, true),
      );
    });

    it("should not attempt to load entities onBootstrap if AUTO_CONNECT_SOCKET is false", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const spy = jest
            .spyOn(hass.entity, "refresh")
            .mockImplementation(async () => undefined);

          lifecycle.onBootstrap(() => {
            expect(spy).not.toHaveBeenCalled();
          });
        },
      });
      await application.bootstrap(
        SILENT_BOOT(
          { hass: { AUTO_CONNECT_SOCKET: false, MOCK_SOCKET: true } },
          true,
        ),
      );
    });

    it("should retry on failure", async () => {
      expect.assertions(1);
      application = CreateTestingApplication({
        Test({ lifecycle, hass }: TServiceParams) {
          const responses = [
            { text: "502 Bad Gateway" },
            { text: "502 Bad Gateway" },
            { text: "502 Bad Gateway" },
            [],
            [{ entity_id: "sensor.magic" } as ENTITY_STATE<ANY_ENTITY>],
          ];
          const spy = jest
            .spyOn(hass.fetch, "getAllEntities")
            // @ts-expect-error it happens
            .mockImplementation(async () => responses.shift());

          lifecycle.onBootstrap(() => expect(spy).toHaveBeenCalledTimes(5));
        },
      });
      await application.bootstrap(
        SILENT_BOOT({ hass: { MOCK_SOCKET: true, RETRY_INTERVAL: 0 } }, true),
      );
    });
  });
});
