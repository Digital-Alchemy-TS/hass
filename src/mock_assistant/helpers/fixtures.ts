import {
  AreaDetails,
  DeviceDetails,
  ENTITY_STATE,
  EntityRegistryItem,
  FloorDetails,
  HassConfig,
  HassServiceDTO as HassServiceDefinition,
  LabelDefinition,
  PICK_ENTITY,
} from "../../helpers";

export type ScannerCacheData = {
  areas: AreaDetails[];
  config: HassConfig;
  devices: DeviceDetails[];
  entities: ENTITY_STATE<PICK_ENTITY>[];
  entity_registry: EntityRegistryItem<PICK_ENTITY>[];
  floors: FloorDetails[];
  labels: LabelDefinition[];
  services: HassServiceDefinition[];
};
