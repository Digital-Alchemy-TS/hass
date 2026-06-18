/**
 * Tests for mock_assistant.scenario (WS-D: Simulation engine, Pillar 4)
 *
 * Covers:
 * - Scripted timeline: at / advanceTo / assert / fireSequence / run ordering
 * - Solver: buildMomentContext / buildMomentTime / findMoment throws when no match
 * - Seeded simulation (F1/F2/F4):
 *   - chaos mode (no provider): reproducible from seed, no anchoring; same seed →
 *     identical MASTER_STATE world end-to-end; different seed → different draw
 *   - anchored mode (provider present): reproducible anchorMs across booted runs,
 *     worldAt called; F1 fake-clock path settled via the WS-B tick-drain primitive
 *     (mock_assistant.time.advanceBy) so the emitChange→sleep does not hang
 * - Matrix (F3): cartesian completeness, inline values, provider.observedValues path
 * - PRNG: same seed → same sequence (createPRNG)
 *
 * No live sqlite provider is used; a hand-rolled fake DataProvider exercises all
 * data-layer paths deterministically.
 *
 * ## Timezone contract
 * All HH:mm literals are UTC. Tests set `vi.setSystemTime` to a UTC midnight date.
 */

import { MINUTE } from "@digital-alchemy/core";
import dayjs from "dayjs";

import type { ENTITY_STATE } from "../index.mts";
import type {
  DataProvider,
  FoundMoment,
  MomentPredicate,
} from "../mock_assistant/helpers/data-provider.mts";
import { hassTestRunner } from "../mock_assistant/index.mts";
import {
  buildMomentContext,
  buildMomentTime,
  CHAOS_DWELL_WINDOW_MS,
  createPRNG,
} from "../mock_assistant/services/scenario.service.mts";
import type { ANY_ENTITY } from "../user.mts";

// ─────────────────────────────────────────────────────────────────────────────
// Named constants
// ─────────────────────────────────────────────────────────────────────────────

/** Anchor date used across all tests: 2024-06-15 UTC midnight */
const ANCHOR_DATE = "2024-06-15T00:00:00.000Z";
/** Epoch-ms for ANCHOR_DATE */
const ANCHOR_MS = new Date(ANCHOR_DATE).getTime();

/** An arbitrary stable seed for reproducibility tests */
const STABLE_SEED = 7;

/** Entity IDs that exist in fixtures.json (augment HassEntitySetupMapping) */
const ENTITY_SWITCH = "switch.porch_light" as const;
const ENTITY_SENSOR = "sensor.magic" as const;
const ENTITY_BINARY = "binary_sensor.bedroom_window" as const;

/** Hours offset for worldB anchor (4 hours after ANCHOR_DATE) */
const WORLD_B_HOUR_OFFSET = 4;

/** Seeded-draw dwell window — re-used from the engine, not re-derived inline. */
const SIM_DWELL_WINDOW_MS = CHAOS_DWELL_WINDOW_MS;

// ─────────────────────────────────────────────────────────────────────────────
// Fake DataProvider
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A hand-rolled fake DataProvider for unit-testing the simulation engine.
 *
 * Two canned worlds at different timestamps — enough to exercise solver,
 * worldAt, and observedValues without any sqlite dependency.
 */
