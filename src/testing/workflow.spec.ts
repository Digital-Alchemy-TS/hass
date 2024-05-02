import {
  CreateApplication,
  sleep,
  TServiceParams,
} from "@digital-alchemy/core";

import { LIB_HASS } from "..";
import { LIB_MOCK_ASSISTANT } from "../mock_assistant";

describe("Workflows", () => {
  const application = CreateApplication({
    libraries: [LIB_HASS],
    // @ts-expect-error testing
    name: "testing",
    services: {
      Test({ hass }: TServiceParams) {
        const entity = hass.entity.byId("sensor.magic");
        entity.onUpdate(async () => {
          const action = entity.state === "test" ? "turn_on" : "turn_off";
          await hass.call.switch[action]({
            entity_id: "switch.porch_light",
          });
        });
      },
    },
  });

  afterEach(async () => {
    await application.teardown();
    jest.restoreAllMocks();
  });

  it("should be able to trigger a workflow", async () => {
    expect.assertions(2);
    await application.bootstrap({
      appendLibrary: LIB_MOCK_ASSISTANT,
      appendService: {
        Runner({ mock_assistant, lifecycle, hass }: TServiceParams) {
          lifecycle.onReady(async () => {
            const turnOn = jest.spyOn(hass.call.switch, "turn_on");
            const turnOff = jest.spyOn(hass.call.switch, "turn_off");
            await mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "test",
            });
            await sleep(1);
            await mock_assistant.events.emitEntityUpdate("sensor.magic", {
              state: "foo",
            });
            expect(turnOn).toHaveBeenCalledTimes(1);
            expect(turnOff).toHaveBeenCalledTimes(1);
          });
        },
      },
      configuration: {
        boilerplate: { LOG_LEVEL: "error" },
        hass: { MOCK_SOCKET: true, TOKEN: "--" },
      },
    });
  });
});
