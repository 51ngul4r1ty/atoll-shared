// externals
import { Action, Store } from "redux";
import * as HttpStatus from "http-status-codes";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// state
import { StateTree } from "../reducers/rootReducer";

// actions
import {
    ActionPostLoginSuccessAction,
    ActionPostRefreshTokenSuccessAction //,
    // getAuthTokenWithRefreshToken
} from "../actions/authActions";
import { localStoreRefreshToken } from "../actions/appActions";

const storeRefreshTokenIfSuccesful = (action: ActionPostLoginSuccessAction | ActionPostRefreshTokenSuccessAction) => {
    if (action.payload.response.status === HttpStatus.OK) {
        localStorage.setItem("refresh-token", action.payload.response.data.item.refreshToken);
    }
};

export const localStorageMiddleware = (store) => (next) => (action: Action) => {
    next(action);
    const storeTyped = store as Store<StateTree>;
    switch (action.type) {
        case ActionTypes.INIT_APP: {
            const refreshToken = localStorage.getItem("refresh-token");
            if (refreshToken) {
                storeTyped.dispatch(localStoreRefreshToken(refreshToken));
            }
            break;
        }
        case ActionTypes.API_POST_ACTION_LOGIN_SUCCESS: {
            const actionTyped = action as ActionPostLoginSuccessAction;
            storeRefreshTokenIfSuccesful(actionTyped);
            break;
        }
        case ActionTypes.API_POST_ACTION_RETRY_TOKEN_SUCCESS: {
            const actionTyped = action as ActionPostRefreshTokenSuccessAction;
            storeRefreshTokenIfSuccesful(actionTyped);
            break;
        }
    }
};
