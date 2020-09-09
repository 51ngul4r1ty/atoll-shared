// externals
import { produce } from "immer";

// interfaces/types
import { AnyFSA, FeatureTogglesState } from "../types";

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
