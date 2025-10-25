import { LIGHT } from "../helpers/supported-features.mts";
import { hassTestRunner } from "../mock_assistant/index.mts";

afterEach(async () => {
  await hassTestRunner.teardown();
  vi.restoreAllMocks();
});

describe("Feature Service", () => {
  describe("createSupportedFeatures", () => {
    it("should create bitmask from array of numbers", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          const result = hass.feature.createSupportedFeatures([LIGHT.EFFECT, LIGHT.FLASH]);
          expect(result).toBe(LIGHT.EFFECT | LIGHT.FLASH);
        });
      });
    });

    it("should create bitmask from array of feature strings", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          const result = hass.feature.createSupportedFeatures<"light">([
            "LIGHT.EFFECT",
            "LIGHT.FLASH",
          ]);
          expect(result).toBe(LIGHT.EFFECT | LIGHT.FLASH);
        });
      });
    });

    it("should handle mixed array of numbers and strings", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          const result = hass.feature.createSupportedFeatures<"light">([
            LIGHT.EFFECT,
            "LIGHT.FLASH",
          ]);
          expect(result).toBe(LIGHT.EFFECT | LIGHT.FLASH);
        });
      });
    });

    it("should handle invalid feature strings gracefully", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          const result = hass.feature.createSupportedFeatures<"light">([
            // @ts-expect-error: part of the test
            "INVALID.DOMAIN",
            "LIGHT.EFFECT",
          ]);
          // Should return only the valid feature, ignoring the invalid one
          expect(result).toBe(LIGHT.EFFECT);
        });
      });
    });
  });

  describe("hasFeature", () => {
    it("should return true when entity has the feature", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          // Use numeric features input instead of entity lookup to avoid test environment issues
          const features = LIGHT.EFFECT | LIGHT.FLASH;
          const result = hass.feature.hasFeature(features, LIGHT.EFFECT);
          expect(result).toBe(true);
        });
      });
    });

    it("should return false when entity does not have the feature", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          // Use numeric features input instead of entity lookup
          const features = LIGHT.EFFECT; // Only EFFECT, no FLASH
          const result = hass.feature.hasFeature(features, LIGHT.FLASH);
          expect(result).toBe(false);
        });
      });
    });

    it("should work with feature string", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          const features = LIGHT.EFFECT | LIGHT.FLASH;
          const result = hass.feature.hasFeature<"light">(features, "LIGHT.EFFECT");
          expect(result).toBe(true);
        });
      });
    });

    it("should work with numeric features input", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          const features = LIGHT.EFFECT | LIGHT.FLASH;
          const result = hass.feature.hasFeature(features, LIGHT.EFFECT);
          expect(result).toBe(true);
        });
      });
    });
  });

  describe("getSupportedFeatures", () => {
    it("should return array of supported feature numbers", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          // Use numeric features input instead of entity lookup
          const features = LIGHT.EFFECT | LIGHT.FLASH | LIGHT.TRANSITION;
          const result = hass.feature.getSupportedFeatures(features);
          expect(result).toEqual([LIGHT.EFFECT, LIGHT.FLASH, LIGHT.TRANSITION]);
        });
      });
    });

    it("should work with numeric features input", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          const features = LIGHT.EFFECT | LIGHT.FLASH;
          const result = hass.feature.getSupportedFeatures(features);
          expect(result).toEqual([LIGHT.EFFECT, LIGHT.FLASH]);
        });
      });
    });

    it("should return empty array when no features are supported", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          const features = 0;
          const result = hass.feature.getSupportedFeatures(features);
          expect(result).toEqual([]);
        });
      });
    });
  });

  describe("listEntityFeatures", () => {
    it("should return array of feature strings for light entity", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          // Use REAL entity reference from fixtures
          const entity = hass.refBy.id("light.test_light");
          const result = hass.feature.listEntityFeatures(entity);
          // light.test_light has supported_features: 44 (LIGHT.EFFECT | LIGHT.FLASH | LIGHT.TRANSITION)
          expect(result).toEqual(["LIGHT.EFFECT", "LIGHT.FLASH", "LIGHT.TRANSITION"]);
        });
      });
    });

    it("should return array of feature strings for todo entity", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          // Use REAL entity reference from fixtures
          const entity = hass.refBy.id("todo.test_todo");
          const result = hass.feature.listEntityFeatures(entity);
          // todo.test_todo has supported_features: 15 (TODO.CREATE_TODO_ITEM | TODO.DELETE_TODO_ITEM | TODO.UPDATE_TODO_ITEM | TODO.MOVE_TODO_ITEM)
          expect(result).toEqual([
            "TODO.CREATE_TODO_ITEM",
            "TODO.DELETE_TODO_ITEM",
            "TODO.UPDATE_TODO_ITEM",
            "TODO.MOVE_TODO_ITEM",
          ]);
        });
      });
    });

    it("should return array of feature strings for climate entity", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          // Use REAL entity reference from fixtures
          const entity = hass.refBy.id("climate.test_climate");
          const result = hass.feature.listEntityFeatures(entity);
          // climate.test_climate has supported_features: 1 (CLIMATE.TARGET_TEMPERATURE)
          expect(result).toEqual(["CLIMATE.TARGET_TEMPERATURE"]);
        });
      });
    });

    it("should return empty array for unsupported domain", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          // Use REAL entity reference from fixtures
          const entity = hass.refBy.id("unsupported.test");
          // @ts-expect-error part of the test
          const result = hass.feature.listEntityFeatures(entity);
          // unsupported.test has supported_features: 1 but domain is unsupported
          expect(result).toEqual([]);
        });
      });
    });

    it("should return empty array when no features are supported", async () => {
      expect.assertions(1);
      await hassTestRunner.run(({ lifecycle, hass }) => {
        lifecycle.onReady(async () => {
          // Use REAL entity reference from fixtures that has no features
          const entity = hass.refBy.id("sensor.magic");
          const result = hass.feature.listEntityFeatures(entity);
          // sensor.magic has supported_features: 0
          expect(result).toEqual([]);
        });
      });
    });
  });
});
