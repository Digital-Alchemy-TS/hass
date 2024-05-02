#!/bin/sh

CONTAINER_NAME="digital_alchemy_e2e_homeassistant"

if ! docker inspect -f '{{.State.Running}}' "$CONTAINER_NAME" >/dev/null 2>&1 || [ "$(docker inspect -f '{{.State.Running}}' "$CONTAINER_NAME")" != "true" ]; then
  docker-compose -f ./e2e/hass/docker-compose.yaml up -d
fi
