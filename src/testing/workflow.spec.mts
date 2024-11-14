import { CronExpression, SECOND, sleep } from "@digital-alchemy/core";
import dayjs from "dayjs";

import { hassTestRunner } from "../mock_assistant/index.mts";

describe("Workflows", () => {
  beforeAll(() => {
    hassTestRunner.appendService(({ hass, scheduler }) => {
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
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  describe("Event and Response", () => {
    it("should be able to trigger a workflow", async () => {
      expect.assertions(2);
      await hassTestRunner.run(({ mock_assistant, hass, lifecycle }) => {
        lifecycle.onReady(async () => {
          const turnOn = vi.spyOn(hass.call.switch, "turn_on");
          const turnOff = vi.spyOn(hass.call.switch, "turn_off");
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
      await hassTestRunner.run(({ mock_assistant, hass, lifecycle }) => {
        mock_assistant.fixtures.setState({
          "sensor.magic": {
            state: "away",
          },
        });
        lifecycle.onReady(async () => {
          const turnOn = vi.spyOn(hass.call.switch, "turn_on");
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
      await hassTestRunner.run(({ mock_assistant, hass, lifecycle }) => {
        mock_assistant.fixtures.setState({
          "sensor.magic": {
            state: "mars",
          },
        });
        lifecycle.onReady(async () => {
          const turnOn = vi.spyOn(hass.call.switch, "turn_on");
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
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should run at 3PM", async () => {
      expect.assertions(1);
      vi.setSystemTime(dayjs("2024-01-01 19:59:59").toDate());
      vi.runOnlyPendingTimersAsync();
      await hassTestRunner.run(({ hass, lifecycle }) => {
        lifecycle.onReady(() => {
          const turnOn = vi.spyOn(hass.call.switch, "turn_on");
          vi.advanceTimersByTime(2 * SECOND);
          expect(turnOn).toHaveBeenCalledWith({
            entity_id: "switch.bedroom_lamp",
          });
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
      await hassTestRunner.run(({ hass }) => {
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
      await hassTestRunner.run(({ hass, lifecycle }) => {
        lifecycle.onReady(() => {
          const keys = Object.keys(hass.call);
          expect(keys).toEqual(EXPECTED_KEYS);
        });
      });
    });

    it("does has correctly", async () => {
      expect.assertions(34);
      await hassTestRunner.run(({ hass, lifecycle }) => {
        lifecycle.onReady(() => {
          EXPECTED_KEYS.forEach(i => expect(i in hass.call).toBe(true));
          expect("unknown_property" in hass.call).toBe(false);
        });
      });
    });
  });
});
