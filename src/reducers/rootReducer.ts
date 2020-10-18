// externals
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// reducers
import { apiLinksReducer, apiLinksReducerInitialState, ApiLinkState } from "./apiLinksReducer";
import { appReducer, appReducerInitialState, AppState } from "./appReducer";
import { backlogItemRanksReducer, backlogItemRanksReducerInitialState, BacklogItemRanksState } from "./backlogItemRanksReducer";
import { backlogItemsReducer, backlogItemsReducerInitialState } from "./backlogItems/backlogItemsReducer";
import { featureTogglesReducer, featureTogglesReducerInitialState, FeatureTogglesState } from "./featureTogglesReducer";
import { sprintsReducer, sprintsReducerInitialState, SprintsState } from "./sprintsReducer";
import { userReducer, userReducerInitialState, UserState } from "./userReducer";
import { BacklogItemsState } from "./backlogItems/backlogItemsReducerTypes";

export interface StateTree {
    apiLinks: ApiLinkState;
    app: AppState;
    backlogItems: BacklogItemsState;
    backlogItemRanks: BacklogItemRanksState;
    electronClient: boolean;
    executingOnClient: boolean;
    user: UserState;
    featureToggles: FeatureTogglesState;
    sprints: SprintsState;
}

export const rootReducerInitialState = {
    app: appReducerInitialState,
    apiLinks: apiLinksReducerInitialState,
    backlogItems: backlogItemsReducerInitialState,
    backlogItemRanks: backlogItemRanksReducerInitialState,
    user: userReducerInitialState,
    featureToggles: featureTogglesReducerInitialState,
    sprints: sprintsReducerInitialState
};

const createRootReducer = (history: any) => {
    const router = connectRouter(history);
    return combineReducers({
        apiLinks: apiLinksReducer,
        app: appReducer,
        backlogItemRanks: backlogItemRanksReducer,
        backlogItems: backlogItemsReducer,
        featureToggles: featureTogglesReducer,
        router,
        sprints: sprintsReducer,
        user: userReducer
    });
};

export default createRootReducer;
