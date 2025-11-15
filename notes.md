Investigating the `homeassistant.reload_config_entry` service and how config entry IDs are exposed to the UI. Searching for the service implementation and related socket messages.


[3 tools called]


Reviewing the relevant files to understand config entry IDs and the websocket messages:


[4 tools called]


Checking how `entry_id` is defined in the `ConfigEntry` class:


[3 tools called]


Checking how `entry_id` is generated and how the `config_entry` selector works:


[3 tools called]


Checking how selectors fetch their options, including config entries:


[3 tools called]


Checking what data is returned in the JSON fragment:


[2 tools called]


## What is a Config Entry ID?

A config entry ID is a ULID (Universally Unique Lexicographically Sortable Identifier) string that uniquely identifies each configuration entry in Home Assistant.

From the code:

```448:448:homeassistant/config_entries.py
        _setter(self, "entry_id", entry_id or ulid_util.ulid_now())
```

If not provided, it's generated using `ulid_util.ulid_now()` when the entry is created. Example: `8955375327824e14ba89e4b29cc3ec9a`.

## WebSocket Messages for Config Entries

Two WebSocket messages return config entries to the UI:

### 1. `config_entries/get` — One-time fetch

```620:637:homeassistant/components/config/config_entries.py
@websocket_api.websocket_command(
    {
        vol.Required("type"): "config_entries/get",
        vol.Optional("type_filter"): vol.All(cv.ensure_list, [str]),
        vol.Optional("domain"): str,
    }
)
@websocket_api.async_response
async def config_entries_get(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return matching config entries by type and/or domain."""
    fragments = await _async_matching_config_entries_json_fragments(
        hass, msg.get("type_filter"), msg.get("domain")
    )
    connection.send_result(msg["id"], fragments)
```

### 2. `config_entries/subscribe` — Subscribe to updates

```640:690:homeassistant/components/config/config_entries.py
@websocket_api.websocket_command(
    {
        vol.Required("type"): "config_entries/subscribe",
        vol.Optional("type_filter"): vol.All(cv.ensure_list, [str]),
    }
)
@websocket_api.async_response
async def config_entries_subscribe(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Subscribe to config entry updates."""
    type_filter = msg.get("type_filter")

    @callback
    def async_forward_config_entry_changes(
        change: config_entries.ConfigEntryChange, entry: config_entries.ConfigEntry
    ) -> None:
        """Forward config entry state events to websocket."""
        if type_filter:
            integration = async_get_loaded_integration(hass, entry.domain)
            if integration.integration_type not in type_filter:
                return

        connection.send_message(
            websocket_api.event_message(
                msg["id"],
                [
                    {
                        "type": change,
                        "entry": entry.as_json_fragment,
                    }
                ],
            )
        )

    current_entries = await _async_matching_config_entries_json_fragments(
        hass, type_filter, None
    )
    connection.subscriptions[msg["id"]] = async_dispatcher_connect(
        hass,
        config_entries.SIGNAL_CONFIG_ENTRY_CHANGED,
        async_forward_config_entry_changes,
    )
    connection.send_result(msg["id"])
    connection.send_message(
        websocket_api.event_message(
            msg["id"], [{"type": None, "entry": entry} for entry in current_entries]
        )
    )
```

Both return JSON fragments with config entry data:

```625:649:homeassistant/config_entries.py
    @cached_property
    def as_json_fragment(self) -> json_fragment:
        """Return JSON fragment of a config entry that is used for the API."""
        json_repr = {
            "created_at": self.created_at.timestamp(),
            "entry_id": self.entry_id,
            "domain": self.domain,
            "modified_at": self.modified_at.timestamp(),
            "title": self.title,
            "source": self.source,
            "state": self.state.value,
            "supports_options": self.supports_options,
            "supports_remove_device": self.supports_remove_device or False,
            "supports_unload": self.supports_unload or False,
            "supports_reconfigure": self.supports_reconfigure,
            "supported_subentry_types": self.supported_subentry_types,
            "pref_disable_new_entities": self.pref_disable_new_entities,
            "pref_disable_polling": self.pref_disable_polling,
            "disabled_by": self.disabled_by,
            "reason": self.reason,
            "error_reason_translation_key": self.error_reason_translation_key,
            "error_reason_translation_placeholders": self.error_reason_translation_placeholders,
            "num_subentries": len(self.subentries),
        }
        return json_fragment(json_bytes(json_repr))
```

The UI typically uses `config_entries/subscribe` to get the initial list and receive updates when entries are added, removed, or changed. The `config_entry` selector in the service schema uses this data to populate its dropdown.
