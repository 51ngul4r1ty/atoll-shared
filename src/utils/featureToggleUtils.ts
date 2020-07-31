import { FeatureToggles } from "../types";

export const buildFeatureTogglesList = (featureToggles: FeatureToggles) => {
    const result = {};
    Object.keys(featureToggles).forEach((key) => {
        const value = featureToggles[key];
        result[key] = value.enabled;
    });
    return result;
};
