export interface ThemeDefinition {
  "accent-color"?: string;
  "app-header-background-color"?: string;
  "app-header-edit-background-color"?: string;
  "app-header-text-color"?: string;
  "card-mod-root-yaml"?: string;
  "divider-color"?: string;
  "ha-card-border-radius"?: string;
  "ha-card-border-width"?: string;
  "paper-listbox-background-color"?: string;
  "primary-color"?: string;
  "sidebar-background-color"?: string;
  "sidebar-menu-button-background-color"?: string;
  modes?: {
    light?: Record<string, unknown>;
    dark?: Record<string, unknown>;
  };
  [key: string]: unknown;
}
