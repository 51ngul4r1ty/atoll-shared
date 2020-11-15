// externals
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// reducers
import { apiBatchReducer, apiBatchReducerInitialState, ApiBatchState } from "./apiBatchReducer";
import { apiLinksReducer, apiLinksReducerInitialState, ApiLinkState } from "./apiLinksReducer";
import { appReducer, appReducerInitialState, AppState } from "./appReducer";
import { backlogItemRanksReducer, backlogItemRanksReducerInitialState, BacklogItemRanksState } from "./backlogItemRanksReducer";
import { backlogItemsReducer, backlogItemsReducerInitialState } from "./backlogItems/backlogItemsReducer";
import { featureTogglesReducer, featureTogglesReducerInitialState, FeatureTogglesState } from "./featureTogglesReducer";
import { sprintBacklogReducer, sprintBacklogReducerInitialState, SprintBacklogState } from "./sprintBacklogReducer";
import { sprintsReducer, sprintsReducerInitialState, SprintsState } from "./sprintsReducer";
import { userReducer, userReducerInitialState, UserState } from "./userReducer";
import { BacklogItemsState } from "./backlogItems/backlogItemsReducerTypes";

export interface StateTree {
    apiBatch: ApiBatchState;
    apiLinks: ApiLinkState;
    app: AppState;
    backlogItemRanks: BacklogItemRanksState;
    backlogItems: BacklogItemsState;
    electronClient: boolean;
    executingOnClient: boolean;
    featureToggles: FeatureTogglesState;
    sprintBacklog: SprintBacklogState;
    sprints: SprintsState;
    user: UserState;
}

export const rootReducerInitialState = {
    apiBatch: apiBatchReducerInitialState,
    apiLinks: apiLinksReducerInitialState,
    app: appReducerInitialState,
    backlogItemRanks: backlogItemRanksReducerInitialState,
    backlogItems: backlogItemsReducerInitialState,
    featureToggles: featureTogglesReducerInitialState,
    sprintBacklog: sprintBacklogReducerInitialState,
    sprints: sprintsReducerInitialState,
    user: userReducerInitialState
};

const createRootReducer = (history: any) => {
    const router = connectRouter(history);
    return combineReducers({
        apiBatch: apiBatchReducer,
        apiLinks: apiLinksReducer,
        app: appReducer,
        backlogItemRanks: backlogItemRanksReducer,
        backlogItems: backlogItemsReducer,
        featureToggles: featureTogglesReducer,
        router,
        sprintBacklog: sprintBacklogReducer,
        sprints: sprintsReducer,
        user: userReducer
    });
};

export default createRootReducer;
