// interfaces/types
import { Locale } from "../types";

// consts/enums
import * as ActionTypes from "./actionTypes";
import { EditMode } from "../components/molecules/buttons/EditButton";

export interface SetLocaleAction {
    type: typeof ActionTypes.SET_LOCALE;
    payload: Locale;
}

export const setLocale = (locale: Locale) => ({
    type: ActionTypes.SET_LOCALE,
    payload: locale
});

export interface SetEditModeAction {
    type: typeof ActionTypes.SET_EDIT_MODE;
    payload: EditMode;
}

export const setEditMode = (editMode: EditMode): SetEditModeAction => ({
    type: ActionTypes.SET_EDIT_MODE,
    payload: editMode
});
