import { PICK_ENTITY } from "./index.mts";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EntityMergeAttributes {}

export type DynamicMergeAttributes<MAYBE_ENTITY extends string, SCANNED extends object> =
  MAYBE_ENTITY extends Extract<PICK_ENTITY, keyof EntityMergeAttributes>
    ? SCANNED & EntityMergeAttributes[MAYBE_ENTITY]
    : SCANNED;
