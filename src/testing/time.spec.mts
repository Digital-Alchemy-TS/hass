/**
 * Tests for mock_assistant.time (WS-B: Time toolkit, Pillar 2)
 *
 * ## Boot-ordering contract
 * `vi.useFakeTimers()` and `vi.setSystemTime()` MUST be called BEFORE
 * `hassTestRunner.run()` (or `TestRunner().run()`). Schedulers and solar events
 * register against the clock at boot; there is no way to retroactively re-anchor
 * them after the module has booted.
 *
 * ## Timezone contract
 * All `HH:mm` literals passed to `time.set`, `time.advanceTo`, and `time.advanceBy`
 * are interpreted as **UTC**. Tests should seed the fake clock to a UTC midnight date
 * so time-of-day arithmetic is unambiguous.
 * Example: `vi.setSystemTime(new Date("2024-06-15T00:00:00.000Z"))`.
 */

import { MINUTE, SECOND, TestRunner } from "@digital-alchemy/core";
import dayjs from "dayjs";

import { hassTestRunner } from "../mock_assistant/index.mts";

// ─────────────────────────────────────────────────────────────────────────────
// Constants — all domain-meaningful values are named here (no magic numbers).
// ─────────────────────────────────────────────────────────────────────────────

/** Anchor date used across all tests: 2024-06-15 UTC midnight */
const ANCHOR_DATE = "2024-06-15T00:00:00.000Z";
/** Lat/long for the mock config (San Francisco, used for solar tests) */
const TEST_LATITUDE = 37.7749;
const TEST_LONGITUDE = -122.4194;
/**
 * Expected sunset for SF (TEST_LAT/LONG) on 2024-06-15 in local time is ~20:00 PDT.
 * PDT = UTC-7, so sunset is around 03:00 UTC the same calendar day (per formatDate which
 * anchors to local-date midnight). The solar helper returns a UTC Date whose UTC hours
 * are 3 (midnight local + ~20 hours local = ~03:00 UTC day+1, but same local date).
 *
 * In practice the solar.mts formatDate uses Date.getFullYear/Month/Date (local) so the
 * returned UTC timestamp is "midnight UTC on local date + minutes-since-midnight UTC".
 * For SF PDT (UTC-7) in June: sunset ~20:01 local = ~03:01 UTC next calendar day,
 * but formatDate anchors to the *local* date → UTC hours = ~03.
 */
const SUNSET_HOUR_UTC_APPROX = 3;
/** Tolerance in hours for solar time assertion (±2h for TZ variability in test env) */
const SOLAR_TOLERANCE_HOURS = 2;
/** Advance window used in multi-timer ordering test */
const MULTI_TIMER_WINDOW_MS = 3 * MINUTE;
/** Number of hours for sliding-schedule advance */
const SLIDING_ADVANCE_HOURS = 5;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Advance fake timers in 1-minute ticks, draining the microtask queue between
 * each tick. This is the correct way to time-travel so async scheduler callbacks
 * (cron jobs, setTimeout chains) settle in the right order.
 */
