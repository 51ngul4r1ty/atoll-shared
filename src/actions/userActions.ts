// interfaces/types
import { API, NoDataApiAction } from "../middleware/apiTypes";

// actions
import * as ApiActionNames from "./apiActionNames";

// consts/enums
import { APPLICATION_JSON } from "../constants";

// utils
import { getApiBaseUrl } from "../config";
import { buildActionTypes } from "./utils/apiActionUtils";

export const getUserPreferences = (): NoDataApiAction => ({
    type: API,
    payload: {
        endpoint: `${getApiBaseUrl()}api/v1/users/{self}/preferences`,
        method: "GET",
        headers: { "Content-Type": APPLICATION_JSON, Accept: APPLICATION_JSON },
        types: buildActionTypes(ApiActionNames.GET_USER_PREFS)
    }
});
