import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware } from "connected-react-router";
import createRootReducer from "./rootReducer";
import { composeWithDevTools } from "redux-devtools-extension";

const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

type StoreParams = {
    initialState?: { [key: string]: any };
    middleware?: any[];
    history: any;
};

export const configureStore = ({ initialState, middleware = [], history }: StoreParams) => {
    const rootReducer = createRootReducer(history);

    const allMiddleware = [thunk, routerMiddleware(history)].concat(...middleware);

    const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...allMiddleware)));

    return store;
};

export default configureStore;
