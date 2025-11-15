export interface AddonDetails {
  name: string;
  slug: string;
  description: string;
  advanced: boolean;
  stage: string;
  version: string;
  version_latest: string;
  update_available: boolean;
  available: boolean;
  detached: boolean;
  homeassistant: string;
  state: "started" | "stopped" | "error";
  repository: string;
  build: boolean;
  url: string;
  icon: boolean;
  logo: boolean;
  system_managed: boolean;
}
