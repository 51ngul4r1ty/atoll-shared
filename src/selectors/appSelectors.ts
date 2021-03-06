// externals
import { createSelector } from "reselect";

// interfaces/types
import { EditMode } from "../components/common/componentEnums";

// interfaces/types
import { AppState, Locale } from "../reducers/appReducer";

export const app = (state: { app: AppState }): AppState => state.app;

export const getLocale = createSelector([app], (app: AppState): Locale => app.locale);

export const getAuthToken = createSelector([app], (app: AppState): string => app.authToken);

export const getAppEditMode = createSelector([app], (app: AppState): EditMode => app.editMode);

export const getElectronClient = createSelector([app], (app: AppState): boolean => app.electronClient);

export const getAppMessage = createSelector([app], (app: AppState): string => app.message);

export const isPlanViewLoading = createSelector([app], (app: AppState): boolean => app.isPlanViewLoading);
