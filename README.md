[![codecov](https://codecov.io/gh/Digital-Alchemy-TS/hass/graph/badge.svg?token=LYUQ1FQ71D)](https://codecov.io/gh/Digital-Alchemy-TS/hass)
[![version](https://img.shields.io/github/package-json/version/Digital-Alchemy-TS/hass)](https://www.npmjs.com/package/@digital-alchemy/hass)
[![stars](https://img.shields.io/github/stars/Digital-Alchemy-TS/hass)](https://github.com/Digital-Alchemy-TS/hass)

---

<div align="center">

![Digital Alchemy](https://raw.githubusercontent.com/Digital-Alchemy-TS/.github/main/profile/github-logo.png)
![Digital Alchemy](https://avatars.githubusercontent.com/u/13844975?s=125&v=4)

</div>

## Install

Add as a dependency, and add to your imports. Nice and easy

```bash
yarn add @digital-alchemy/hass
yarn add -D @digital-alchemy/type-writer
```

## Introduction

`@digital-alchemy/hass` builds off the Digital Alchemy core framework to introduce API bindings for Home Assistant, exposing functionality for event subscriptions, websocket & rest api interactions, and more!

The library is able to be customized with the [type-writer](https://github.com/Digital-Alchemy-TS/type-writer) script in order to customize the editor experience for your individual Home Assistant instance.
All services with their parameter inputs are available to call, as well as tools to create long term type safe entity references.

- [📚 Extended docs](https://docs.digital-alchemy.app)

## Configuration

### Connection Details

If you are running the code within a Home Assistant addon (ex: Code Server or Code Runner), the library will automatically configure from environment variables.

All other environments should define credentials in a `.env` file or provide them via environment variables -

```
HASS_BASE_URL=http://localhost:8123
HASS_TOKEN=<long lived access token>
```

### Customizing Types

The `type-writer` script utilizes `hass` under the hood, and will load configuration from the same sources.
In order to run the script, execute this command from repository root

```bash
npx type-writer
```

This will create / update the `src/hass` folder inside your project with the latest type definitions for your project.
These have **NO EFFECT** on the way your app performs at runtime, and can be updated as frequently as you like.

## Usage

### Load

Once credentials are set and you have your type definitions generated, you can add the library to your existing project

```typescript
import { LIB_HASS } from "@digital-alchemy/hass";

// application
const MY_APP = CreateApplication({
  libraries: [LIB_HASS],
  name: "home_automation",
});

// library
export const MY_LIBRARY = CreateLibrary({
  depends: [LIB_HASS],
  name: "special_logic",
});
```

### Build logic

The `hass` property will be available via `TServiceParams` in your code

```typescript
import { TServiceParams } from "@digital-alchemy/core";

// now available here            vvvv
export function ExampleService({ hass, logger }: TServiceParams) {
  const mySwitch = hass.refBy.id("switch.my_switch");

  // utilize event patterns to trigger logic
  hass.refBy.id("binary_sensor.recent_activity_detected").onUpdate((new_state, old_state) => {

    // quickly make logic tests
    if (new_state.state === "on" && mySwitch.state === "off") {

      // execute service calls via entities
      mySwitch.turn_on();

    } else {
      // get type safe access to the full list of services available on your instance
      hass.call.switch.turn_off({ area: "living_room" });

    }
  });
}
```

## Questions / Issues?

[![discord](https://img.shields.io/discord/1219758743848489147?label=Discord&logo=discord)](https://discord.gg/JkZ35Gv97Y)
