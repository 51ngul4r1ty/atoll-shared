// externals
import thunk from "redux-thunk";
import { compose, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { routerMiddleware } from "connected-react-router";

// reducers
import createRootReducer from "../reducers/rootReducer";

// middleware
import { apiBatchMiddleware } from "../middleware/apiBatchMiddleware";
import { apiMiddleware } from "../middleware/apiMiddleware";
import { apiOrchestrationMiddleware } from "../middleware/apiOrchestrationMiddleware";
import { appMiddleware } from "../middleware/appMiddleware";
import { actionSequencerMiddleware } from "../middleware/actionSequencerMiddleware";
import { localStorageMiddleware } from "../middleware/localStorageMiddleware";
import { projectMiddleware } from "../middleware/projectMiddleware";
import { routingMiddleware } from "../middleware/routingMiddleware";
import { sprintBacklogItemMiddleware } from "../middleware/sprintBacklogItemMiddleware";
import { wsMiddleware } from "../middleware/wsMiddleware";

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
    windowRef?: any;
};

export const configureStore = ({ initialState, middleware = [], history, windowRef }: StoreParams) => {
    const rootReducer = createRootReducer(history);

    const allMiddleware = [
        thunk,
        routerMiddleware(history),
        localStorageMiddleware,
        apiBatchMiddleware,
        apiMiddleware,
        apiOrchestrationMiddleware,
        appMiddleware,
        actionSequencerMiddleware,
        projectMiddleware,
        routingMiddleware,
        sprintBacklogItemMiddleware,
        wsMiddleware
    ].concat(...middleware);

    let store;
    if (!windowRef) {
        store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...allMiddleware)));
    } else {
        store = createStore(
            rootReducer,
            initialState,
            compose(
                applyMiddleware(...allMiddleware),
                windowRef.__REDUX_DEVTOOLS_EXTENSION__ ? windowRef.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f
            )
        );
    }
    return store;
};

export default configureStore;
