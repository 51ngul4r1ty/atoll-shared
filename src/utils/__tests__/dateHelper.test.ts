// test related
import "jest";

// code under test
import { addHours, addMinutes, addSeconds } from "../dateHelper";

describe("Date Helper", () => {
    describe("addHours", () => {
        it("should correctly add 5 1/2 hours to the date", () => {
            const startDate = new Date(Date.UTC(2005, 9, 14, 5, 13, 59, 900));
            const result = addHours(startDate, 5.5);
            expect(startDate.toISOString()).toEqual("2005-10-14T05:13:59.900Z");
            expect(result.toISOString()).toEqual("2005-10-14T10:43:59.900Z");
        });
    });
    describe("addMinutes", () => {
        it("should correctly add 5 1/2 mins to the date", () => {
            const startDate = new Date(Date.UTC(2005, 9, 14, 5, 13, 59, 900));
            const result = addMinutes(startDate, 5.5);
            expect(startDate.toISOString()).toEqual("2005-10-14T05:13:59.900Z");
            expect(result.toISOString()).toEqual("2005-10-14T05:19:29.900Z");
        });
    });
    describe("addSeconds", () => {
        it("should correctly add 5 1/2 seconds to the date", () => {
            const startDate = new Date(Date.UTC(2005, 9, 14, 5, 13, 59, 900));
            const result = addSeconds(startDate, 5.5);
            expect(startDate.toISOString()).toEqual("2005-10-14T05:13:59.900Z");
            expect(result.toISOString()).toEqual("2005-10-14T05:14:05.400Z");
        });
    });
});
