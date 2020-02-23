// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AppState, AnyFSA } from "../types";
import { EditMode } from "../components/molecules/buttons/EditButton";

export const initialState = Object.freeze<AppState>({
    locale: "en_US",
    editMode: EditMode.View
});

export default (state: AppState = initialState, action: AnyFSA): AppState =>
    produce(state, (draft) => {
        const { type, payload } = action;

        switch (type) {
            case ActionTypes.SET_LOCALE: {
                draft.locale = payload;
                return;
            }
            case ActionTypes.SET_EDIT_MODE: {
                draft.editMode = payload;
                return;
            }
        }
    });
