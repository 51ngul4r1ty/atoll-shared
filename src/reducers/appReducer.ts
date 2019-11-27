// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AppState, AnyFSA } from "../types";

export const initialState = Object.freeze<AppState>({
    locale: "en_US"
});

export default (state: AppState = initialState, action: AnyFSA): AppState =>
    produce(state, (draft) => {
        const { type, payload } = action;

        switch (type) {
            case ActionTypes.SETLOCALE: {
                draft.locale = payload;
                return;
            }
        }
    });
