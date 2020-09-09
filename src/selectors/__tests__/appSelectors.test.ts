// test related
import "jest";

// code under test
import { getLocale } from "../appSelectors";
import { appReducerInitialState } from "../../reducers/appReducer";

const state = {
    app: appReducerInitialState
};

describe("App Selectors", () => {
    it("gets the locale", () => {
        expect(getLocale(state)).toMatch("en_US");
    });
});
