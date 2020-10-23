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
import { sprintBacklogReducer, sprintBacklogReducerInitialState, SprintBacklogState } from "./sprintBacklogReducer";

export interface StateTree {
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
