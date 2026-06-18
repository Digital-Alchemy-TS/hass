import type { TServiceParams } from "@digital-alchemy/core";
import { MINUTE, START } from "@digital-alchemy/core";
import type dayjs from "dayjs";

import type { ENTITY_STATE } from "../../helpers/utility.mts";
import type { ANY_ENTITY } from "../../user.mts";
import type {
  DataProvider,
  FoundMoment,
  MomentContext,
  MomentTime,
} from "../helpers/data-provider.mts";

// ─────────────────────────────────────────────────────────────────────────────
// Named constants — no magic numbers inlined
// ─────────────────────────────────────────────────────────────────────────────

/** Default PRNG seed when none is supplied. Arbitrary but stable. */
const DEFAULT_SEED = 42;

/**
 * Number of candidate moment offsets generated when doing a seeded random-anchor
 * draw against a DataProvider. Kept small so unit tests run fast.
 */
const SEEDED_SAMPLE_CANDIDATE_COUNT = 100;

/** Hours in one day — used to derive CHAOS_DWELL_WINDOW_MS. */
const HOURS_PER_DAY = 24;
/** Minutes per hour — used to derive CHAOS_DWELL_WINDOW_MS. */
const MINUTES_PER_HOUR = 60;

/**
 * Milliseconds spanning the synthetic dwell window used in chaos mode
 * (no provider). One full day.
 */
const CHAOS_DWELL_WINDOW_MS = HOURS_PER_DAY * MINUTES_PER_HOUR * MINUTE;

// ─────────────────────────────────────────────────────────────────────────────
// Mulberry32 PRNG — deterministic, seed-based, no external dep
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a seeded pseudo-random number generator (Mulberry32 algorithm).
 * Produces values in `[0, 1)` — same contract as `Math.random()`.
 * Reproducible: same seed → same sequence.
 */
