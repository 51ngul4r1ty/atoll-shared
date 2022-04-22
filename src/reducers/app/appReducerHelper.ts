// externals
import * as queryString from "query-string";

// utils
import * as browserUtils from "../../utils/browserUtils";

/**
 * NOTE: This is currently hard-coded, but it could be a preference type thing or come from an environment variable in future.
 */
export const isStrictModeEnabledByDefaultForLocalhost = () => false;

export const getStrictModeFromBrowserUrl = () => {
    const hostName = browserUtils.getBrowserHostName();
    const strictMode = isStrictModeEnabledByDefaultForLocalhost() && hostName === "localhost";
    const queryParams = queryString.parse(browserUtils.getBrowserQueryString());
    const rawStrictModeQueryParamValue = queryParams["strict-mode"];
    if (!rawStrictModeQueryParamValue) {
        return strictMode;
    }
    const strictModeQueryParamValue = rawStrictModeQueryParamValue === "true";
    if (rawStrictModeQueryParamValue === "true") {
        return true;
    } else if (rawStrictModeQueryParamValue === "false") {
        return false;
    } else {
        console.warn(`invalid strict-mode query param provided - using default based on browser url: ${strictMode}`);
        return strictMode;
    }
};
