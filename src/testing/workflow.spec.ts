import {
  CreateApplication,
  CronExpression,
  SECOND,
  sleep,
  TServiceParams,
} from "@digital-alchemy/core";
import dayjs from "dayjs";

import { LIB_HASS } from "..";
import { CreateTestRunner, LIB_MOCK_ASSISTANT } from "../mock_assistant";

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

  const runner = CreateTestRunner(application);

  afterEach(async () => {
    await application.teardown();
    jest.restoreAllMocks();
  });

  describe("Event and Response", () => {
    it("should be able to trigger a workflow", async () => {
      expect.assertions(2);
      await runner(undefined, async ({ mock_assistant, hass }) => {
        const turnOn = jest.spyOn(hass.call.switch, "turn_on");
        const turnOff = jest.spyOn(hass.call.switch, "turn_off");
        await mock_assistant.events.emitEntityUpdate("sensor.magic", {
          state: "test",
        });
        await mock_assistant.events.emitEntityUpdate("sensor.magic", {
          state: "foo",
        });
        expect(turnOn).toHaveBeenCalledTimes(1);
        expect(turnOff).toHaveBeenCalledTimes(1);
      });
    });

    it("should be able to trigger a from an initial state", async () => {
      expect.assertions(1);
      await runner(
        ({ mock_assistant }) => {
          mock_assistant.fixtures.setState({
            "sensor.magic": {
              state: "away",
            },
          });
        },
        async ({ hass, mock_assistant }) => {
          const turnOn = jest.spyOn(hass.call.switch, "turn_on");
          await mock_assistant.events.emitEntityUpdate("sensor.magic", {
            state: "here",
          });
          await sleep(1);
          expect(turnOn).toHaveBeenCalledWith({
            entity_id: "switch.living_room_mood_lights",
          });
        },
      );
    });

    it("should not trigger a from an invalid initial state", async () => {
      expect.assertions(1);
      await runner(
        ({ mock_assistant }) =>
          mock_assistant.fixtures.setState({
            "sensor.magic": {
              state: "mars",
            },
          }),
        async ({ hass, mock_assistant }) => {
          const turnOn = jest.spyOn(hass.call.switch, "turn_on");
          await mock_assistant.events.emitEntityUpdate("sensor.magic", {
            state: "here",
          });
          expect(turnOn).not.toHaveBeenCalledWith({
            entity_id: "switch.living_room_mood_lights",
          });
        },
      );
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
      await runner(
        () => {
          jest.setSystemTime(dayjs("2024-01-01 19:59:59").toDate());
          jest.runOnlyPendingTimersAsync();
        },
        ({ hass }) => {
          const turnOn = jest.spyOn(hass.call.switch, "turn_on");
          jest.advanceTimersByTime(2 * SECOND);
          expect(turnOn).toHaveBeenCalledWith({
            entity_id: "switch.bedroom_lamp",
          });
        },
      );
    });
  });
});
