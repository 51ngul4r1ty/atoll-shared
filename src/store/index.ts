// externals
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { routerMiddleware } from "connected-react-router";
import { composeWithDevTools } from "redux-devtools-extension";

// reducers
import createRootReducer from "../reducers/rootReducer";

// middleware
import { apiMiddleware } from "../middleware/apiMiddleware";
import { routingMiddleware } from "../middleware/routingMiddleware";
import { wsMiddleware } from "../middleware/wsMiddleware";
import { apiOrchestrationMiddleware } from "../middleware/apiOrchestrationMiddleware";

const composeEnhancers = composeWithDevTools({
    name: "Atoll",
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
    trace: true,
    features: {
        pause: true,
        dispatch: true
    }
});

type StoreParams = {
    initialState?: { [key: string]: any };
    middleware?: any[];
    history: any;
};

export const configureStore = ({ initialState, middleware = [], history }: StoreParams) => {
    const rootReducer = createRootReducer(history);

    const allMiddleware = [
        thunk,
        routerMiddleware(history),
        apiOrchestrationMiddleware,
        apiMiddleware,
        routingMiddleware,
        wsMiddleware
    ].concat(...middleware);

    const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...allMiddleware)));

    return store;
};

export default configureStore;
