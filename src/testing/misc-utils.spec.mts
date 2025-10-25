import {
  createSupportedFeatures,
  getSupportedFeatures,
  hasFeature,
  LIGHT_FEATURES,
  SWITCH_FEATURES,
} from "../helpers/supported-features.mts";

describe("Supported Features", () => {
  describe("hasFeature", () => {
    it("should return true when feature is supported", () => {
      const features = LIGHT_FEATURES.SUPPORT_BRIGHTNESS | LIGHT_FEATURES.SUPPORT_COLOR;
      expect(hasFeature(features, LIGHT_FEATURES.SUPPORT_BRIGHTNESS)).toBe(true);
    });

    it("should return false when feature is not supported", () => {
      const features = LIGHT_FEATURES.SUPPORT_BRIGHTNESS;
      expect(hasFeature(features, LIGHT_FEATURES.SUPPORT_COLOR)).toBe(false);
    });

    it("should work with zero features", () => {
      expect(hasFeature(0, LIGHT_FEATURES.SUPPORT_BRIGHTNESS)).toBe(false);
    });
  });

  describe("getSupportedFeatures", () => {
    it("should return empty array for zero features", () => {
      expect(getSupportedFeatures(0)).toEqual([]);
    });

    it("should return single feature", () => {
      const features = LIGHT_FEATURES.SUPPORT_BRIGHTNESS;
      expect(getSupportedFeatures(features)).toEqual([LIGHT_FEATURES.SUPPORT_BRIGHTNESS]);
    });

    it("should return multiple features", () => {
      const features = LIGHT_FEATURES.SUPPORT_BRIGHTNESS | LIGHT_FEATURES.SUPPORT_COLOR;
      const supported = getSupportedFeatures(features);
      expect(supported).toContain(LIGHT_FEATURES.SUPPORT_BRIGHTNESS);
      expect(supported).toContain(LIGHT_FEATURES.SUPPORT_COLOR);
      expect(supported).toHaveLength(2);
    });
  });

  describe("createSupportedFeatures", () => {
    it("should return 0 for empty array", () => {
      expect(createSupportedFeatures([])).toBe(0);
    });

    it("should return single feature", () => {
      const features = [LIGHT_FEATURES.SUPPORT_BRIGHTNESS];
      expect(createSupportedFeatures(features)).toBe(LIGHT_FEATURES.SUPPORT_BRIGHTNESS);
    });

    it("should combine multiple features", () => {
      const features = [LIGHT_FEATURES.SUPPORT_BRIGHTNESS, LIGHT_FEATURES.SUPPORT_COLOR];
      const combined = createSupportedFeatures(features);
      expect(hasFeature(combined, LIGHT_FEATURES.SUPPORT_BRIGHTNESS)).toBe(true);
      expect(hasFeature(combined, LIGHT_FEATURES.SUPPORT_COLOR)).toBe(true);
    });
  });

  describe("Feature Constants", () => {
    it("should have correct light feature values", () => {
      expect(LIGHT_FEATURES.SUPPORT_BRIGHTNESS).toBe(1);
      expect(LIGHT_FEATURES.SUPPORT_COLOR_TEMP).toBe(2);
      expect(LIGHT_FEATURES.SUPPORT_EFFECT).toBe(4);
      expect(LIGHT_FEATURES.SUPPORT_COLOR).toBe(16);
    });

    it("should have correct switch feature values", () => {
      expect(SWITCH_FEATURES.SUPPORT_FLASH).toBe(1);
      expect(SWITCH_FEATURES.SUPPORT_TRANSITION).toBe(2);
    });

    it("should have unique values", () => {
      const lightValues = Object.values(LIGHT_FEATURES);
      const uniqueValues = new Set(lightValues);
      expect(uniqueValues.size).toBe(lightValues.length);
    });
  });
});
