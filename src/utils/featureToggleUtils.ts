// interfaces/types
import { FeatureToggles } from "../reducers/featureTogglesReducer";

export const buildFeatureTogglesList = (featureToggles: FeatureToggles) => {
    const result = {};
    Object.keys(featureToggles).forEach((key) => {
        const value = featureToggles[key];
        result[key] = value.enabled;
    });
    return result;
};
