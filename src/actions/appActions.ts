// interfaces/types
import type { Locale } from "../reducers/app/appReducer";
import type { FSA } from "../types/reactHelperTypes";

// consts/enums
import * as ActionTypes from "./actionTypes";
import { EditMode } from "../components/common/componentEnums";

// utils
import {
    getEltDataAttribute,
    getEltDataClass,
    getFirstElementAtXYWithAnyDataClass,
    getFirstParentWithAnyDataClass
} from "../components/common/domUtils";

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

export interface AppClickActionPayload {
    mouseEvent: MouseEvent;
    parent?: {
        dataClass: string;
        dataId: string | null;
        itemId: string | null;
        itemType: string | null;
    };
}

export interface AppClickAction {
    type: typeof ActionTypes.APP_CLICK;
    payload: AppClickActionPayload;
}

export const appClick = (mouseEvent: MouseEvent): AppClickAction => {
    const payload: AppClickActionPayload = {
        mouseEvent
    };
    if (mouseEvent.button === 0) {
        let parentElt: Element = getFirstParentWithAnyDataClass(mouseEvent.target as HTMLElement);
        if (!parentElt) {
            const x = mouseEvent.clientX;
            const y = mouseEvent.clientY;
            parentElt = getFirstElementAtXYWithAnyDataClass(x, y);
        }
        if (parentElt) {
            payload.parent = {
                dataClass: getEltDataClass(parentElt),
                dataId: getEltDataAttribute(parentElt, "id") ?? null,
                itemId: getEltDataAttribute(parentElt, "item-id") ?? null,
                itemType: getEltDataAttribute(parentElt, "item-type") ?? null
            };
        }
    }
    return {
        type: ActionTypes.APP_CLICK,
        payload
    };
};

export interface AppKeyUpAction {
    type: typeof ActionTypes.APP_KEYUP;
    payload: KeyboardEvent;
}

export const appKeyUp = (e: KeyboardEvent): AppKeyUpAction => ({
    type: ActionTypes.APP_KEYUP,
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

export const errorPanelClick = () => ({
    type: ActionTypes.ERROR_PANEL_CLICK
});

export type StorePostLoginReturnRouteAction = FSA<typeof ActionTypes.STORE_RETURN_ROUTE, string>;
export const storePostLoginReturnRoute = (returnRoute: string): StorePostLoginReturnRouteAction => ({
    type: ActionTypes.STORE_RETURN_ROUTE,
    payload: returnRoute
});

export const clearPostLoginReturnRoute = () => ({
    type: ActionTypes.CLEAR_RETURN_ROUTE
});

export const refreshView = () => ({
    type: ActionTypes.APP_REFRESH_VIEW
});
