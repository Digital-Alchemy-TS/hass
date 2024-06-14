import {
  ANY_ENTITY,
  AreaDetails,
  DeviceDetails,
  ENTITY_STATE,
  EntityRegistryItem,
  FloorDetails,
  HassConfig,
  HassServiceDTO as HassServiceDefinition,
  LabelDefinition,
} from "../../helpers";

export type ScannerCacheData = {
  areas: AreaDetails[];
  config: HassConfig;
  devices: DeviceDetails[];
  entities: ENTITY_STATE<ANY_ENTITY>[];
  entity_registry: EntityRegistryItem<ANY_ENTITY>[];
  floors: FloorDetails[];
  labels: LabelDefinition[];
  services: HassServiceDefinition[];
};
