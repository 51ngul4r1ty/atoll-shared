import { combineReducers } from "redux";
import app from "./app/reducer";
import { connectRouter } from "connected-react-router";

const createRootReducer = (history: any) => {
    const router = connectRouter(history);
    return combineReducers({
        router,
        app
    });
};

export default createRootReducer;
