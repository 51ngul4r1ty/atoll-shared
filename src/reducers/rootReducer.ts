// externals
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// reducers
import { appReducer } from "./appReducer";
import { backlogItemsReducer } from "./backlogItemsReducer";
import { userReducer } from "./userReducer";
import { featureTogglesReducer } from "./featureTogglesReducer";

const createRootReducer = (history: any) => {
    const router = connectRouter(history);
    return combineReducers({
        router,
        app: appReducer,
        backlogItems: backlogItemsReducer,
        user: userReducer,
        featureToggles: featureTogglesReducer
    });
};

export default createRootReducer;