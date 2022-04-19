import { StateTree } from "../reducers/rootReducer";

export const getCurrentProjectId = (state: StateTree): string | null => {
    return state.user?.preferences?.selectedProject ?? null;
};
