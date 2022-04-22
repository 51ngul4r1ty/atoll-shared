// test related
import "jest";

// code under test
import * as appSelectors from "../appSelectors";

// interfaces/types
import { appReducerInitialState, AppState } from "../../reducers/app/appReducer";
import { StateTree } from "../../reducers/rootReducer";

// mock related
import * as dateHelper from "../../utils/dateHelper";

const state = {
    app: appReducerInitialState
};

describe("App Selectors", () => {
    describe("getLocale", () => {
        it("gets the locale", () => {
            expect(appSelectors.getLocale(state)).toMatch("en_US");
        });
    });
    describe("getPostLoginReturnRoute", () => {
        it("should not return the route if timeout has expired", () => {
            // arrange
            const state = {
                app: {
                    postLoginReturnRoute: "/return-route"
                } as AppState
            } as StateTree;
            jest.spyOn(dateHelper, "timeoutExpired").mockReturnValue(true);

            // act
            const actual = appSelectors.getPostLoginReturnRoute(state);

            // assert
            expect(actual).toBeNull();
        });
        it("should return the route if timeout has not expired", () => {
            // arrange
            const state = {
                app: {
                    postLoginReturnRoute: "/return-route"
                } as AppState
            } as StateTree;
            jest.spyOn(dateHelper, "timeoutExpired").mockReturnValue(false);

            // act
            const actual = appSelectors.getPostLoginReturnRoute(state);

            // assert
            expect(actual).toBe("/return-route");
        });
    });
});
