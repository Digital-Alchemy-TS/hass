/* eslint-disable @typescript-eslint/no-magic-numbers */

import { LABEL, type TServiceParams } from "@digital-alchemy/core";

import type { ByIdProxy } from "../helpers/entity-state.mts";
import type {
  SupportedEntityFeatures,
  SupportedFeatureDomains,
  UsedSupportedFeatureDomains,
} from "../index.mts";
import { domain, SUPPORTED_FEATURES } from "../index.mts";
import type { PICK_ENTITY } from "../user.mts";

export function HassFeatureService({
  hass,
  logger,
  internal: {
    utils: { is },
  },
}: TServiceParams) {
  /**
   * Helper function to create supported features from an array of feature numbers
   */
  function createSupportedFeatures<T extends UsedSupportedFeatureDomains>(
    features: number[] | SupportedEntityFeatures<T>[],
  ): number {
    return features.reduce((acc: number, feature) => {
      if (is.string(feature)) {
        const original = feature;
        const [domain, featureName] = feature.split(".") as [SupportedFeatureDomains, string];
        const featureDomain = SUPPORTED_FEATURES[domain] as Record<string, number>;
        feature = featureDomain?.[featureName];
        if (!featureDomain?.[featureName]) {
          feature = 0;
          logger.error({ feature: original }, `invalid feature lookup`);
        }
      }
      return acc | feature;
    }, 0);
  }

  function lookup(input: PICK_ENTITY | ByIdProxy<PICK_ENTITY>) {
    const ref = is.string(input) ? hass.refBy.id(input) : input;
    const attributes = ref.attributes as { supported_features: number };
    return attributes?.supported_features ?? 0;
  }

  /**
   *  Helper function to check if an entity supports a specific feature
   */
  function hasFeature<T extends UsedSupportedFeatureDomains>(
    input: number | PICK_ENTITY<T> | ByIdProxy<PICK_ENTITY<T>>,
    feature: number | SupportedEntityFeatures<T>,
  ): boolean {
    const features = is.number(input) ? input : lookup(input);
    if (is.string(feature)) {
      const original = feature;
      const [domain, featureName] = feature.split(".") as [SupportedFeatureDomains, string];
      const featureDomain = SUPPORTED_FEATURES[domain] as Record<string, number>;
      feature = featureDomain?.[featureName];
      if (!feature) {
        feature = 0;
        logger.error({ feature: original }, `invalid feature lookup`);
      }
    }
    return (features & feature) !== 0;
  }

  /**
   * Helper function to get all supported features as an array
   * Can accept a number (bitmask), entity ID, or entity proxy
   */
  function getSupportedFeatures(input: number | PICK_ENTITY | ByIdProxy<PICK_ENTITY>): number[] {
    const features = is.number(input) ? input : lookup(input);

    const supported: number[] = [];
    let bit = 1;
    while (bit <= features) {
      if ((features & bit) !== 0) {
        supported.push(bit);
      }
      bit <<= 1;
    }
    return supported;
  }

  function listEntityFeatures<
    DOMAIN extends UsedSupportedFeatureDomains = UsedSupportedFeatureDomains,
  >(
    input: PICK_ENTITY<DOMAIN> | ByIdProxy<PICK_ENTITY<DOMAIN>>,
  ): SupportedEntityFeatures<DOMAIN>[] {
    const inputDomain = domain(is.string(input) ? input : input.entity_id);
    const domainFeatures = SUPPORTED_FEATURES[inputDomain.toUpperCase() as SupportedFeatureDomains];
    if (!domainFeatures) {
      return [];
    }
    const features = lookup(input);

    const supported: number[] = [];
    let bit = 1;
    while (bit <= features) {
      if ((features & bit) !== 0) {
        supported.push(bit);
      }
      bit <<= 1;
    }

    const options = Object.entries(domainFeatures);
    return supported.map(
      i =>
        (inputDomain.toUpperCase() +
          options.find(([, value]) => value === i)[
            LABEL
          ]) as `${Uppercase<DOMAIN>}.${Extract<keyof SUPPORTED_FEATURES[Uppercase<DOMAIN>], string>}`,
    );
  }

  return {
    createSupportedFeatures,
    getSupportedFeatures,
    hasFeature,
    listEntityFeatures,
  };
}
