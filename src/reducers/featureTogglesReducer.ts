// externals
import { produce } from "immer";

// interfaces/types
import { AnyFSA } from "../types/reactHelperTypes";

export interface FeatureToggle {
    enabled: boolean;
    createdDateTime: Date;
    modifiedDateTime: Date;
}

export type FeatureToggles = {
    [key: string]: FeatureToggle;
};

export type FeatureTogglesState = Readonly<{
    toggles: FeatureToggles;
}>;

export const featureTogglesReducerInitialState = Object.freeze<FeatureTogglesState>({
    toggles: {}
});

export const featureTogglesReducer = (
    state: FeatureTogglesState = featureTogglesReducerInitialState,
    action: AnyFSA
): FeatureTogglesState =>
    produce(state, (draft) => {
        /* In future this will do something, for now the state comes from the server */
    });
