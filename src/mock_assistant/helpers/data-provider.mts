import type { Dayjs } from "dayjs";

import type { ENTITY_PROP, ENTITY_STATE } from "../../helpers/utility.mts";
import type { ANY_ENTITY, PICK_ENTITY } from "../../user.mts";

/**
 * The argument handed to a {@link MomentPredicate}.
 *
 * Pillar 4's solver calls predicates with a typed accessor over the world at a
 * candidate instant, so a predicate reads like the natural-language scenario it
 * encodes:
 *
 * ```ts
 * provider.findMoment(
 *   ({ entity, time }) =>
 *     entity("binary_sensor.garage_door").is("open") && time.after("16:00"),
 * );
 * ```
 *
 * This type is intentionally pure (no runtime, no engine) — the simulation
 * engine (Pillar 4) implements the accessors; the data layer only declares the
 * contract they satisfy.
 */
export interface MomentContext {
  /**
   * Typed accessor for a single entity's reconstructed state at the candidate
   * instant. The returned helper is narrowed to the picked entity id so
   * `.is(...)` only accepts that entity's valid state literals.
   */
  entity<ENTITY_ID extends ANY_ENTITY>(entity_id: ENTITY_ID): MomentEntity<ENTITY_ID>;
  /** Accessor for the candidate instant itself, for time-based comparisons. */
  time: MomentTime;
}

/**
 * Typed view of one entity within a {@link MomentContext}, narrowed to the
 * entity id that produced it.
 */
export interface MomentEntity<ENTITY_ID extends ANY_ENTITY> {
  /** The reconstructed state for this entity at the candidate instant. */
  readonly state: ENTITY_PROP<ENTITY_ID, "state">;
  /** The reconstructed attributes for this entity at the candidate instant. */
  readonly attributes: ENTITY_PROP<ENTITY_ID, "attributes">;
  /** True when the entity's reconstructed state equals `expected`. */
  is(expected: ENTITY_PROP<ENTITY_ID, "state">): boolean;
}

/**
 * Typed view of the candidate instant within a {@link MomentContext}.
 *
 * Time literals (e.g. `"16:00"`) are interpreted against the fixed-TZ contract
 * established by the time toolkit (Pillar 2); the engine — not this interface —
 * owns that resolution.
 */
export interface MomentTime {
  /** The candidate instant as an epoch-millisecond value. */
  readonly at: number;
  /** True when the candidate instant is at or after the given time. */
  after(time: number | Dayjs | string): boolean;
  /** True when the candidate instant is at or before the given time. */
  before(time: number | Dayjs | string): boolean;
}

/**
 * A typed predicate over a candidate moment, used by {@link DataProvider.findMoment}.
 *
 * Returns `true` for the moment the caller is searching for. v1 ships typed
 * predicates only; a string DSL compiling to this same predicate shape is an
 * explicit later phase (plan finding F12).
 */
export type MomentPredicate = (context: MomentContext) => boolean;

/**
 * The result of a successful {@link DataProvider.findMoment} search.
 */
export interface FoundMoment {
  /** The matched instant as an epoch-millisecond value. */
  at: number;
  /** The fully reconstructed world (entity_id → state) at the matched instant. */
  world: Record<ANY_ENTITY, ENTITY_STATE<ANY_ENTITY>>;
}

/**
 * Abstract source of historical / synthetic Home Assistant world data that the
 * simulation engine (Pillar 4) reads through.
 *
 * This interface is pure and dependency-free: it carries NO runtime and NO
 * native dependency (notably no `better-sqlite3`). Concrete feeders live in
 * `home-automation` — a local read-only sqlite scraper (plan 3a) and a
 * committed CI synthetic generator (plan 3b) — and the engine depends only on
 * this contract, never on a feeder directly.
 */
export interface DataProvider {
  /**
   * Distinct observed states for an entity id across the provider's reference
   * content, for matrix / combinatorial tests (plan finding F3).
   *
   * @param entity_id - the entity whose observed states to enumerate.
   * @returns the de-duplicated set of states seen for that entity.
   */
  observedValues<ENTITY_ID extends PICK_ENTITY>(
    entity_id: ENTITY_ID,
  ): Array<ENTITY_PROP<ENTITY_ID, "state">>;

  /**
   * The fully reconstructed world (entity_id → {@link ENTITY_STATE}) at a given
   * instant.
   *
   * Reconstruction is snapshot-plus-deltas (a full current-state snapshot with
   * per-entity history deltas applied), which is why a single timestamp yields
   * a complete world rather than a sparse window.
   *
   * @param ts - the instant to reconstruct, as epoch milliseconds or a `Dayjs`.
   * @returns every known entity's state at that instant.
   */
  worldAt(ts: number | Dayjs): Record<ANY_ENTITY, ENTITY_STATE<ANY_ENTITY>>;

  /**
   * Find the first / representative moment matching a typed predicate.
   *
   * Boots into a reconstructed real world for the matched instant. Throws when
   * no recorded moment satisfies the predicate — a loud failure, never a
   * fabricated world (plan Pillar 4 "Solver").
   *
   * @param predicate - typed predicate over the candidate moment.
   * @returns the matched instant and its reconstructed world.
   * @throws when no recorded moment satisfies `predicate`.
   */
  findMoment(predicate: MomentPredicate): FoundMoment;
}
