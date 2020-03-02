// externals
import { Action } from "redux";

// consts/enums
import { EditMode } from "./components/molecules/buttons/EditButton";

export type Locale = "en_US" | "de_DE";

export interface StateTree {
    app: AppState;
    backlogItems: BacklogItemsState;
    user: UserState;
    featureToggles: FeatureTogglesState;
}

/* App state related */

export type AppState = Readonly<{
    locale: Locale;
    editMode: EditMode;
}>;

/* User state related */

export interface UserPreferences {
    detectBrowserDarkMode: boolean;
}

export type UserState = Readonly<{
    preferences: UserPreferences;
}>;

/* Backlog Item state related */

export type BacklogItemType = "story" | "issue";

export interface BacklogItem {
    creationDateTime: Date;
    displayIndex: number;
    estimate: number | null;
    externalId: string | null;
    id: number;
    reasonPhrase: string | null;
    rolePhrase: string | null;
    storyPhrase: string;
    type: BacklogItemType;
}

export type BacklogItemsState = Readonly<{
    addedItems: BacklogItem[];
    items: BacklogItem[];
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
