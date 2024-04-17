import { TDeviceId } from "../dynamic";

export interface DeviceDetails {
  area_id: null | string;
  configuration_url: null | string;
  config_entries: string[];
  connections: Array<string[]>;
  disabled_by: null;
  entry_type: EntryType | null;
  hw_version: null | string;
  id: TDeviceId;
  identifiers: Array<Array<number | string>>;
  labels: string[];
  manufacturer: null | string;
  model: null | string;
  name_by_user: null | string;
  name: string;
  serial_number: null;
  sw_version: null | string;
  via_device_id: TDeviceId;
}

export enum EntryType {
  Service = "service",
}
