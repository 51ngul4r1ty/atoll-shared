// test related
import "jest";

// code under test
import * as routeUtils from "../routeUtils";

// consts/enums
import { BACKLOGITEM_VIEW_ROUTE } from "../../constants/routes";

describe("Route Utils", () => {
    describe("routeMatches", () => {
        it("should return true for an exact match", () => {
            // arrange
            const currentRoute = "/";
            const route = "/";

            // act
            const actual = routeUtils.routeMatches(currentRoute, route);

            // assert
            expect(actual).toBe(true);
        });
        it("should return false for an obvious mismatch", () => {
            // arrange
            const currentRoute = "/abc";
            const route = "/def";

            // act
            const actual = routeUtils.routeMatches(currentRoute, route);

            // assert
            expect(actual).toBe(false);
        });
        it("should return true for matching template", () => {
            // arrange
            const currentRoute = "/project/atoll/backlog-item/s-137";
            const route = "/project/:projectDisplayId/backlog-item/:backlogItemDisplayId";

            // act
            const actual = routeUtils.routeMatches(currentRoute, route);

            // assert
            expect(actual).toBe(true);
        });
    });
    describe("mapToRouteTemplate", () => {
        // arrange
        const currentRoute = "/project/atoll/backlog-item/s-137";

        // act
        const actual = routeUtils.mapToRouteTemplate(currentRoute);

        // assert
        expect(actual).toBe(BACKLOGITEM_VIEW_ROUTE);
    });
});
