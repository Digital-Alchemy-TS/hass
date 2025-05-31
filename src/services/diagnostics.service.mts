import { TServiceParams } from "@digital-alchemy/core";
import { channel } from "diagnostics_channel";

function createDiagnostics<CHANNEL extends string>(context: string, channels: CHANNEL[]) {
  return Object.fromEntries(channels.map(i => [i, channel(`hass:${context}:${i}`)])) as Record<
    CHANNEL,
    ReturnType<typeof channel>
  >;
}
export function HassDiagnosticsService({ config, logger }: TServiceParams) {
  if (!config.hass.EMIT_DIAGNOSTICS) {
    logger.debug("skipping diagnostics channel creation");
    return {};
  }
  logger.info("creating diagnostics channels");
  return {
    area: createDiagnostics("area", ["registry_update"]),
    call: createDiagnostics("call", ["fast", "response", "reload"]),
    config: createDiagnostics("config", ["service_list_updated", "load_services_failure"]),
    device: createDiagnostics("device", ["registry_update"]),
    entity: createDiagnostics("entity", [
      "warn_ready",
      "history_lookup",
      "refresh_entities",
      "entity_updated",
      "registry_updated",
      "entity_remove",
      "entity_add",
    ]),
    fetch: createDiagnostics("fetch", ["fetch"]),
    floor: createDiagnostics("floor", ["registry_update"]),
    label: createDiagnostics("label", ["registry_update"]),
    reference: createDiagnostics("reference", ["create_proxy", "get_property", "call_service"]),
    websocket: createDiagnostics("websocket", [
      "fire_event",
      "message_received",
      "missed_reply",
      "send_message",
      "failed_ping",
      "send_ping",
      "set_connection_state",
    ]),
    zone: createDiagnostics("zone", ["registry_update"]),
  };
}
