import {
  CreateApplication,
  CronExpression,
  SECOND,
  sleep,
  TServiceParams,
} from "@digital-alchemy/core";
import dayjs from "dayjs";

import { LIB_HASS } from "..";
import { LIB_MOCK_ASSISTANT } from "../mock_assistant";

describe("Workflows", () => {
  const application = CreateApplication({
    libraries: [LIB_HASS],
    // @ts-expect-error testing
    name: "testing",
    services: {
      Test({ hass, scheduler }: TServiceParams) {
        scheduler.cron({
          async exec() {
            await hass.call.switch.turn_on({
              entity_id: "switch.bedroom_lamp",
            });
          },
          schedule: CronExpression.EVERY_DAY_AT_8PM,
        });

        const entity = hass.entity.byId("sensor.magic");
        entity.onUpdate(async () => {
          const action = entity.state === "test" ? "turn_on" : "turn_off";
          await hass.call.switch[action]({
            entity_id: "switch.porch_light",
          });
        });

        entity.onUpdate(async (new_state, old_state) => {
          if (old_state.state === "away" && new_state.state === "here") {
            await hass.call.switch.turn_on({
              entity_id: "switch.living_room_mood_lights",
            });
          }
        });
      },
    },
  });

  afterEach(async () => {
    await application.teardown();
    jest.restoreAllMocks();
  });

  describe("Event and Response", () => {
    it("should be able to trigger a workflow", async () => {
      expect.assertions(2);
      await application.bootstrap({
        appendLibrary: LIB_MOCK_ASSISTANT,
        appendService: {
          Runner({ mock_assistant, lifecycle, hass }: TServiceParams) {
            lifecycle.onReady(async () => {
              const turnOn = jest.spyOn(hass.call.switch, "turn_on");
              const turnOff = jest.spyOn(hass.call.switch, "turn_off");
              await mock_assistant.events.emitEntityUpdate("sensor.magic", {
                state: "test",
              });
              await sleep(1);
              await mock_assistant.events.emitEntityUpdate("sensor.magic", {
                state: "foo",
              });
              expect(turnOn).toHaveBeenCalledTimes(1);
              expect(turnOff).toHaveBeenCalledTimes(1);
            });
          },
        },
        configuration: {
          boilerplate: { LOG_LEVEL: "error" },
          hass: { MOCK_SOCKET: true, TOKEN: "--" },
        },
      });
    });

    it("should be able to trigger a from an initial state", async () => {
      expect.assertions(1);
      await application.bootstrap({
        appendLibrary: LIB_MOCK_ASSISTANT,
        appendService: {
          Runner({ mock_assistant, lifecycle, hass }: TServiceParams) {
            mock_assistant.fixtures.setState({
              "sensor.magic": {
                state: "away",
              },
            });
            lifecycle.onReady(async () => {
              const turnOn = jest.spyOn(hass.call.switch, "turn_on");
              await mock_assistant.events.emitEntityUpdate("sensor.magic", {
                state: "here",
              });
              await sleep(1);
              expect(turnOn).toHaveBeenCalledWith({
                entity_id: "switch.living_room_mood_lights",
              });
            });
          },
        },
        configuration: {
          boilerplate: { LOG_LEVEL: "error" },
          hass: { MOCK_SOCKET: true, TOKEN: "--" },
        },
      });
    });

    it("should not trigger a from an invalid initial state", async () => {
      expect.assertions(1);
      await application.bootstrap({
        appendLibrary: LIB_MOCK_ASSISTANT,
        appendService: {
          Runner({ mock_assistant, lifecycle, hass }: TServiceParams) {
            mock_assistant.fixtures.setState({
              "sensor.magic": {
                state: "mars",
              },
            });
            lifecycle.onReady(async () => {
              const turnOn = jest.spyOn(hass.call.switch, "turn_on");
              await mock_assistant.events.emitEntityUpdate("sensor.magic", {
                state: "here",
              });
              await sleep(1);
              expect(turnOn).not.toHaveBeenCalledWith({
                entity_id: "switch.living_room_mood_lights",
              });
            });
          },
        },
        configuration: {
          boilerplate: { LOG_LEVEL: "error" },
          hass: { MOCK_SOCKET: true, TOKEN: "--" },
        },
      });
    });
  });

  describe("Timers", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should run at 3PM", async () => {
      expect.assertions(1);
      // 745PM
      jest.setSystemTime(dayjs("2024-01-01 19:59:59").toDate());
      await application.bootstrap({
        appendLibrary: LIB_MOCK_ASSISTANT,
        appendService: {
          Runner({ lifecycle, hass }: TServiceParams) {
            lifecycle.onReady(async () => {
              const turnOn = jest.spyOn(hass.call.switch, "turn_on");
              jest.advanceTimersByTime(2 * SECOND);
              expect(turnOn).toHaveBeenCalledWith({
                entity_id: "switch.bedroom_lamp",
              });
            });
            jest.runOnlyPendingTimersAsync();
          },
        },
        configuration: {
          boilerplate: { LOG_LEVEL: "error" },
          hass: { MOCK_SOCKET: true, TOKEN: "--" },
        },
      });
    });
  });
});
