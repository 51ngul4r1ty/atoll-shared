// interfaces/types
import { Locale } from "../types";

// consts/enums
import * as ActionTypes from "./actionTypes";

export const setLocale = (locale: Locale) => ({
    type: ActionTypes.SETLOCALE,
    payload: locale
});
