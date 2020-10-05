// externals
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// reducers
import { appReducer, appReducerInitialState } from "./appReducer";
import { apiLinksReducer, apiLinksReducerInitialState } from "./apiLinksReducer";
import { backlogItemsReducer, backlogItemsReducerInitialState } from "./backlogItemsReducer";
import { backlogItemRanksReducer, backlogItemRanksReducerInitialState } from "./backlogItemRanksReducer";
import { userReducer, userReducerInitialState } from "./userReducer";
import { featureTogglesReducer, featureTogglesReducerInitialState } from "./featureTogglesReducer";

export const rootReducerInitialState = {
    app: appReducerInitialState,
    apiLinks: apiLinksReducerInitialState,
    backlogItems: backlogItemsReducerInitialState,
    backlogItemRanks: backlogItemRanksReducerInitialState,
    user: userReducerInitialState,
    featureToggles: featureTogglesReducerInitialState
};

const createRootReducer = (history: any) => {
    const router = connectRouter(history);
    return combineReducers({
        router,
        app: appReducer,
        apiLinks: apiLinksReducer,
        backlogItems: backlogItemsReducer,
        backlogItemRanks: backlogItemRanksReducer,
        user: userReducer,
        featureToggles: featureTogglesReducer
    });
};

export default createRootReducer;
