import "jest";

import reducer, { initialState } from "../appReducer";
import * as ActionTypes from "../../actions/actionTypes";

describe("App Reducer", () => {
    it("sets the locale", () => {
        expect(reducer(initialState, { type: ActionTypes.SETLOCALE, payload: "de_DE" })).toEqual({
            locale: "de_DE"
        });
    });
});
