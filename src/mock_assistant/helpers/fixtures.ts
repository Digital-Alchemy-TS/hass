import {
  AreaDetails,
  DeviceDetails,
  ENTITY_STATE,
  EntityRegistryItem,
  FloorDetails,
  HassServiceDTO as HassServiceDefinition,
  LabelDefinition,
  PICK_ENTITY,
} from "../../helpers";

export type ScannerCacheData = {
  areas: AreaDetails[];
  services: HassServiceDefinition[];
  labels: LabelDefinition[];
  floors: FloorDetails[];
  devices: DeviceDetails[];
  entities: ENTITY_STATE<PICK_ENTITY>[];
  entity_registry: EntityRegistryItem<PICK_ENTITY>[];
};
