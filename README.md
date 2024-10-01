[![stars](https://img.shields.io/github/stars/Digital-Alchemy-TS/hass)](https://github.com/Digital-Alchemy-TS/hass)
![discord](https://img.shields.io/discord/1219758743848489147?label=Discord&logo=discord)
[![codecov](https://codecov.io/gh/Digital-Alchemy-TS/hass/graph/badge.svg?token=LYUQ1FQ71D)](https://codecov.io/gh/Digital-Alchemy-TS/hass)
[![version](https://img.shields.io/github/package-json/version/Digital-Alchemy-TS/hass)](https://www.npmjs.com/package/@digital-alchemy/hass)

---

# 🏠 Welcome to `@digital-alchemy/hass`!

This repository contains generic extensions for interacting with Home Assistant, including websocket & REST API adapters, entity & event management, backup workflows, and more.

- [Extended docs](https://docs.digital-alchemy.app)
- [Discord](https://discord.gg/JkZ35Gv97Y)

## ⭐ Features
### 📝 First-class Editor Experiences

- Did you just typo that entity name?
- Just what services are actually available?

Create references to entities that will always reflect their current state. Get details about all the services your setup supports and how to use them, directly in your editor.

![editor](./docs/editor.png)

### 🌐 Managed Websocket

Don't worry about all the complexities of dealing with Home Assistant. Let the library help by handling all the connection logic, keeping track of events for you, formatting requests, and more.

## Install

Add as a dependency, and add to your imports. Nice and easy

```bash
npm i @digital-alchemy/hass
```

**Add to code**
```typescript
import { LIB_HASS } from "@digital-alchemy/hass";

// application
const MY_APP = CreateApplication({
  libraries: [LIB_HASS],
  name: "home_automation",
})

// library
export const MY_LIBRARY = CreateLibrary({
  depends: [LIB_HASS],
  name: "special_logic",
})
```

## ⚙️ Configuration
### 🛠 Custom Types

This library has support for customizing type definitions to match a particular Home Assistant install. This functionality requires the [type-writer](https://github.com/Digital-Alchemy-TS/type-writer) command to be installed as well.

> Add to `devDependencies`!
```bash
npm i --save-dev @digital-alchemy/type-writer
npx type-writer
```
Custom types only affect the development experience and have no impact on the way the application runs.

### 📦 Supervised Support

If your code is running within a Home Assistant addon environment, it will automatically connect with no additional configuration needed.

### 🖥 Manual

For code running elsewhere, manual configuration is required. You will need a **Long Lived Access Token**, which can be generated on your user profile. You can store your config at `./.{app_name}` or `~/.config/{app_name}` in **INI** format.

> Don't forget to configure "`type_writer`" also!

```ini
[hass]
  BASE_URL=http://localhost:8123
  TOKEN=YOUR LONG LIVED ACCESS TOKEN
```

### 🤖 Unit Testing

Built in workflows for unit testing using standard test runners like Jest.

- [Read more](https://docs.digital-alchemy.app/hass/unit-testing)

## 🤝 Related Projects

For additional projects that build on and consume this library, check out these other projects:

| GitHub                                                              | Description                                                                             | NPM                                                                                      |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [synapse](https://github.com/Digital-Alchemy-TS/synapse)            | Tools for generating entities within Home Assistant.                                    | [@digitial-alchemy/synapse](https://www.npmjs.com/package/@digital-alchemy/synapse)      |
| [automation](https://github.com/Digital-Alchemy-TS/automation)      | Advanced automation tools for creating dynamic workflows.                               | [@digital-alchemy/automation](https://www.npmjs.com/package/@digital-alchemy/automation) |
| [type-writer](https://github.com/Digital-Alchemy-TS/type-writer)       | Generate custom type definitions for your setup.                                        | [@digital-alchemy/type-writer](https://www.npmjs.com/package/@digital-alchemy/terminal)  |
| [automation-template](https://github.com/Digital-Alchemy-TS/automation-quickstart) | Start your own Home Automation project with the `@digital-alchemy` quick start template |                                                                                          |
