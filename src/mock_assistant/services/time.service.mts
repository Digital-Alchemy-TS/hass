import type { TServiceParams } from "@digital-alchemy/core";
import { HOUR, MINUTE, START } from "@digital-alchemy/core";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { DurationUnitType } from "dayjs/plugin/duration";

import { calcSolNoon, calcSunriseSet } from "../helpers/solar.mts";

/**
 * Solar event names — mirrors the type from `@digital-alchemy/automation`'s SolarCalculator.
 * Replicated here so `hass` has no runtime dependency on the automation package.
 */
export type SolarEvents =
  | "dawn"
  | "dusk"
  | "nightEnd"
  | "nightStart"
  | "solarNoon"
  | "sunrise"
  | "sunriseEnd"
  | "sunset"
  | "sunsetStart";

/**
 * Named constant for offset durations to avoid magic numbers.
 * Solar offset windows: at midnight & init, so the clock must be set before module boots.
 */
const SOLAR_OFFSET_MIDNIGHT_MINUTES = 0;

/**
 * Degrees below horizon for each solar event type.
 * Mirrors the values used in the automation SolarCalculator.
 */
const SOLAR_DEGREES: Record<SolarEvents, { rise: boolean; angle: number }> = {
  dawn: { angle: 6, rise: true },
  dusk: { angle: 6, rise: false },
  nightEnd: { angle: 18, rise: true },
  nightStart: { angle: 18, rise: false },
  solarNoon: { angle: 0, rise: true }, // sentinel — uses calcSolNoon
  sunrise: { angle: 0.833, rise: true },
  sunriseEnd: { angle: 0.3, rise: true },
  sunset: { angle: 0.833, rise: false },
  sunsetStart: { angle: 0.3, rise: false },
};

export type MockTimeService = ReturnType<typeof MockTime>;

/**
 * Ergonomic fake-clock wrappers for `@digital-alchemy/hass` test suites.
 *
 * ## Boot-ordering contract (CRITICAL)
 *
 * Solar schedulers and cron jobs capture the current time when they register.
 * To anchor them to a fake clock, you MUST call `vi.useFakeTimers()` and
 * `vi.setSystemTime(date)` **before** `TestRunner().run()` (or `hassTestRunner.run()`).
 *
 * The helpers on this service (`set`, `advanceTo`, `advanceBy`) work ONLY inside
 * a test that has already done `vi.useFakeTimers()` before run.
 *
 * ```ts
 * // CORRECT — fake clock before run
 * vi.useFakeTimers();
 * vi.setSystemTime(new Date("2024-01-15T00:00:00.000Z"));
 * const app = await hassTestRunner.run(({ mock_assistant }) => {
 *   const solarTs = mock_assistant.time.solar("sunset");
 *   // register things that fire at solarTs...
 * });
 * await mock_assistant.time.advanceTo("20:30");
 * // ...
 * vi.useRealTimers();
 * await app.teardown();
 * ```
 *
 * ## Timezone contract
 *
 * All `HH:mm` time strings passed to `set`, `advanceTo`, and `advanceBy` are
 * interpreted as **UTC**. Callers must set the system clock to a UTC midnight
 * date before run() for time-of-day literals to match solar calculations.
 * This is consistent with `vi.setSystemTime(new Date("2024-01-15T00:00:00.000Z"))`.
 */
