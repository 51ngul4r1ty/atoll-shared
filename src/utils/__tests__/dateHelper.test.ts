// test related
import "jest";

// code under test
import { addHours } from "../dateHelper";

describe("Date Helper", () => {
    describe("addHours", () => {
        it("should correctly add 5 1/2 hours to the date", () => {
            const startDate = new Date(2005, 9, 14, 5, 13, 59, 900);
            const result = addHours(startDate, 5.5);
            expect(startDate.toISOString()).toEqual("2005-10-14T09:13:59.900Z");
            expect(result.toISOString()).toEqual("2005-10-14T14:43:59.900Z");
        });
    });
});