function makeFakeProvider(): DataProvider {
  const noContext = {
    id: "ctx-a",
    parent_id: void 0 as unknown as string,
    user_id: void 0 as unknown as string,
  };
  const anchorDay = dayjs(ANCHOR_DATE);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type LooseEntityState = ENTITY_STATE<ANY_ENTITY> & { state: any };

  const worldA: Record<string, LooseEntityState> = {
    [ENTITY_BINARY]: {
      attributes: {},
      context: noContext,
      entity_id: ENTITY_BINARY,
      last_changed: anchorDay,
      last_reported: anchorDay,
      last_updated: anchorDay,
      state: "off",
    } as LooseEntityState,
    [ENTITY_SENSOR]: {
      attributes: {},
      context: noContext,
      entity_id: ENTITY_SENSOR,
      last_changed: anchorDay,
      last_reported: anchorDay,
      last_updated: anchorDay,
      state: "unavailable",
    } as LooseEntityState,
    [ENTITY_SWITCH]: {
      attributes: {},
      context: noContext,
      entity_id: ENTITY_SWITCH,
      last_changed: anchorDay,
      last_reported: anchorDay,
      last_updated: anchorDay,
      state: "off",
    } as LooseEntityState,
  };

  // A second world, 4 hours later, with the switch on and binary sensor open
  const laterMs = ANCHOR_MS + WORLD_B_HOUR_OFFSET * 60 * MINUTE;
  const worldB: Record<string, LooseEntityState> = {
    [ENTITY_BINARY]: { ...worldA[ENTITY_BINARY]!, entity_id: ENTITY_BINARY, state: "on" },
    [ENTITY_SENSOR]: { ...worldA[ENTITY_SENSOR]!, entity_id: ENTITY_SENSOR, state: "42" },
    [ENTITY_SWITCH]: { ...worldA[ENTITY_SWITCH]!, entity_id: ENTITY_SWITCH, state: "on" },
  };

  const worlds: Array<{ ms: number; world: Record<string, ENTITY_STATE<ANY_ENTITY>> }> = [
    { ms: ANCHOR_MS, world: worldA },
    { ms: laterMs, world: worldB },
  ];

  return {
    findMoment(predicate: MomentPredicate): FoundMoment {
      for (const { ms, world } of worlds) {
        const ctx = buildMomentContext(world, ms);
        if (predicate(ctx)) {
          return {
            at: ms,
            world: world as Record<ANY_ENTITY, ENTITY_STATE<ANY_ENTITY>>,
          };
        }
      }
      throw new Error(
        "No recorded moment satisfies the predicate — cannot fabricate a world (Pillar 4 solver)",
      );
    },

    observedValues(entity_id) {
      const seen = new Set<string>();
      for (const { world } of worlds) {
        const entry = world[entity_id as string];
        if (entry !== undefined) {
          seen.add(String(entry.state));
        }
      }
      return [...seen] as ReturnType<DataProvider["observedValues"]>;
    },

    worldAt(ts: number | ReturnType<typeof dayjs>) {
      const tsMs = typeof ts === "number" ? ts : ts.valueOf();
      // Return worldB when ts is at or after laterMs, else worldA
      const w = tsMs >= worlds[1]!.ms ? worlds[1]!.world : worlds[0]!.world;
      return w as Record<ANY_ENTITY, ENTITY_STATE<ANY_ENTITY>>;
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PRNG — reproducibility
// ─────────────────────────────────────────────────────────────────────────────

describe("createPRNG", () => {
  it("same seed produces the same sequence", () => {
    const a = createPRNG(STABLE_SEED);
    const b = createPRNG(STABLE_SEED);
    const aVals = Array.from({ length: 20 }, () => a());
    const bVals = Array.from({ length: 20 }, () => b());
    expect(aVals).toEqual(bVals);
  });

  it("different seeds produce different sequences", () => {
    const a = createPRNG(1);
    const b = createPRNG(2);
    const aFirst = a();
    const bFirst = b();
    expect(aFirst).not.toBe(bFirst);
  });

  it("produces values in [0, 1)", () => {
    const prng = createPRNG(123);
    for (let i = 0; i < 50; i++) {
      const v = prng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildMomentTime
// ─────────────────────────────────────────────────────────────────────────────

describe("buildMomentTime", () => {
  it("exposes the .at epoch-ms value", () => {
    const t = buildMomentTime(ANCHOR_MS);
    expect(t.at).toBe(ANCHOR_MS);
  });

  it("after() is true when atMs >= numeric input", () => {
    const t = buildMomentTime(ANCHOR_MS + 1000);
    expect(t.after(ANCHOR_MS)).toBe(true);
    expect(t.after(ANCHOR_MS + 2000)).toBe(false);
  });

  it("before() is true when atMs <= numeric input", () => {
    const t = buildMomentTime(ANCHOR_MS);
    expect(t.before(ANCHOR_MS + 1000)).toBe(true);
    expect(t.before(ANCHOR_MS - 1000)).toBe(false);
  });

  it("after() parses HH:mm UTC string against the atMs date", () => {
    // ANCHOR_DATE is 2024-06-15T00:00:00Z; atMs = anchor + 17 hours
    const atMs = ANCHOR_MS + 17 * 60 * MINUTE;
    const t = buildMomentTime(atMs);
    // after 16:00 UTC on the same day → true (17:00 >= 16:00)
    expect(t.after("16:00")).toBe(true);
    // after 18:00 UTC → false
    expect(t.after("18:00")).toBe(false);
  });

  it("before() parses HH:mm UTC string", () => {
    const atMs = ANCHOR_MS + 10 * 60 * MINUTE; // 10:00 UTC
    const t = buildMomentTime(atMs);
    expect(t.before("11:00")).toBe(true);
    expect(t.before("09:00")).toBe(false);
  });

  it("after() accepts a Dayjs value", () => {
    const atMs = ANCHOR_MS + 60 * MINUTE;
    const t = buildMomentTime(atMs);
    expect(t.after(dayjs(ANCHOR_MS))).toBe(true);
    expect(t.after(dayjs(ANCHOR_MS + 2 * 60 * MINUTE))).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildMomentContext
// ─────────────────────────────────────────────────────────────────────────────

describe("buildMomentContext", () => {
  const provider = makeFakeProvider();

  it("entity().is() returns true for matching state", () => {
    const world = provider.worldAt(ANCHOR_MS);
    const ctx = buildMomentContext(world as Record<string, ENTITY_STATE<ANY_ENTITY>>, ANCHOR_MS);
    // In worldA the switch is off
    expect(ctx.entity(ENTITY_SWITCH).is("off")).toBe(true);
    expect(ctx.entity(ENTITY_SWITCH).is("on")).toBe(false);
  });

  it("entity().state returns the reconstructed state", () => {
    const world = provider.worldAt(ANCHOR_MS);
    const ctx = buildMomentContext(world as Record<string, ENTITY_STATE<ANY_ENTITY>>, ANCHOR_MS);
    expect(ctx.entity(ENTITY_BINARY).state).toBe("off");
  });

  it("time.at matches the passed-in epoch-ms", () => {
    const world = provider.worldAt(ANCHOR_MS);
    const ctx = buildMomentContext(world as Record<string, ENTITY_STATE<ANY_ENTITY>>, ANCHOR_MS);
    expect(ctx.time.at).toBe(ANCHOR_MS);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Solver — DataProvider.findMoment
// ─────────────────────────────────────────────────────────────────────────────

describe("DataProvider.findMoment (solver)", () => {
  const provider = makeFakeProvider();

  it("returns the first moment that satisfies the predicate", () => {
    // worldB has switch.porch_light = "on"
    const result = provider.findMoment(({ entity }) => entity(ENTITY_SWITCH).is("on"));
    expect(result.at).toBe(ANCHOR_MS + WORLD_B_HOUR_OFFSET * 60 * MINUTE);
    expect(result.world[ENTITY_SWITCH]?.state).toBe("on");
  });

  it("matches on a time predicate (after HH:mm UTC)", () => {
    // worldA is at 00:00 UTC; worldB is at 04:00 UTC
    const result = provider.findMoment(({ time }) => time.after("03:00"));
    expect(result.at).toBe(ANCHOR_MS + WORLD_B_HOUR_OFFSET * 60 * MINUTE);
  });

  it("throws when no moment satisfies the predicate (loud failure, never fabricates)", () => {
    expect(() => {
      provider.findMoment(() => false);
    }).toThrow();
  });

  it("combined predicate: entity state + time.after", () => {
    const result = provider.findMoment(
      ({ entity, time }) => entity(ENTITY_BINARY).is("on") && time.after("03:00"),
    );
    expect(result.world[ENTITY_BINARY]?.state).toBe("on");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Scripted timeline
// ─────────────────────────────────────────────────────────────────────────────

describe("mock_assistant.scenario — scripted timeline", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("at() sets the clock and calls fn at that moment", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));
    const callLog: string[] = [];

    await hassTestRunner.run(async ({ mock_assistant }) => {
      await mock_assistant
        .scenario()
        .at("08:00", () => {
          callLog.push(`at:${new Date().getUTCHours()}`);
        })
        .run();
    });

    expect(callLog).toEqual(["at:8"]);
  });

  it("steps execute in declaration order", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));
    const log: string[] = [];

    await hassTestRunner.run(async ({ mock_assistant }) => {
      await mock_assistant
        .scenario()
        .at("06:00", () => {
          log.push("step1");
        })
        .assert(() => {
          log.push("step2");
        })
        .at("06:30", () => {
          log.push("step3");
        })
        .run();
    });

    expect(log).toEqual(["step1", "step2", "step3"]);
  });

  it("advanceTo() advances the fake clock", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));
    let clockHour = -1;

    await hassTestRunner.run(async ({ mock_assistant }) => {
      await mock_assistant
        .scenario()
        .advanceTo("12:00")
        .assert(() => {
          clockHour = new Date().getUTCHours();
        })
        .run();
    });

    expect(clockHour).toBe(12);
  });

  it("fireSequence() emits each state via emitChange", async () => {
    // No fake timers needed — fireSequence only calls emitChange (no time advancement)
    expect.assertions(1);
    const states: string[] = [];

    await hassTestRunner.run(({ lifecycle, event, mock_assistant }) => {
      event.on(ENTITY_SWITCH, (new_state: ENTITY_STATE<typeof ENTITY_SWITCH>) => {
        states.push(new_state.state);
      });

      lifecycle.onReady(async () => {
        await mock_assistant.scenario().fireSequence(ENTITY_SWITCH, ["on", "off", "on"]).run();

        expect(states).toEqual(["on", "off", "on"]);
      });
    });
  });

  it("assert() can fail and propagates the error", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));

    await expect(
      hassTestRunner.run(async ({ mock_assistant }) => {
        await mock_assistant
          .scenario()
          .assert(() => {
            throw new Error("intentional assert failure");
          })
          .run();
      }),
    ).rejects.toThrow("intentional assert failure");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Seeded simulation — chaos mode (F4: no provider)
// ─────────────────────────────────────────────────────────────────────────────

describe("mock_assistant.scenario({ seed }).simulate — chaos mode (F4)", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  it("produces anchorMs = 0 in chaos mode", async () => {
    expect.assertions(1);
    await hassTestRunner.run(({ lifecycle, mock_assistant }) => {
      lifecycle.onReady(async () => {
        const result = await mock_assistant
          .scenario({ seed: STABLE_SEED })
          .simulate({ entities: [ENTITY_SWITCH] });
        expect(result.anchorMs).toBe(0);
      });
    });
  });

  it("seeds entity states without throwing (switch domain)", async () => {
    expect.assertions(2);
    await hassTestRunner.run(({ lifecycle, mock_assistant }) => {
      lifecycle.onReady(async () => {
        const result = await mock_assistant
          .scenario({ seed: STABLE_SEED })
          .simulate({ entities: [ENTITY_SWITCH] });
        expect(Object.keys(result.initialStates)).toContain(ENTITY_SWITCH);
        const state = result.initialStates[ENTITY_SWITCH];
        expect(["on", "off"]).toContain(state);
      });
    });
  });

  it("same seed produces same initial states (reproducibility)", async () => {
    expect.assertions(1);
    let result1: Record<string, string> = {};
    let result2: Record<string, string> = {};

    await hassTestRunner.run(({ lifecycle, mock_assistant }) => {
      lifecycle.onReady(async () => {
        const r = await mock_assistant
          .scenario({ seed: STABLE_SEED })
          .simulate({ entities: [ENTITY_SWITCH, ENTITY_BINARY] });
        result1 = r.initialStates;
      });
    });

    await hassTestRunner.run(({ lifecycle, mock_assistant }) => {
      lifecycle.onReady(async () => {
        const r = await mock_assistant
          .scenario({ seed: STABLE_SEED })
          .simulate({ entities: [ENTITY_SWITCH, ENTITY_BINARY] });
        result2 = r.initialStates;
      });
    });

    expect(result1).toEqual(result2);
  });

  it("same seed → identical MASTER_STATE world across two booted runs (integration reproducibility)", async () => {
    // The strongest reproducibility assertion: boot the live mock twice, seed via
    // simulate() through the socket path, and read the resulting world straight out
    // of MASTER_STATE (hass.entity.getCurrentState) — not the returned initialStates.
    // Identical seed must yield byte-identical resulting worlds in the canonical store.
    expect.assertions(1);
    const entities = [ENTITY_SWITCH, ENTITY_BINARY, ENTITY_SENSOR];
    const readWorld = async (): Promise<Record<string, string>> => {
      const world: Record<string, string> = {};
      await hassTestRunner.run(({ lifecycle, mock_assistant, hass }) => {
        lifecycle.onReady(async () => {
          await mock_assistant.scenario({ seed: STABLE_SEED }).simulate({ entities });
          for (const eid of entities) {
            world[eid] = String(hass.entity.getCurrentState(eid as ANY_ENTITY)?.state ?? "");
          }
        });
      });
      await hassTestRunner.teardown();
      return world;
    };

    const world1 = await readWorld();
    const world2 = await readWorld();
    expect(world1).toEqual(world2);
  });

  it("different seed → different resulting MASTER_STATE world (or different draw)", async () => {
    // Different seeds must drive a different draw. We compare the returned initialStates
    // across many entities so the probability of an accidental collision is negligible.
    expect.assertions(1);
    const entities = Array.from({ length: 12 }, (_, i) => `switch.sim_${i}`);
    const draw = async (seed: number): Promise<Record<string, string>> => {
      let states: Record<string, string> = {};
      await hassTestRunner.run(({ lifecycle, mock_assistant }) => {
        lifecycle.onReady(async () => {
          // Register the synthetic entities first (WS-A register API) so emitChange's
          // MISSING_ENTITY guard passes — simulate() seeds existing entities only.
          for (const eid of entities) {
            mock_assistant.entity.register(eid as ANY_ENTITY, { state: "off" });
          }
          states = (await mock_assistant.scenario({ seed }).simulate({ entities })).initialStates;
        });
      });
      await hassTestRunner.teardown();
      return states;
    };

    const drawA = await draw(1);
    const drawB = await draw(99_999);
    expect(drawA).not.toEqual(drawB);
  });

  it("chaos-mode simulate() succeeds and lands seeded states in MASTER_STATE for unregistered entities", async () => {
    // Pillar 4 / F4 contract: simulate({entities, seed}) must work STANDALONE without
    // the caller pre-registering each entity via mock_assistant.entity.register.
    // Auto-registration must happen inside simulate() before emitChange is called.
    // Assert via hass.entity.getCurrentState (canonical MASTER_STATE store), not just
    // the returned initialStates, to confirm the socket→MASTER_STATE write path landed.
    expect.assertions(4);

    // Use synthetic entity ids that are definitely not in fixtures.json
    const CHAOS_SWITCH = "switch.chaos_standalone_a" as ANY_ENTITY;
    const CHAOS_BINARY = "binary_sensor.chaos_standalone_b" as ANY_ENTITY;
    const entities = [CHAOS_SWITCH as string, CHAOS_BINARY as string];

    let initialStates: Record<string, string> = {};
    let switchMasterState = "";
    let binaryMasterState = "";

    await hassTestRunner.run(({ lifecycle, mock_assistant, hass }) => {
      lifecycle.onReady(async () => {
        // Entities are NOT pre-registered — simulate() must handle this itself.
        const result = await mock_assistant.scenario({ seed: STABLE_SEED }).simulate({ entities });

        initialStates = result.initialStates;
        switchMasterState = String(hass.entity.getCurrentState(CHAOS_SWITCH)?.state ?? "");
        binaryMasterState = String(hass.entity.getCurrentState(CHAOS_BINARY)?.state ?? "");
      });
    });

    // initialStates must cover both entities with domain-valid chaos values
    expect(["on", "off"]).toContain(initialStates[CHAOS_SWITCH as string]);
    expect(["on", "off"]).toContain(initialStates[CHAOS_BINARY as string]);

    // MASTER_STATE must reflect what simulate() seeded (socket→MASTER_STATE path)
    expect(switchMasterState).toBe(initialStates[CHAOS_SWITCH as string]);
    expect(binaryMasterState).toBe(initialStates[CHAOS_BINARY as string]);
  });

  it("same-seed chaos simulate() is reproducible for unregistered entities", async () => {
    // Auto-registration must not break same-seed reproducibility: seeding an unregistered
    // entity must yield the same chaos draw as seeding a pre-registered one with the same seed.
    expect.assertions(1);

    const CHAOS_A = "switch.chaos_repro_a" as ANY_ENTITY;
    const CHAOS_B = "binary_sensor.chaos_repro_b" as ANY_ENTITY;
    const entities = [CHAOS_A as string, CHAOS_B as string];

    const readWorld = async (): Promise<Record<string, string>> => {
      let states: Record<string, string> = {};
      await hassTestRunner.run(({ lifecycle, mock_assistant }) => {
        lifecycle.onReady(async () => {
          states = (await mock_assistant.scenario({ seed: STABLE_SEED }).simulate({ entities }))
            .initialStates;
        });
      });
      await hassTestRunner.teardown();
      return states;
    };

    const world1 = await readWorld();
    const world2 = await readWorld();
    expect(world1).toEqual(world2);
  });

  it("synthetic events are replayed after initial seeding", async () => {
    expect.assertions(1);
    const seen: string[] = [];

    await hassTestRunner.run(({ lifecycle, event, mock_assistant }) => {
      lifecycle.onReady(async () => {
        event.on(ENTITY_SWITCH, (new_state: ENTITY_STATE<typeof ENTITY_SWITCH>) => {
          seen.push(new_state.state);
        });

        await mock_assistant.scenario({ seed: STABLE_SEED }).simulate({
          entities: [ENTITY_SWITCH],
          events: [{ entity_id: ENTITY_SWITCH, state: "on" }],
        });

        // The last event should be "on"
        expect(seen.at(-1)).toBe("on");
      });
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Seeded simulation — anchored mode (F1/F2: provider present)
// ─────────────────────────────────────────────────────────────────────────────

describe("mock_assistant.scenario({ seed, anchor: provider }).simulate — anchored mode (F1/F2)", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  it("anchorMs is non-zero when a provider is supplied", async () => {
    expect.assertions(1);
    const provider = makeFakeProvider();

    await hassTestRunner.run(({ lifecycle, mock_assistant }) => {
      lifecycle.onReady(async () => {
        const result = await mock_assistant
          .scenario({ anchor: provider, seed: STABLE_SEED })
          .simulate({ entities: [ENTITY_SWITCH] });
        expect(result.anchorMs).toBeGreaterThan(0);
      });
    });
  });

  it("initialStates come from provider.worldAt (uses real entity states)", async () => {
    expect.assertions(1);
    const provider = makeFakeProvider();

    await hassTestRunner.run(({ lifecycle, mock_assistant }) => {
      lifecycle.onReady(async () => {
        const result = await mock_assistant
          .scenario({ anchor: provider, seed: STABLE_SEED })
          .simulate({ entities: [ENTITY_SWITCH] });

        // The switch's state must be one of the values present in the provider worlds
        const observedStates = provider.observedValues(ENTITY_SWITCH);
        const seededState = result.initialStates[ENTITY_SWITCH];
        expect(observedStates).toContain(seededState);
      });
    });
  });

  it("same seed → identical anchorMs across two booted runs (integration reproducibility)", async () => {
    // True integration reproducibility: boot the runner twice under fake timers,
    // run the anchored simulate() against the live mock each time, and assert the
    // PRNG-derived anchorMs is identical. anchorMs derives from Date.now(), so we
    // pin the clock before each run() (both share baseMs == ANCHOR_MS, the F1 contract).
    expect.assertions(1);
    let anchor1 = -1;
    let anchor2 = -1;
    const provider = makeFakeProvider();

    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));
    await hassTestRunner.run(({ lifecycle, mock_assistant }) => {
      lifecycle.onReady(async () => {
        const simPromise = mock_assistant
          .scenario({ anchor: provider, seed: STABLE_SEED })
          .simulate({ entities: [ENTITY_SWITCH] });
        await mock_assistant.time.advanceBy(MINUTE);
        anchor1 = (await simPromise).anchorMs;
      });
    });
    await hassTestRunner.teardown();
    vi.useRealTimers();

    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));
    await hassTestRunner.run(({ lifecycle, mock_assistant }) => {
      lifecycle.onReady(async () => {
        const simPromise = mock_assistant
          .scenario({ anchor: provider, seed: STABLE_SEED })
          .simulate({ entities: [ENTITY_SWITCH] });
        await mock_assistant.time.advanceBy(MINUTE);
        anchor2 = (await simPromise).anchorMs;
      });
    });
    await hassTestRunner.teardown();
    vi.useRealTimers();

    expect(anchor1).toBe(anchor2);
  });

  it("F1: fake clock set before simulate — anchored draw resolves through MASTER_STATE", async () => {
    // F1 integration contract, driven by the WS-B tick-drain primitive instead of a
    // bare vi.useFakeTimers() that the original WS-D author claimed would hang.
    //
    // The earlier WS-D claim ("emitChange → sleep(EMIT_SLEEP) hangs under fake timers")
    // was real ONLY because nothing drove the fake clock during that 1ms sleep. WS-B
    // already solved this: advance the fake clock in ticks while draining the microtask
    // queue so the awaited sleep resolves. simulate() seeds via emitChange (socket path
    // → MASTER_STATE), so we kick simulate() off, then drive settle with time.advanceBy.
    expect.assertions(2);
    const provider = makeFakeProvider();

    vi.useFakeTimers();
    vi.setSystemTime(new Date(ANCHOR_DATE));

    let resultAnchorMs = -1;
    let masterStateValue = "";

    await hassTestRunner.run(({ lifecycle, mock_assistant, hass }) => {
      lifecycle.onReady(async () => {
        // Kick the simulation; do NOT await yet — its emitChange awaits a fake-timer
        // sleep that only resolves once we drive the clock.
        const simPromise = mock_assistant
          .scenario({ anchor: provider, seed: STABLE_SEED })
          .simulate({ entities: [ENTITY_SWITCH] });
        // Drive the clock to settle the EMIT_SLEEP sleep(s) inside simulate().
        await mock_assistant.time.advanceBy(MINUTE);
        const result = await simPromise;
        resultAnchorMs = result.anchorMs;
        // The seeded state must have landed in MASTER_STATE via the socket path.
        masterStateValue = String(hass.entity.getCurrentState(ENTITY_SWITCH)?.state ?? "");
      });
    });
    await hassTestRunner.teardown();
    vi.useRealTimers();

    // baseMs == Date.now() == ANCHOR_MS under the fake clock → anchor within one day of it.
    expect(Math.abs(resultAnchorMs - ANCHOR_MS)).toBeLessThanOrEqual(SIM_DWELL_WINDOW_MS);
    // MASTER_STATE reflects an observed provider value (true integration, not PRNG-only).
    expect(provider.observedValues(ENTITY_SWITCH)).toContain(masterStateValue);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Matrix (F3) — cartesian product
// ─────────────────────────────────────────────────────────────────────────────

describe("mock_assistant.scenario.matrix (F3)", () => {
  afterEach(async () => {
    await hassTestRunner.teardown();
    vi.restoreAllMocks();
  });

  it("produces the full cartesian product for 2 entities × 2 values each (4 combos)", async () => {
    await hassTestRunner.run(async ({ mock_assistant }) => {
      const { combos } = await mock_assistant.scenario
        .matrix({
          [ENTITY_BINARY]: ["on", "off"],
          [ENTITY_SWITCH]: ["on", "off"],
        })
        .each(() => void 0);

      expect(combos).toHaveLength(4);
    });
  });

  it("each combo contains all entity keys", async () => {
    await hassTestRunner.run(async ({ mock_assistant }) => {
      const { combos } = await mock_assistant.scenario
        .matrix({
          [ENTITY_BINARY]: ["on", "off"],
          [ENTITY_SWITCH]: ["on", "off"],
        })
        .each(() => void 0);

      for (const combo of combos) {
        expect(Object.keys(combo)).toContain(ENTITY_BINARY);
        expect(Object.keys(combo)).toContain(ENTITY_SWITCH);
      }
    });
  });

  it("covers every combination exactly once (no duplicates)", async () => {
    await hassTestRunner.run(async ({ mock_assistant }) => {
      const { combos } = await mock_assistant.scenario
        .matrix({
          [ENTITY_BINARY]: ["on", "off"],
          [ENTITY_SWITCH]: ["on", "off"],
        })
        .each(() => void 0);

      const serialized = combos.map(c => JSON.stringify(c));
      const unique = new Set(serialized);
      expect(unique.size).toBe(combos.length);
    });
  });

  it("3 entities × 2 values each = 8 combos", async () => {
    await hassTestRunner.run(async ({ mock_assistant }) => {
      const { combos } = await mock_assistant.scenario
        .matrix({
          [ENTITY_BINARY]: ["on", "off"],
          [ENTITY_SENSOR]: ["0", "1"],
          [ENTITY_SWITCH]: ["on", "off"],
        })
        .each(() => void 0);

      expect(combos).toHaveLength(8);
    });
  });

  it("single entity produces combos equal to value count", async () => {
    await hassTestRunner.run(async ({ mock_assistant }) => {
      const { combos } = await mock_assistant.scenario
        .matrix({
          [ENTITY_SWITCH]: ["on", "off", "unavailable"],
        })
        .each(() => void 0);

      expect(combos).toHaveLength(3);
    });
  });

  it("each() callback receives the combo and results are collected", async () => {
    await hassTestRunner.run(async ({ mock_assistant }) => {
      const seen: string[] = [];
      const { results } = await mock_assistant.scenario
        .matrix({
          [ENTITY_SWITCH]: ["on", "off"],
        })
        .each(combo => {
          seen.push(combo[ENTITY_SWITCH]!);
          return combo[ENTITY_SWITCH];
        });

      expect(seen).toEqual(["on", "off"]);
      expect(results).toEqual(["on", "off"]);
    });
  });

  it("values sourced from provider.observedValues — covers all observed states", async () => {
    const provider = makeFakeProvider();

    await hassTestRunner.run(async ({ mock_assistant }) => {
      const observedSwitch = provider.observedValues(ENTITY_SWITCH);
      const observedBinary = provider.observedValues(ENTITY_BINARY);

      const { combos } = await mock_assistant.scenario
        .matrix({
          [ENTITY_BINARY]: observedBinary as string[],
          [ENTITY_SWITCH]: observedSwitch as string[],
        })
        .each(() => void 0);

      // Every observed state must appear in at least one combo
      for (const state of observedSwitch) {
        expect(combos.some(c => c[ENTITY_SWITCH] === state)).toBe(true);
      }
      for (const state of observedBinary) {
        expect(combos.some(c => c[ENTITY_BINARY] === state)).toBe(true);
      }
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DataProvider.observedValues
// ─────────────────────────────────────────────────────────────────────────────

describe("DataProvider.observedValues", () => {
  const provider = makeFakeProvider();

  it("returns distinct states seen for the entity across provider content", () => {
    const states = provider.observedValues(ENTITY_SWITCH);
    // worldA = "off", worldB = "on"
    expect(states).toContain("off");
    expect(states).toContain("on");
    // no duplicates
    expect(states.length).toBe(new Set(states).size);
  });

  it("binary sensor observed as both on and off", () => {
    const states = provider.observedValues(ENTITY_BINARY);
    expect(states).toContain("off");
    expect(states).toContain("on");
  });
});
