// externals
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// reducers
import { apiLinksReducer, apiLinksReducerInitialState } from "./apiLinksReducer";
import { appReducer, appReducerInitialState } from "./appReducer";
import { backlogItemRanksReducer, backlogItemRanksReducerInitialState } from "./backlogItemRanksReducer";
import { backlogItemsReducer, backlogItemsReducerInitialState } from "./backlogItems/backlogItemsReducer";
import { featureTogglesReducer, featureTogglesReducerInitialState } from "./featureTogglesReducer";
import { sprintsReducer, sprintsReducerInitialState } from "./sprintsReducer";
import { userReducer, userReducerInitialState } from "./userReducer";

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
