/* eslint-disable import/prefer-default-export */
// externals
import { createSelector } from "reselect";

// interfaces/types
import { AppState, Locale } from "../reducers/appReducer";

export const app = (state: { app: AppState }): AppState => state.app;

export const getLocale = createSelector([app], (app: AppState): Locale => app.locale);

export const getAuthToken = createSelector([app], (app: AppState): string => app.authToken);
