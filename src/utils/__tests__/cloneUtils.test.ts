// test related
import "jest";

// code under test
import { cloneWithoutNested } from "../cloneUtils";
import { DateOnly } from "../../types/dateTypes";

describe("Clone Utils", () => {
    describe("cloneWithoutNested", () => {
        it("should clone undefined", () => {
            // act
            const actual = cloneWithoutNested(undefined);

            // assert
            expect(actual).toBeUndefined();
        });
        it("should clone null", () => {
            // act
            const actual = cloneWithoutNested(null);

            // assert
            expect(actual).toBeNull();
        });
        it("should clone ''", () => {
            // act
            const actual = cloneWithoutNested("");

            // assert
            expect(actual).toEqual("");
        });
        it("should clone a non-empty string", () => {
            // act
            const actual = cloneWithoutNested("abc");

            // assert
            expect(actual).toEqual("abc");
        });
        it("should clone a number", () => {
            // act
            const actual = cloneWithoutNested(123.45);

            // assert
            expect(actual).toEqual(123.45);
        });
        it("should clone an object", () => {
            // act
            const actual = cloneWithoutNested({ a: true, b: false, c: 123.45, d: "string" });

            // assert
            expect(actual).toStrictEqual({ a: true, b: false, c: 123.45, d: "string" });
        });
        it("should clone an object with null and undefined fields", () => {
            // act
            const actual = cloneWithoutNested({ a: undefined, b: null });

            // assert
            expect(actual).toStrictEqual({ a: undefined, b: null });
        });
        it("should clone an object Date fields", () => {
            // act
            const actual = cloneWithoutNested({ a: new Date(2021, 4, 24) });

            // assert
            expect(actual).toStrictEqual({ a: new Date(2021, 4, 24) });
        });
        it("should clone an object DateOnly fields", () => {
            // act
            const actual = cloneWithoutNested({ a: new DateOnly(2021, 4, 24) });

            // assert
            expect(actual).toStrictEqual({ a: new DateOnly(2021, 4, 24) });
        });
        it("should clone an object without nested objects", () => {
            // act
            const actual = cloneWithoutNested({ a: { x: true }, b: false, c: { v: 123.45 }, d: "string" });

            // assert
            expect(actual).toStrictEqual({ b: false, d: "string" });
        });
    });
});
