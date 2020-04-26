// interfaces/types
import { Locale, FSA, SimpleFSA } from "../types";

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

export type SetUsernameAction = FSA<typeof ActionTypes.SET_USERNAME, string>;
export const setUsername = (username: string): SetUsernameAction => ({
    type: ActionTypes.SET_USERNAME,
    payload: username
});

export type SetPasswordAction = FSA<typeof ActionTypes.SET_PASSWORD, string>;
export const setPassword = (password: string): SetPasswordAction => ({
    type: ActionTypes.SET_PASSWORD,
    payload: password
});

export type LoginUserAction = SimpleFSA<typeof ActionTypes.LOGIN_USER>;
export const loginUser = (): LoginUserAction => ({
    type: ActionTypes.LOGIN_USER
});
