// interfaces/types
import type { StateTree } from "../reducers/rootReducer";

export const selectCurrentRoute = (state: StateTree): string | null => state.router?.location?.pathname || null;
