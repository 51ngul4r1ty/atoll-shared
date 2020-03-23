// test related
import "jest";

// code under test
import { appReducer, initialState } from "../appReducer";
import * as ActionTypes from "../../actions/actionTypes";

describe("App Reducer", () => {
    it("sets the locale", () => {
        const actual = appReducer(initialState, { type: ActionTypes.SET_LOCALE, payload: "de_DE" });
        expect(actual.locale).toEqual("de_DE");
    });
});
