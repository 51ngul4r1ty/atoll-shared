// externals
import { combineReducers } from "redux";
import { connectRouter, RouterState } from "connected-react-router";
import { LocationState } from "history";

// reducers
import { apiBatchReducer, apiBatchReducerInitialState, ApiBatchState } from "./apiBatchReducer";
import { apiLinksReducer, apiLinksReducerInitialState, ApiLinkState } from "./apiLinksReducer";
import { appReducer, appReducerInitialState, AppState } from "./app/appReducer";
import {
    productBacklogItemsReducer,
    productBacklogItemsReducerInitialState,
    ProductBacklogItemsState
} from "./productBacklogItemsReducer";
import { backlogItemsReducer, backlogItemsReducerInitialState } from "./backlogItems/backlogItemsReducer";
import { featureTogglesReducer, featureTogglesReducerInitialState, FeatureTogglesState } from "./featureTogglesReducer";
import { sprintBacklogReducer, sprintBacklogReducerInitialState, SprintBacklogState } from "./sprintBacklog/sprintBacklogReducer";
import { sprintsReducer, sprintsReducerInitialState, SprintsState } from "./sprints/sprintsReducer";
import { userReducer, userReducerInitialState, UserState } from "./userReducer";
import { BacklogItemsState } from "./backlogItems/backlogItemsReducerTypes";
import { projectReducer, projectReducerInitialState, ProjectState } from "./project/projectReducer";

export interface StateTree {
    apiBatch: ApiBatchState;
    apiLinks: ApiLinkState;
    app: AppState;
    backlogItems: BacklogItemsState;
    electronClient: boolean;
    executingOnClient: boolean;
    featureToggles: FeatureTogglesState;
    productBacklogItems: ProductBacklogItemsState;
    project: ProjectState;
    router: RouterState<LocationState>;
    sprintBacklog: SprintBacklogState;
    sprints: SprintsState;
    user: UserState;
}

export const rootReducerInitialState = {
    apiBatch: apiBatchReducerInitialState,
    apiLinks: apiLinksReducerInitialState,
    app: appReducerInitialState,
    backlogItems: backlogItemsReducerInitialState,
    featureToggles: featureTogglesReducerInitialState,
    productBacklogItems: productBacklogItemsReducerInitialState,
    project: projectReducerInitialState,
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
        backlogItems: backlogItemsReducer,
        featureToggles: featureTogglesReducer,
        productBacklogItems: productBacklogItemsReducer,
        project: projectReducer,
        router,
        sprintBacklog: sprintBacklogReducer,
        sprints: sprintsReducer,
        user: userReducer
    });
};

export default createRootReducer;
