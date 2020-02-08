// externals
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// reducers
import app from "./appReducer";
import backlogItems from "./backlogItemsReducer";

const createRootReducer = (history: any) => {
    const router = connectRouter(history);
    return combineReducers({
        router,
        app,
        backlogItems
    });
};

export default createRootReducer;
