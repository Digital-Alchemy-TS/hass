import {
  CronExpression,
  LibraryTestRunner,
  SECOND,
  sleep,
  TestRunner,
} from "@digital-alchemy/core";
import dayjs from "dayjs";

import { HassConfig, LIB_HASS } from "..";
import { LIB_MOCK_ASSISTANT } from "../mock_assistant";

describe("Workflows", () => {
  let runner: LibraryTestRunner<typeof LIB_HASS>;

  beforeEach(() => {
    runner = TestRunner({ target: LIB_HASS })
      .appendLibrary(LIB_MOCK_ASSISTANT)
      .appendService(({ hass }) => {
        jest
          .spyOn(hass.fetch, "getConfig")
          .mockImplementation(async () => ({ version: "2024.4.1" }) as HassConfig);
      })
      .setup(({ hass, scheduler }) => {
        scheduler.cron({
          async exec() {
            await hass.call.switch.turn_on({
              entity_id: "switch.bedroom_lamp",
            });
          },
          schedule: CronExpression.EVERY_DAY_AT_8PM,
        });

        const entity = hass.refBy.id("sensor.magic");
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
      });
  });

  afterEach(async () => {
    await runner.teardown();
    jest.restoreAllMocks();
  });

  describe("Event and Response", () => {
    it("should be able to trigger a workflow", async () => {
      expect.assertions(2);
      await runner.run(({ mock_assistant, hass, lifecycle }) => {
        lifecycle.onReady(async () => {
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
    });

    it("should be able to trigger a from an initial state", async () => {
      expect.assertions(1);
      await runner.run(({ mock_assistant, hass, lifecycle }) => {
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
      });
    });

    it("should not trigger a from an invalid initial state", async () => {
      expect.assertions(1);
      await runner.run(({ mock_assistant, hass, lifecycle }) => {
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
          expect(turnOn).not.toHaveBeenCalledWith({
            entity_id: "switch.living_room_mood_lights",
          });
        });
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
      jest.setSystemTime(dayjs("2024-01-01 19:59:59").toDate());
      jest.runOnlyPendingTimersAsync();
      await runner.run(({ hass }) => {
        const turnOn = jest.spyOn(hass.call.switch, "turn_on");
        jest.advanceTimersByTime(2 * SECOND);
        expect(turnOn).toHaveBeenCalledWith({
          entity_id: "switch.bedroom_lamp",
        });
      });
    });
  });

  describe("Call", () => {
    const EXPECTED_KEYS = [
      "persistent_notification",
      "homeassistant",
      "system_log",
      "logger",
      "recorder",
      "person",
      "frontend",
      "cloud",
      "ffmpeg",
      "tts",
      "scene",
      "timer",
      "input_number",
      "conversation",
      "input_select",
      "zone",
      "input_button",
      "script",
      "automation",
      "logbook",
      "input_boolean",
      "button",
      "switch",
      "input_datetime",
      "backup",
      "shopping_list",
      "counter",
      "schedule",
      "input_text",
      "synapse",
      "todo",
      "notify",
      "calendar",
    ];
    it("does not allow set", async () => {
      expect.assertions(1);
      await runner.run(({ hass }) => {
        try {
          // @ts-expect-error testing
          hass.call.button = {};
        } catch (error) {
          expect(error).toBeDefined();
        }
      });
    });

    it("provides keys via ownKeys", async () => {
      expect.assertions(1);
      await runner.run(({ hass }) => {
        const keys = Object.keys(hass.call);
        expect(keys).toEqual(EXPECTED_KEYS);
      });
    });

    it("does has correctly", async () => {
      expect.assertions(34);
      await runner.run(({ hass }) => {
        EXPECTED_KEYS.forEach(i => expect(i in hass.call).toBe(true));
        expect("unknown_property" in hass.call).toBe(false);
      });
    });
  });
});
