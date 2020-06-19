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

export interface InitAppAction {
    type: typeof ActionTypes.INIT_APP;
}

export const initApp = (): InitAppAction => ({
    type: ActionTypes.INIT_APP
});

export interface AppClickAction {
    type: typeof ActionTypes.APP_CLICK;
    payload: MouseEvent;
}

export const appClick = (e: MouseEvent): AppClickAction => ({
    type: ActionTypes.APP_CLICK,
    payload: e
});

export interface LocalStoreRefreshTokenAction {
    type: typeof ActionTypes.LOCAL_STORE_REFRESH_TOKEN;
    payload: {
        refreshToken: string;
    };
}

export const localStoreRefreshToken = (refreshToken: string): LocalStoreRefreshTokenAction => ({
    type: ActionTypes.LOCAL_STORE_REFRESH_TOKEN,
    payload: {
        refreshToken
    }
});