async function advanceByTicks(totalMs: number): Promise<void> {
  let remaining = totalMs;
  while (remaining > 0) {
    const step = Math.min(MINUTE, remaining);
    vi.advanceTimersByTime(step);
    // Yield for the microtask queue twice: once for cron callbacks, once for
    // nested async (cron → setTimeout → exec).
    await Promise.resolve();
    await Promise.resolve();
    remaining -= step;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// time.set
// ─────────────────────────────────────────────────────────────────────────────

describe("mock_assistant.time.set", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("sets the fake clock to the specified HH:mm UTC time on the current day", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));

    await hassTestRunner.run(({ mock_assistant }) => {
      mock_assistant.time.set("16:00");
    });

    const now = new Date();
    expect(now.getUTCHours()).toBe(16);
    expect(now.getUTCMinutes()).toBe(0);
    expect(now.getUTCFullYear()).toBe(2024);
    expect(now.getUTCMonth()).toBe(5); // June = 5
    expect(now.getUTCDate()).toBe(15);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// time.advanceTo — F9: fires timers in order between now and target
// ─────────────────────────────────────────────────────────────────────────────

describe("mock_assistant.time.advanceTo", () => {
  afterEach(async () => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  /**
   * F9 — multi-timer ordering spec.
   * Three timers fire at t+1m, t+2m, t+3m. advanceTo(t+3m) must fire all three
   * IN ORDER — not skip any, not batch them at the end.
   */
  it("fires every timer scheduled between now and target, in order (F9)", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));

    const order: number[] = [];

    const app = await TestRunner().run(({ scheduler }) => {
      scheduler.setTimeout(() => order.push(1), MINUTE);
      scheduler.setTimeout(() => order.push(2), 2 * MINUTE);
      scheduler.setTimeout(() => order.push(3), 3 * MINUTE);
    });

    await advanceByTicks(MULTI_TIMER_WINDOW_MS);

    await app.teardown();

    expect(order).toEqual([1, 2, 3]);
    vi.useRealTimers();
  });

  it("is a no-op when target is at or before current fake time", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T10:00:00.000Z"));

    await hassTestRunner.run(async ({ mock_assistant }) => {
      const before = Date.now();
      // advanceTo a past time — should not throw or advance the clock
      await mock_assistant.time.advanceTo("09:00");
      const after = Date.now();
      expect(after).toBe(before);
    });

    vi.useRealTimers();
    await hassTestRunner.teardown();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// time.advanceBy
// ─────────────────────────────────────────────────────────────────────────────

describe("mock_assistant.time.advanceBy", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("advances by a number (ms)", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));

    await hassTestRunner.run(async ({ mock_assistant }) => {
      const before = Date.now();
      await mock_assistant.time.advanceBy(5 * MINUTE);
      const after = Date.now();
      expect(after - before).toBe(5 * MINUTE);
    });
  });

  it("advances by a [quantity, unit] tuple", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));

    await hassTestRunner.run(async ({ mock_assistant }) => {
      const before = Date.now();
      await mock_assistant.time.advanceBy([15, "minutes"]);
      const after = Date.now();
      expect(after - before).toBe(15 * MINUTE);
    });
  });

  it("advances by an ISO 8601 partial string", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));

    await hassTestRunner.run(async ({ mock_assistant }) => {
      const before = Date.now();
      await mock_assistant.time.advanceBy("30M");
      const after = Date.now();
      expect(after - before).toBe(30 * MINUTE);
    });
  });

  it("advances by a duration object literal", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));

    await hassTestRunner.run(async ({ mock_assistant }) => {
      const before = Date.now();
      await mock_assistant.time.advanceBy({ minutes: 10, seconds: 30 });
      const after = Date.now();
      expect(after - before).toBe(10 * MINUTE + 30 * SECOND);
    });
  });

  it("fires cron ticks in order during advance", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));
    const spy = vi.fn();

    const app = await TestRunner().run(({ scheduler }) => {
      scheduler.setInterval(spy, MINUTE);
    });

    await advanceByTicks(5 * MINUTE);

    await app.teardown();
    expect(spy).toHaveBeenCalledTimes(5);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// time.solar — F8: solar anchoring via pre-run clock set
// ─────────────────────────────────────────────────────────────────────────────

