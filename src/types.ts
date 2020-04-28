// externals
import { ForwardRefExoticComponent, PropsWithoutRef, PropsWithChildren, RefAttributes } from "react";
import { Action } from "redux";

// consts/enums
import { EditMode } from "./components/molecules/buttons/EditButton";

// interfaces/types
import { BacklogItemsState } from "./reducers/backlogItemsReducer";
import { DoneButtonProps } from "./components/molecules/buttons/DoneButton";

export type Locale = "en_US" | "de_DE";

export interface StateTree {
    app: AppState;
    backlogItems: BacklogItemsState;
    user: UserState;
    featureToggles: FeatureTogglesState;
}

/* Data model related */

export interface BaseModelItem {
    id: string;
}

/* App state related */

export enum PushNotificationType {
    None = 0,
    ModifiedBacklogItems = 1
}

export interface BasePushNotification {
    type: PushNotificationType;
}
export interface PushNotification<T> extends BasePushNotification {
    data: T;
}

export type AppState = Readonly<{
    authToken: string;
    editMode: EditMode;
    executingOnClient: boolean;
    locale: Locale;
    password: string;
    pushNotifications: PushNotification<any>[];
    requestToken: string;
    username: string;
}>;

/* User state related */

export interface UserPreferences {
    detectBrowserDarkMode: boolean;
}

export type UserState = Readonly<{
    preferences: UserPreferences;
}>;

/* Feature Toggles state related */

export interface FeatureToggle {
    enabled: boolean;
    createdDateTime: Date;
    modifiedDateTime: Date;
}

export type FeatureToggles = {
    [key: string]: FeatureToggle;
};

export type FeatureTogglesState = Readonly<{
    toggles: FeatureToggles;
}>;

/* Flux Standard Action related */

export interface AnyFSA extends FSAWithMeta<any, any, any> {}

export interface SimpleFSA<T> extends Action<T> {}

export interface FSA<T, P> extends SimpleFSA<T> {
    payload?: P;
}

export interface FSAWithMeta<T, P, M> extends FSA<T, P> {
    meta?: M;
}

/* Forwarded Ref Related */

export type ComponentWithForwardedRef<P> = ForwardRefExoticComponent<PropsWithoutRef<PropsWithChildren<P>> & RefAttributes<any>>;
