// test related
import "jest";

// code under test
import * as dateHelper from "../dateHelper";

describe("Date Helper", () => {
    describe("addHours", () => {
        it("should correctly add 5 1/2 hours to the date", () => {
            const startDate = new Date(Date.UTC(2005, 9, 14, 5, 13, 59, 900));
            const result = dateHelper.addHours(startDate, 5.5);
            expect(startDate.toISOString()).toEqual("2005-10-14T05:13:59.900Z");
            expect(result.toISOString()).toEqual("2005-10-14T10:43:59.900Z");
        });
    });
    describe("addMinutes", () => {
        it("should correctly add 5 1/2 mins to the date", () => {
            const startDate = new Date(Date.UTC(2005, 9, 14, 5, 13, 59, 900));
            const result = dateHelper.addMinutes(startDate, 5.5);
            expect(startDate.toISOString()).toEqual("2005-10-14T05:13:59.900Z");
            expect(result.toISOString()).toEqual("2005-10-14T05:19:29.900Z");
        });
    });
    describe("addSeconds", () => {
        it("should correctly add 5 1/2 seconds to the date", () => {
            const startDate = new Date(Date.UTC(2005, 9, 14, 5, 13, 59, 900));
            const result = dateHelper.addSeconds(startDate, 5.5);
            expect(startDate.toISOString()).toEqual("2005-10-14T05:13:59.900Z");
            expect(result.toISOString()).toEqual("2005-10-14T05:14:05.400Z");
        });
    });
    describe("roundDateToDayBoundary", () => {
        it("should return the correct date", () => {
            const date = new Date(2020, 11, 8); // December 8th, 2020
            const actual = dateHelper.roundDateToDayBoundary(date);
            expect(actual.getFullYear()).toEqual(2020);
            expect(actual.getMonth()).toEqual(11);
            expect(actual.getDate()).toEqual(8);
        });
        it("should handle daylight savings adjustment (negative)", () => {
            const date = new Date(2020, 11, 8, 23, 35); // December 8th, 2020 - 11:35pm
            const actual = dateHelper.roundDateToDayBoundary(date);
            expect(actual.getFullYear()).toEqual(2020);
            expect(actual.getMonth()).toEqual(11);
            expect(actual.getDate()).toEqual(9); // must "round" to next day
        });
        it("should handle daylight savings adjustment (positive)", () => {
            const date = new Date(2020, 11, 7, 0, 25); // December 7th, 2020 - 12:25am
            const actual = dateHelper.roundDateToDayBoundary(date);
            expect(actual.getFullYear()).toEqual(2020);
            expect(actual.getMonth()).toEqual(11);
            expect(actual.getDate()).toEqual(7); // must "round" to current day
        });
    });
    describe("stringToDate", () => {
        it("should parse valid date correctly", () => {
            const actual = dateHelper.stringToDate("5/3/2020");
            expect(actual.getFullYear()).toEqual(2020);
            expect(actual.getMonth()).toEqual(4);
            expect(actual.getDate()).toEqual(3);
        });
        it("should return null for invalid date", () => {
            const actual = dateHelper.stringToDate("1/5/3/2020");
            expect(actual).toBeNull();
        });
    });
    describe("isValidDate", () => {
        it("should return true for a valid date", () => {
            const actual = dateHelper.isValidDate("5/3/2020");
            expect(actual).toBeTruthy();
        });
        it("should return null for invalid date", () => {
            const actual = dateHelper.isValidDate("1/5/3/2020");
            expect(actual).toBeFalsy();
        });
    });
    describe("timeoutExpired", () => {
        it("should return that timeout has not expired when less than 2 minutes has passed", () => {
            // arrange
            const time1 = new Date("5/3/2020 11:54:20.000");
            const time2 = new Date("5/3/2020 11:56:15.000");
            jest.spyOn(dateHelper, "timeNow").mockReturnValueOnce(time2);

            // act
            const actual = dateHelper.timeoutExpired(time1, 120);

            // assert
            expect(actual).toBe(false);
        });
        it("should return that timeout has expired when more than 2 minutes has passed", () => {
            // arrange
            const time1 = new Date("5/3/2020 11:53:20.000");
            const time2 = new Date("5/3/2020 11:56:15.000");
            jest.spyOn(dateHelper, "timeNow").mockReturnValueOnce(time2);

            // act
            const actual = dateHelper.timeoutExpired(time1, 120);

            // assert
            expect(actual).toBe(true);
        });
        it("should return that timeout has expired when time provided is undefined", () => {
            // arrange
            const time1 = undefined;
            const time2 = new Date("5/3/2020 11:56:15.000");
            jest.spyOn(dateHelper, "timeNow").mockReturnValueOnce(time2);

            // act
            const actual = dateHelper.timeoutExpired(time1, 120);

            // assert
            expect(actual).toBe(true);
        });
    });
});