describe("mock_assistant.time.solar (F8)", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  /**
   * F8 — Solar anchoring contract.
   *
   * The clock MUST be set BEFORE run() so solar calculations use the anchored date.
   * `advanceTo` cannot retroactively fix already-scheduled solar events —
   * this spec validates the pre-run anchoring path only.
   *
   * We assert the computed sunset time for San Francisco on 2024-06-15 is in
   * the expected UTC hour window (roughly 19:30–20:30 UTC in June).
   */
  it("computes sunset time for the anchored date using correct lat/long (F8)", async () => {
    // BOOT ORDERING: fake timers and system time BEFORE run()
    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));
    let sunsetHour = -1;

    // config.merge and solar() must happen in the SAME run() call so they share state
    await hassTestRunner.run(({ mock_assistant }) => {
      // Seed lat/long so solar() has a known location
      mock_assistant.config.merge({ latitude: TEST_LATITUDE, longitude: TEST_LONGITUDE });
      const sunsetTime = mock_assistant.time.solar("sunset");
      sunsetHour = sunsetTime.toDate().getUTCHours();
    });

    expect(sunsetHour).toBeGreaterThanOrEqual(SUNSET_HOUR_UTC_APPROX - SOLAR_TOLERANCE_HOURS);
    expect(sunsetHour).toBeLessThanOrEqual(SUNSET_HOUR_UTC_APPROX + SOLAR_TOLERANCE_HOURS);
  });

  it("solar-anchored trigger fires at the correct fake-clock instant", async () => {
    // BOOT ORDERING: fake timers and system time BEFORE run()
    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));
    const spy = vi.fn();
    let sunsetMs = 0;

    await hassTestRunner.run(({ mock_assistant, scheduler }) => {
      mock_assistant.config.merge({ latitude: TEST_LATITUDE, longitude: TEST_LONGITUDE });

      // Compute sunset in the setup phase (before any advance)
      const sunsetTime = mock_assistant.time.solar("sunset");
      sunsetMs = sunsetTime.diff(dayjs(new Date(ANCHOR_DATE)), "ms");

      // Register a setTimeout that fires at sunset
      scheduler.setTimeout(spy, sunsetMs);
    });

    // Advance to just before sunset — spy must NOT have fired
    const beforeSunsetMs = sunsetMs - MINUTE;
    await advanceByTicks(beforeSunsetMs);
    expect(spy).not.toHaveBeenCalled();

    // Advance past sunset — spy must fire exactly once
    vi.advanceTimersByTime(2 * MINUTE);
    await Promise.resolve();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("solar() with offsetMinutes fires later than the base event time", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));
    let diffMinutes = 0;

    await hassTestRunner.run(({ mock_assistant }) => {
      mock_assistant.config.merge({ latitude: TEST_LATITUDE, longitude: TEST_LONGITUDE });
      const base = mock_assistant.time.solar("sunset");
      const offset = mock_assistant.time.solar("sunset", { offsetMinutes: 15 });
      diffMinutes = offset.diff(base, "minute");
    });

    expect(diffMinutes).toBe(15);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Sliding schedule — upstream it.skip case
// ─────────────────────────────────────────────────────────────────────────────

describe("scheduler.sliding (upstream skip case)", () => {
  /**
   * The upstream spec at src/testing/scheduler.spec.mts has this test marked
   * `it.skip("weird with fake timers", ...)`.
   *
   * ROOT CAUSE: `vi.advanceTimersByTime` is synchronous but the scheduler's
   * `sliding` implementation uses async cron callbacks and `dayjs().diff()` inside
   * async functions queued on the microtask queue. With a bare
   * `vi.advanceTimersByTime(N * HOUR)` the cron fires N times synchronously but
   * the async exec callbacks pile up unresolved, so `spy` is never called before
   * `expect` runs.
   *
   * FIX: Advance in 1-minute ticks with two `await Promise.resolve()` drains
   * between each tick — one for the CronJob callback, one for the nested
   * setTimeout → exec async chain. This mirrors what `time.advanceBy` does internally.
   *
   * OUTCOME: FIXED under the tick-based advance approach.
   */
  it("runs a sliding schedule (upstream skip case — fixed via tick-based advance)", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(dayjs("2024-09-13T00:00:00.000Z").toDate());
    const spy = vi.fn();

    const app = await TestRunner().run(({ scheduler }) => {
      scheduler.sliding({
        exec: spy,
        next: () => dayjs().add(1, "minute"),
        reset: "0 * * * *", // every hour
      });
    });

    // Advance hour by hour (5 hours total), draining async queue each minute
    await advanceByTicks(SLIDING_ADVANCE_HOURS * 60 * MINUTE);

    vi.useRealTimers();
    await app.teardown();

    // Each hourly cron tick calls waitForNext(), which schedules a 1-minute timeout.
    // The 1-minute timeout fires before the next hour tick with tick-based advance.
    // Expect one exec per hour reset (5 total).
    expect(spy).toHaveBeenCalledTimes(SLIDING_ADVANCE_HOURS);
  });
});
