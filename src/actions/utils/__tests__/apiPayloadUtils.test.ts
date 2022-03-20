// test related
import "jest";

// code under test
import * as apiPayloadUtils from "../apiPayloadUtils";

describe("API Payload Utils", () => {
    describe("stripUndefinedForPatch", () => {
        it("should strip all undefined fields", () => {
            // arrange
            const id = "fake-id";
            const obj = {
                a: "",
                b: {
                    c: undefined
                },
                d: {
                    e: {
                        defined: true
                    }
                },
                f: "a value",
                g: 123.45
            };

            // act
            const actual = apiPayloadUtils.stripUndefinedForPatch(obj, id);

            // assert
            expect(actual).toStrictEqual({
                id: "fake-id",
                a: "",
                d: {
                    e: {
                        defined: true
                    }
                },
                f: "a value",
                g: 123.45
            });
        });
    });
});
