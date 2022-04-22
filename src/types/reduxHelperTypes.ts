// externals
import type { Dispatch, MiddlewareAPI } from "redux";

// interfaces/types
import type { StateTree } from "../reducers/rootReducer";

export type StoreTyped = MiddlewareAPI<Dispatch, StateTree>;
