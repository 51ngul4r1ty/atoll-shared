// externals
import { combineReducers } from "redux";
import { connectRouter, RouterState } from "connected-react-router";

// reducers
import { apiBatchReducer, apiBatchReducerInitialState, ApiBatchState } from "./apiBatchReducer";
import { apiLinksReducer, apiLinksReducerInitialState, ApiLinkState } from "./apiLinksReducer";
import { appReducer, appReducerInitialState, AppState } from "./appReducer";
import {
    productBacklogItemsReducer,
    productBacklogItemsReducerInitialState,
    ProductBacklogItemsState
} from "./productBacklogItemsReducer";
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
    productBacklogItems: ProductBacklogItemsState;
    backlogItems: BacklogItemsState;
    electronClient: boolean;
    executingOnClient: boolean;
    featureToggles: FeatureTogglesState;
    sprintBacklog: SprintBacklogState;
    sprints: SprintsState;
    user: UserState;
    router: RouterState;
}

export const rootReducerInitialState = {
    apiBatch: apiBatchReducerInitialState,
    apiLinks: apiLinksReducerInitialState,
    app: appReducerInitialState,
    productBacklogItems: productBacklogItemsReducerInitialState,
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
        productBacklogItems: productBacklogItemsReducer,
        backlogItems: backlogItemsReducer,
        featureToggles: featureTogglesReducer,
        router,
        sprintBacklog: sprintBacklogReducer,
        sprints: sprintsReducer,
        user: userReducer
    });
};

export default createRootReducer;