export function MockTime({ mock_assistant }: TServiceParams) {
  /**
   * Parse an `HH:mm` UTC string into a Dayjs for the fake-clock's current UTC day.
   *
   * Builds the target timestamp via `Date.UTC` so no dayjs UTC plugin is required.
   */
  function parseTimeString(timeStr: string): Dayjs {
    const [hours, minutesPart] = timeStr.split(":");
    const h = Number(hours);
    const m = minutesPart !== undefined ? Number(minutesPart) : SOLAR_OFFSET_MIDNIGHT_MINUTES;
    const now = new Date();
    // Anchor to midnight UTC on the current fake-clock day, then add hours and minutes.
    const utcMidnight = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      SOLAR_OFFSET_MIDNIGHT_MINUTES,
      SOLAR_OFFSET_MIDNIGHT_MINUTES,
      SOLAR_OFFSET_MIDNIGHT_MINUTES,
      SOLAR_OFFSET_MIDNIGHT_MINUTES,
    );
    return dayjs(utcMidnight + h * HOUR + m * MINUTE);
  }

  /**
   * Set the fake system clock to a specific `HH:mm` UTC time on the same day.
   *
   * Requires `vi.useFakeTimers()` to have been called before `TestRunner().run()`.
   */
  function set(timeStr: string): void {
    const target = parseTimeString(timeStr);
    vi.setSystemTime(target.toDate());
  }

  /**
   * Advance the fake clock to `target`, firing every timer and cron tick
   * that falls between the current fake time and `target` **in order**.
   *
   * This is the correct way to time-travel in tests: unlike a bare
   * `vi.advanceTimersByTime` call, this method advances in discrete ticks so
   * that timers scheduled *within* the advance window fire at the right moment.
   *
   * If `target` is a string it is parsed as `HH:mm` UTC on the current fake day.
   * If `target` is a `Dayjs` it is used directly.
   *
   * @throws if `target` is before the current fake time (would go backwards).
   */
  async function advanceTo(target: string | Dayjs): Promise<void> {
    const targetDayjs = typeof target === "string" ? parseTimeString(target) : target;
    const now = dayjs();
    const deltaMs = targetDayjs.diff(now, "ms");
    if (deltaMs <= START) {
      // Going to a past or equal time is a no-op rather than an error;
      // calling code may compute solar times that already passed today.
      return;
    }
    // Advance in MINUTE-sized ticks so cron and scheduled callbacks fire in order.
    // The tick size is intentionally one minute: cron resolution is 1 min in node-cron.
    const TICK_MS = MINUTE;
    let remaining = deltaMs;
    while (remaining > START) {
      const step = Math.min(TICK_MS, remaining);
      vi.advanceTimersByTime(step);
      // Yield the microtask queue between ticks so async scheduler callbacks settle.
      await Promise.resolve();
      remaining -= step;
    }
  }

  /**
   * Advance the fake clock by a relative duration.
   *
   * Accepts the same offset formats as `scheduler.setInterval`:
   * - `number` — milliseconds
   * - `[quantity, unit]` — e.g. `[15, "minutes"]`
   * - `{hours, minutes, ...}` — dayjs duration object literal
   * - ISO 8601 partial string — e.g. `"15M"` (15 minutes), `"1H30M"`
   */
  async function advanceBy(
    offset: number | [number, DurationUnitType] | Record<string, number> | string,
  ): Promise<void> {
    let ms: number;
    if (typeof offset === "number") {
      ms = offset;
    } else if (Array.isArray(offset)) {
      const [qty, unit] = offset as [number, DurationUnitType];
      ms = dayjs.duration(qty, unit).asMilliseconds();
    } else if (typeof offset === "object") {
      ms = dayjs.duration(offset).asMilliseconds();
    } else {
      // ISO 8601 partial (e.g. "15M", "1H30M")
      ms = dayjs.duration(`PT${(offset as string).toUpperCase()}`).asMilliseconds();
    }
    await advanceTo(dayjs().add(ms, "ms"));
  }

  /**
   * Compute a solar event time for the currently anchored fake clock date.
   *
   * Uses the lat/long from `mock_assistant.config.current()` (populated by
   * your fixtures or a `mock_assistant.config.merge(...)` call).
   *
   * **Must be called after the TestRunner has booted** (so config is populated).
   *
   * Solar offsets compute "at midnight & init" — `advanceTo` CANNOT retroactively
   * fix already-scheduled solar events. Use this to calculate the expected trigger
   * time and then advance the clock to that moment.
   *
   * @param event - The solar event name (e.g. `"sunset"`, `"sunrise"`)
   * @param offsetMinutes - Optional minute offset (positive = later, negative = earlier)
   */
  function solar(
    event: SolarEvents,
    { offsetMinutes = START }: { offsetMinutes?: number } = {},
  ): Dayjs {
    const cfg = mock_assistant.config.current();
    const { latitude, longitude } = cfg;

    let baseTime: Dayjs;
    if (event === "solarNoon") {
      baseTime = dayjs(calcSolNoon(longitude));
    } else {
      const { rise, angle } = SOLAR_DEGREES[event];
      baseTime = dayjs(calcSunriseSet(rise, angle, latitude, longitude));
    }

    return baseTime.add(offsetMinutes, "minute");
  }

  return {
    advanceBy,
    advanceTo,
    set,
    solar,
  };
}