function createPRNG(seed: number): () => number {
  // Mulberry32 algorithm constants — these are fixed bit-manipulation parameters
  // intrinsic to the algorithm; they are not configurable or domain-meaningful.
  /* eslint-disable @typescript-eslint/no-magic-numbers */
  let s = seed >>> 0;
  return function mulberry32(): number {
    s += 0x6d2b_79f5;
    let z = s;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 0x1_0000_0000;
  };
  /* eslint-enable @typescript-eslint/no-magic-numbers */
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared MomentTime builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a {@link MomentTime} for a given epoch-millisecond value.
 * Time literals (HH:mm) are resolved as UTC, consistent with the time toolkit.
 */
function buildMomentTime(atMs: number): MomentTime {
  function resolveInput(input: number | ReturnType<typeof dayjs> | string): number {
    if (typeof input === "number") return input;
    if (typeof input === "string") {
      const d = new Date(atMs);
      const [hStr, mStr] = input.split(":");
      const h = Number(hStr);
      const m = mStr !== undefined ? Number(mStr) : START;
      return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), h, m, START, START);
    }
    return (input as ReturnType<typeof dayjs>).valueOf();
  }

  return {
    after(time) {
      return atMs >= resolveInput(time);
    },
    at: atMs,
    before(time) {
      return atMs <= resolveInput(time);
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MomentContext builder (used by solver)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a {@link MomentContext} over a reconstructed world snapshot.
 */
function buildMomentContext(
  world: Record<string, ENTITY_STATE<ANY_ENTITY>>,
  atMs: number,
): MomentContext {
  return {
    entity(entity_id) {
      const entry = world[entity_id as string];
      return {
        attributes: entry?.attributes,
        is(expected) {
          return entry?.state === expected;
        },
        state: entry?.state,
      };
    },
    time: buildMomentTime(atMs),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario step types
// ─────────────────────────────────────────────────────────────────────────────

type StepKind =
  | { kind: "at"; time: string; fn: () => void | Promise<void> }
  | { kind: "advanceTo"; time: string }
  | { kind: "assert"; fn: () => void | Promise<void> }
  | { kind: "fireSequence"; entity_id: string; states: string[] };

// ─────────────────────────────────────────────────────────────────────────────
// Public option types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Options for `scenario()`.
 */
export interface ScenarioOptions {
  /** PRNG seed for reproducible random draws. Defaults to {@link DEFAULT_SEED}. */
  seed?: number;
  /** Optional data provider for anchored simulation modes (F1/F2). */
  anchor?: DataProvider;
}

/**
 * Options for `scenario({ ... }).simulate()` (seeded random simulation — F1/F2/F4).
 */
export interface SimulateOptions {
  /**
   * Entity ids whose states should be randomized for the simulation.
   * In chaos mode (no provider), states cycle through domain-appropriate values.
   * When a provider is present, real observed values are used via `worldAt`.
   */
  entities: string[];
  /**
   * Sequence of synthetic state-change events to inject after seeding.
   * Each entry is `{ entity_id, state, delayMs? }`.
   */
  events?: Array<{ delayMs?: number; entity_id: string; state: string }>;
}

/**
 * Result of `scenario({ ... }).simulate()`.
 */
export interface SimulationResult {
  /**
   * The anchored epoch-ms timestamp used for the draw.
   * Zero when operating in chaos mode (no provider).
   */
  anchorMs: number;
  /** The initial world state as seeded (entity_id → state string). */
  initialStates: Record<string, string>;
}

/**
 * Options for `scenario.matrix()`.
 */
export type MatrixOptions = Record<string, string[]>;

/**
 * A single combination in a matrix run.
 */
export type MatrixCombo = Record<string, string>;

/**
 * The return type of the matrix builder's `.each()` runner.
 */
export interface MatrixRunResult {
  /** Every combination that was tested. */
  combos: MatrixCombo[];
  /** Results returned by the per-combo callback. */
  results: unknown[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Seeded anchor helpers (extracted to reduce cognitive complexity)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Draw a seeded anchor timestamp from the given provider.
 * Generates `SEEDED_SAMPLE_CANDIDATE_COUNT` random offsets, picks one via PRNG.
 */
function drawAnchorMs(prng: () => number, baseMs: number): number {
  const candidateOffsets: number[] = [];
  for (let i = 0; i < SEEDED_SAMPLE_CANDIDATE_COUNT; i++) {
    candidateOffsets.push(Math.floor(prng() * CHAOS_DWELL_WINDOW_MS));
  }
  const idx = Math.floor(prng() * SEEDED_SAMPLE_CANDIDATE_COUNT);
  return baseMs - (candidateOffsets[idx] ?? START);
}

/**
 * Seed initial states from a provider world at `anchorMs`.
 */
function seedFromProvider(
  entities: string[],
  world: Record<string, ENTITY_STATE<ANY_ENTITY>>,
  out: Record<string, string>,
): void {
  for (const eid of entities) {
    const entry = world[eid as ANY_ENTITY];
    out[eid] = entry !== undefined ? String(entry.state) : "unknown";
  }
}

/**
 * Seed initial states via chaos mode (no provider).
 */
function seedFromChaos(entities: string[], prng: () => number, out: Record<string, string>): void {
  for (const eid of entities) {
    const domain = eid.split(".")[START] ?? "sensor";
    out[eid] = pickChaosState(domain, prng);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal timeline runner
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Executes an ordered list of scenario steps against `mock_assistant`.
 * Steps execute in declaration order; `advanceTo` calls are async (fake-clock).
 */
async function runSteps(
  steps: StepKind[],
  mockAssistant: TServiceParams["mock_assistant"],
): Promise<void> {
  for (const step of steps) {
    if (step.kind === "at") {
      mockAssistant.time.set(step.time);
      await step.fn();
    } else if (step.kind === "advanceTo") {
      await mockAssistant.time.advanceTo(step.time);
    } else if (step.kind === "assert") {
      await step.fn();
    } else if (step.kind === "fireSequence") {
      for (const state of step.states) {
        await mockAssistant.entity.emitChange(step.entity_id as ANY_ENTITY, { state });
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MockScenario service factory
// ─────────────────────────────────────────────────────────────────────────────

export type MockScenarioService = ReturnType<typeof MockScenario>;

/**
 * Simulation engine (Pillar 4).
 *
 * Exposes `mock_assistant.scenario` — a fluent scenario builder and a matrix runner.
 *
 * All time control delegates to `mock_assistant.time`; entity mutations go
 * through `mock_assistant.entity.emitChange` (socket path → MASTER_STATE).
 *
 * ## Usage
 *
 * ```ts
 * // Scripted timeline
 * await mock_assistant.scenario({ seed: 7 })
 *   .at("06:00", () => { /* setup *\/ })
 *   .advanceTo("06:15")
 *   .assert(() => expect(something).toBe(true))
 *   .fireSequence("sensor.remote_button", ["stop", "stop"])
 *   .run();
 *
 * // Seeded random simulation (anchored mode — provider present + clock set)
 * const result = await mock_assistant.scenario({ seed: 1, anchor: provider }).simulate({
 *   entities: ["binary_sensor.garage_door"],
 * });
 *
 * // Matrix (cartesian product)
 * await mock_assistant.scenario.matrix({ "binary_sensor.x": ["on", "off"] })
 *   .each(async (combo) => { /* run test for each combo *\/ });
 * ```
 */
export function MockScenario({ mock_assistant }: TServiceParams) {
  // ─── Fluent timeline builder ─────────────────────────────────────────────

  function scenario(options: ScenarioOptions = {}) {
    const { seed = DEFAULT_SEED, anchor } = options;
    const steps: StepKind[] = [];

    const builder = {
      /** Advance the fake clock to `time` (HH:mm UTC), firing all timers in order. */
      advanceTo(time: string) {
        steps.push({ kind: "advanceTo", time });
        return builder;
      },

      /** Run an assertion callback at the current fake-clock position. */
      assert(fn: () => void | Promise<void>) {
        steps.push({ fn, kind: "assert" });
        return builder;
      },

      /** Set the clock to `time` (HH:mm UTC) and call `fn` synchronously within that moment. */
      at(time: string, fn: () => void | Promise<void>) {
        steps.push({ fn, kind: "at", time });
        return builder;
      },

      /**
       * Emit each state in `states` sequentially for `entity_id` via `emitChange`.
       */
      fireSequence(entity_id: string, states: string[]) {
        steps.push({ entity_id, kind: "fireSequence", states });
        return builder;
      },

      /** Execute all steps in declaration order. */
      async run(): Promise<void> {
        await runSteps(steps, mock_assistant);
      },

      /**
       * Seed the mock world from a provider (or chaos) and return initial states.
       *
       * **Three anchor modes (F1 / F2 / F4):**
       * - Provider present + clock was set → anchor to real moment nearest set time.
       * - Provider present + clock NOT set → anchor to random real point.
       * - No provider (`anchor` omitted) → pure chaos: arbitrary valid states, no anchoring.
       *
       * All modes are reproducible from `seed`.
       */
      async simulate(opts: SimulateOptions): Promise<SimulationResult> {
        const { entities, events = [] } = opts;
        const prng = createPRNG(seed);

        let anchorMs = START;
        const initialStates: Record<string, string> = {};

        if (anchor !== undefined) {
          // Anchored modes (F1 + F2):
          // F1 (clock was set): Date.now() == set time → anchor near it.
          // F2 (clock not set): Date.now() == wall clock → random real point.
          anchorMs = drawAnchorMs(prng, Date.now());
          seedFromProvider(entities, anchor.worldAt(anchorMs), initialStates);
        } else {
          // Chaos mode (F4): pure random valid states, no anchoring.
          seedFromChaos(entities, prng, initialStates);
        }

        // Auto-register entities not yet in the mock seed store (chaos contract F4:
        // simulate() must work standalone without the caller pre-registering each entity).
        // register() is safe to call after boot and uses the socket path to populate
        // MASTER_STATE, so no second write path is introduced here.
        for (const eid of Object.keys(initialStates)) {
          if (mock_assistant.entity.byId(eid as ANY_ENTITY) === undefined) {
            mock_assistant.entity.register(eid as ANY_ENTITY, { state: "unknown" });
          }
        }

        // Seed entity states into the mock via the socket path
        for (const [eid, state] of Object.entries(initialStates)) {
          await mock_assistant.entity.emitChange(eid as ANY_ENTITY, { state });
        }

        // Replay synthetic events
        for (const ev of events) {
          if (ev.delayMs !== undefined && ev.delayMs > START) {
            await mock_assistant.time.advanceBy(ev.delayMs);
          }
          await mock_assistant.entity.emitChange(ev.entity_id as ANY_ENTITY, { state: ev.state });
        }

        return { anchorMs, initialStates };
      },
    };

    return builder;
  }

  // ─── Matrix (combinatorial) runner ──────────────────────────────────────

  function buildMatrix(options: MatrixOptions) {
    const entries = Object.entries(options);
    const combos = cartesianProduct(entries);

    return {
      combos,

      /**
       * Run `callback` for every combination in the cartesian product.
       * Returns all results in order.
       */
      async each(
        callback: (combo: MatrixCombo) => unknown | Promise<unknown>,
      ): Promise<MatrixRunResult> {
        const results: unknown[] = [];
        for (const combo of combos) {
          results.push(await callback(combo));
        }
        return { combos, results };
      },
    };
  }

  // Attach matrix as a property of the scenario function so callers can use:
  //   mock_assistant.scenario.matrix(...)
  // or
  //   mock_assistant.scenario({ seed }).at(...)
  scenario.matrix = buildMatrix;

  return scenario;
}

// ─────────────────────────────────────────────────────────────────────────────
// Chaos-mode per-domain state vocabulary
// ─────────────────────────────────────────────────────────────────────────────

/** Common valid states per domain for chaos-mode simulation. */
const DOMAIN_STATE_VOCAB: Record<string, readonly string[]> = {
  binary_sensor: ["on", "off"],
  button: ["unknown"],
  climate: ["heat", "cool", "auto", "off"],
  cover: ["open", "closed", "opening", "closing"],
  fan: ["on", "off"],
  input_boolean: ["on", "off"],
  input_number: ["0", "50", "100"],
  input_select: ["option_1", "option_2", "option_3"],
  light: ["on", "off"],
  lock: ["locked", "unlocked"],
  media_player: ["playing", "paused", "idle", "off"],
  number: ["0", "50", "100"],
  select: ["option_1", "option_2"],
  sensor: ["0", "1", "unavailable"],
  sun: ["above_horizon", "below_horizon"],
  switch: ["on", "off"],
};

/** Fallback vocab for domains not in the table. */
const CHAOS_FALLBACK_STATES: readonly string[] = ["on", "off", "unavailable"];

/**
 * Pick a pseudo-random valid state for `domain` using `prng`.
 */
function pickChaosState(domain: string, prng: () => number): string {
  const vocab = DOMAIN_STATE_VOCAB[domain] ?? CHAOS_FALLBACK_STATES;
  const idx = Math.floor(prng() * vocab.length);
  return vocab[idx] ?? "unavailable";
}

// ─────────────────────────────────────────────────────────────────────────────
// Cartesian product helper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the full cartesian product of an array of [key, values[]] pairs.
 */
function cartesianProduct(entries: [string, string[]][]): MatrixCombo[] {
  if (entries.length === START) return [{}];
  const [first, ...rest] = entries;
  if (first === undefined) return [{}];
  const [key, values] = first;
  const subProducts = cartesianProduct(rest);

  const result: MatrixCombo[] = [];
  for (const value of values) {
    for (const sub of subProducts) {
      result.push({ [key]: value, ...sub });
    }
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Re-export helpers for tests
// ─────────────────────────────────────────────────────────────────────────────

export { buildMomentContext, buildMomentTime, CHAOS_DWELL_WINDOW_MS, createPRNG };
export type { DataProvider, FoundMoment, MomentContext, MomentTime };
