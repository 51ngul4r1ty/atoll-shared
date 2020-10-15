import { StateTree } from "../types";

export const getCurrentProjectId = (state: StateTree): string | null => {
    return state.user?.preferences?.selectedProject || null;
};
