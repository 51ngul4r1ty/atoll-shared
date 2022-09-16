// externals
import { createSelector } from "reselect";

// interfaces/types
import { EditMode } from "../components/common/componentEnums";

// consts/enums
import { POST_LOGIN_RETURN_ROUTE_TIMEOUT_SECONDS } from "../constants";

// interfaces/types
import type { AppState, Locale } from "../reducers/app/appReducer";
import type { StateTree } from "../reducers/rootReducer";

// utils
import { timeoutExpired } from "../utils/dateHelper";

const app = (state: { app: AppState }): AppState => state.app;

export const getLocale = createSelector([app], (app: AppState): Locale => app.locale);

export const getAuthToken = createSelector([app], (app: AppState): string => app.authToken);

export const getAppEditMode = createSelector([app], (app: AppState): EditMode => app.editMode);

export const getElectronClient = createSelector([app], (app: AppState): boolean => app.electronClient);

export const getAppMessage = createSelector([app], (app: AppState): string => app.message);

export const isPlanViewLoading = createSelector([app], (app: AppState): boolean => app.isPlanViewLoading);

export const isPlanViewError = createSelector([app], (app: AppState): boolean => app.isPlanViewError);

export const isStrictMode = createSelector([app], (app: AppState): boolean => app.isStrictMode);

export const selectUserName = createSelector([app], (app: AppState): string => app.username);

export const selectPassword = createSelector([app], (app: AppState): string => app.password);

// NOTE: This doesn't use reselect because it must never use cached data
export const getPostLoginReturnRoute = (state: StateTree): string | null => {
    // give the user 2 minutes to log in - after that the app will automaticaly
    // "forget" the route that they entered with.
    const expired = timeoutExpired(state.app.postLoginReturnRouteSetAt, POST_LOGIN_RETURN_ROUTE_TIMEOUT_SECONDS);
    if (!expired) {
        return state.app.postLoginReturnRoute ?? null;
    } else {
        return null;
    }
};
