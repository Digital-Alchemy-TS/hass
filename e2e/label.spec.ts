import {
  ApplicationDefinition,
  OptionalModuleConfiguration,
  ServiceMap,
  sleep,
  TServiceParams,
} from "@digital-alchemy/core";

import { TLabelId } from "../dynamic";
import { LABEL_REGISTRY_UPDATED } from "../helpers";
import { CreateTestingApplication, SILENT_BOOT } from "../mock_assistant";
import { BASE_URL, TOKEN } from "./utils";

describe("Label E2E", () => {
  let application: ApplicationDefinition<ServiceMap, OptionalModuleConfiguration>;
  const testLabel = "test" as TLabelId;

  afterEach(async () => {
    if (application) {
      await application.teardown();
      application = undefined;
    }
    jest.restoreAllMocks();
  });

  it("should fire events on registry updated", async () => {
    expect.assertions(1);
    application = CreateTestingApplication({
      Test({ lifecycle, hass, event }: TServiceParams) {
        lifecycle.onReady(async () => {
          let hit = false;
          event.on(LABEL_REGISTRY_UPDATED, () => (hit = true));
          await hass.socket.fireEvent("label_registry_updated");
          await sleep(100);
          expect(hit).toBe(true);
          await application.teardown();
        });
      },
    });
    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });

  it("should create a label", async () => {
    expect.assertions(1);
    application = CreateTestingApplication({
      Test({ lifecycle, hass }: TServiceParams) {
        lifecycle.onReady(async () => {
          await hass.label.create({
            color: "accent",
            icon: "mdi:account",
            name: testLabel,
          });
          expect(hass.label.current.some(i => i.label_id === testLabel)).toBe(true);
          await application.teardown();
        });
      },
    });
    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });

  it("should update a label", async () => {
    expect.assertions(1);
    application = CreateTestingApplication({
      Test({ lifecycle, hass }: TServiceParams) {
        lifecycle.onReady(async () => {
          const item = hass.label.current.find(i => i.label_id === testLabel);
          await hass.label.update({
            ...item,
            name: "extra test",
          });
          expect(hass.label.current.find(i => i.label_id === testLabel)?.name).toBe("extra test");
          await application.teardown();
        });
      },
    });
    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });

  it("should delete a label", async () => {
    expect.assertions(2);
    application = CreateTestingApplication({
      Test({ lifecycle, hass }: TServiceParams) {
        lifecycle.onReady(async () => {
          expect(hass.label.current.some(i => i.label_id === testLabel)).toBe(true);
          await hass.label.delete(testLabel);
          expect(hass.label.current.some(i => i.label_id === testLabel)).toBe(false);
          await application.teardown();
        });
      },
    });
    await application.bootstrap(SILENT_BOOT({ hass: { BASE_URL, TOKEN } }));
  });
});
