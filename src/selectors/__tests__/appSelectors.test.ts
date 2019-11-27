import "jest";

import { getLocale } from "../appSelectors";
import { initialState } from "../../reducers/appReducer";

const state = {
    app: initialState
};

describe("App Selectors", () => {
    it("gets the locale", () => {
        expect(getLocale(state)).toMatch("en_US");
    });
});
