// test related
import "jest";

// utils
import { timeNow } from "../../utils/dateHelper";

// code under test
import { DateOnly } from "../dateTypes";

describe("DateOnly", () => {
    describe("constructor", () => {
        it("gets the current date when using constructor without args", () => {
            const now = timeNow();
            const actual = new DateOnly();
            expect(actual.getYear()).toEqual(now.getFullYear());
            expect(actual.getMonth()).toEqual(now.getMonth() + 1);
            expect(actual.getDay()).toEqual(now.getDate());
        });
        it("gets the specified date when using constructor with args", () => {
            const actual = new DateOnly(2017, 9, 5);
            expect(actual.getYear()).toEqual(2017);
            expect(actual.getMonth()).toEqual(9);
            expect(actual.getDay()).toEqual(5);
        });
        it("throws an error when passing in too many args to constructor", () => {
            const t = () => {
                const actual = new DateOnly(2017, 9, 5, 7);
            };
            expect(t).toThrow(Error);
        });
        it("throws an error when passing in too few args to constructor", () => {
            const t = () => {
                const actual = new DateOnly(2017, 9);
            };
            expect(t).toThrow(Error);
        });
    });
    describe("fromISODate", () => {
        it("converts correctly from an ISO date string", () => {
            const actual = DateOnly.fromISODate("2020-10-15");
            expect(actual.getYear()).toEqual(2020);
            expect(actual.getMonth()).toEqual(10);
            expect(actual.getDay()).toEqual(15);
        });
        it("converts correctly from an ISO date string null", () => {
            const actual = DateOnly.fromISODate(null);
            expect(actual).toBeNull();
        });
        it("throws an error when passing in an ISO date string with time part", () => {
            const t = () => {
                const actual = DateOnly.fromISODate("2011-10-05T14:48:00.000Z");
            };
            expect(t).toThrow(Error);
        });
        it("throws an error when an invalid date value is in the string", () => {
            const t = () => {
                const actual = DateOnly.fromISODate("2011-10");
            };
            expect(t).toThrow(Error);
        });
    });
    describe("fromDate", () => {
        it("converts correctly from a date at end of day (stripping time part)", () => {
            const actual = DateOnly.fromDate(new Date(2019, 11, 5, 11, 59, 30));
            expect(actual.getYear()).toEqual(2019);
            expect(actual.getMonth()).toEqual(12);
            expect(actual.getDay()).toEqual(5);
        });
        it("converts correctly from a date at beginning of day (stripping time part)", () => {
            const actual = DateOnly.fromDate(new Date(2019, 11, 6, 0, 1, 30));
            expect(actual.getYear()).toEqual(2019);
            expect(actual.getMonth()).toEqual(12);
            expect(actual.getDay()).toEqual(6);
        });
    });
    describe("fromString", () => {
        it("converts correctly from a string without time", () => {
            const actual = DateOnly.fromString("12/5/2019");
            expect(actual.getYear()).toEqual(2019);
            expect(actual.getMonth()).toEqual(12);
            expect(actual.getDay()).toEqual(5);
        });
        it("converts correctly from a null value", () => {
            const actual = DateOnly.fromString(null);
            expect(actual).toBeNull();
        });
    });
});
