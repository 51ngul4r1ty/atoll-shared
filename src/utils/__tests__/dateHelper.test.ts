// test related
import "jest";

// code under test
import { addHours, addMinutes, addSeconds, roundDateToDayBoundary } from "../dateHelper";

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
    describe("roundDateToDayBoundary", () => {
        it("should return the correct date", () => {
            const date = new Date(2020, 11, 8); // December 8th, 2020
            const actual = roundDateToDayBoundary(date);
            expect(actual.getFullYear()).toEqual(2020);
            expect(actual.getMonth()).toEqual(11);
            expect(actual.getDate()).toEqual(8);
        });
        it("should handle daylight savings adjustment (negative)", () => {
            const date = new Date(2020, 11, 8, 23, 35); // December 8th, 2020 - 11:35pm
            const actual = roundDateToDayBoundary(date);
            expect(actual.getFullYear()).toEqual(2020);
            expect(actual.getMonth()).toEqual(11);
            expect(actual.getDate()).toEqual(9); // must "round" to next day
        });
        it("should handle daylight savings adjustment (positive)", () => {
            const date = new Date(2020, 11, 7, 0, 25); // December 7th, 2020 - 12:25am
            const actual = roundDateToDayBoundary(date);
            expect(actual.getFullYear()).toEqual(2020);
            expect(actual.getMonth()).toEqual(11);
            expect(actual.getDate()).toEqual(7); // must "round" to current day
        });
    });
});
