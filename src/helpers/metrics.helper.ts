import { Counter, Gauge, Summary } from "prom-client";

/**
 * Tracks the number of times a socket event callback has been executed.
 */
export const SOCKET_EVENT_EXECUTION_COUNT = new Counter({
  help: "Counts the number of times a socket event callback has been executed",
  labelNames: ["context", "label", "event"] as const,
  name: "digital_alchemy_hass_socket_event_callback_execution_count",
});

/**
 * Counts the number of errors occurred during socket event callback executions.
 */
export const SOCKET_EVENT_ERRORS = new Counter({
  help: "Counts the number of errors during socket event callback executions",
  labelNames: ["context", "label", "event"] as const,
  name: "digital_alchemy_hass_socket_event_callback_errors",
});

/**
 * Counts the number of errors occurred during socket event callback executions.
 */
export const SOCKET_SENT_MESSAGES = new Counter({
  help: "Counts the number of outgoing sent messages",
  labelNames: ["type"] as const,
  name: "digital_alchemy_hass_socket_sent_messages",
});

/**
 * Counts the number of errors occurred during socket event callback executions.
 */
export const SOCKET_RECEIVED_MESSAGES = new Counter({
  help: "Counts the number of incoming socket messages",
  labelNames: ["type"] as const,
  name: "digital_alchemy_hass_socket_received_messages",
});

/**
 * Summary for Execution Time
 */
export const SOCKET_EVENT_EXECUTION_TIME = new Summary({
  help: "Measures the duration of each socket event callback execution",
  labelNames: ["context", "label", "event"] as const,
  name: "digital_alchemy_hass_socket_event_callback_execution_time",
  percentiles: [0.5, 0.9, 0.99],
});

/**
 * Show the current state
 */
export const SOCKET_CONNECTION_STATE = new Gauge({
  help: "The current connection to home assistant state, observable as a metrics",
  labelNames: ["state"] as const,
  name: "digital_alchemy_hass_socket_connection_state",
});

/**
 * Counter for service calls made through the call proxy
 */
export const CALL_PROXY_SERVICE_CALL = new Counter({
  help: "Service calls made through the call proxy",
  labelNames: ["domain", "service"] as const,
  name: "digital_alchemy_hass_call_proxy_service_call",
});
