import { PICK_ENTITY } from "./utility.helper";

export type LabelOptions = {
  name: string;
  icon: string;
  color: string;
};

export type EditLabelOptions = {
  entity: PICK_ENTITY;
  label: string;
};

export type EditAliasOptions = {
  entity: PICK_ENTITY;
  alias: string;
};

export type LabelDefinition = {
  color: string;
  description?: string;
  icon: string;
  label_id: string;
  name: string;
};

export type ToggleExpose = {
  assistants: string | string[];
  entity_ids: PICK_ENTITY | PICK_ENTITY[];
  should_expose: boolean;
};

export type EntityRegistryItem<ENTITY extends PICK_ENTITY> = {
  area_id?: string;
  categories: object;
  config_entry_id?: string;
  device_id?: string;
  disabled_by?: string;
  entity_category?: string;
  entity_id: ENTITY;
  has_entity_name: boolean;
  hidden_by?: string;
  icon?: string;
  id: string;
  labels: string[];
  name?: string;
  options: {
    conversation: {
      should_expose?: boolean;
    };
  };
  original_name: string;
  platform: string;
  translation_key?: string;
  unique_id: string;
  aliases: string[];
  capabilities?: string;
  device_class?: string;
  original_device_class?: string;
  original_icon?: string;
};

export const UPDATE_REGISTRY = "config/entity_registry/update";
