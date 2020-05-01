/* eslint-disable import/prefer-default-export */
import { createSelector } from "reselect";
import { AppState, Locale } from "../types";

export const app = (state: { app: AppState }): AppState => state.app;

export const getLocale = createSelector([app], (app: AppState): Locale => app.locale);

export const getAuthToken = createSelector([app], (app: AppState): string => app.authToken);
