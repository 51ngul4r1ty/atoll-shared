// test related
import "jest";

// code under test
import * as validationUtils from "../validationUtils";

describe("Validation Utils", () => {
    describe("isValidStrictEstimate", () => {
        it.each(["1/4", "1/2", "1", "2", "3", "5", "8", "13", "20", "40", "100"])(
            "should accept %s story points as an estimate",
            (estimate: string) => {
                // arrange
                const value = eval(estimate);

                // act
                const actual = validationUtils.isValidStrictEstimate(value);

                // assert
                expect(actual).toBe(true);
            }
        );
        it.each(["4", "7", "12", "99"])("should not accept %s story points as a non-standard estimate", (estimate: string) => {
            // arrange
            const value = eval(estimate);

            // act
            const actual = validationUtils.isValidStrictEstimate(value);

            // assert
            expect(actual).toBe(false);
        });
        it.each(["-1", "101"])(
            "should not accept %s story points as an estimate because they're outside range",
            (estimate: string) => {
                // arrange
                const value = eval(estimate);

                // act
                const actual = validationUtils.isValidStrictEstimate(value);

                // assert
                expect(actual).toBe(false);
            }
        );
        it.each([undefined, null])(
            "should accept %s story points as an estimate because they represent un-estimated story estimates",
            (estimate: string) => {
                // arrange
                const value = estimate;

                // act
                const actual = validationUtils.isValidStrictEstimate(value);

                // assert
                expect(actual).toBe(true);
            }
        );
        it.each(["a", "", "_"])(
            "should not accept '%s' story points as an estimate because they're not numbers",
            (estimate: any) => {
                // arrange
                const value = estimate;

                // act
                const actual = validationUtils.isValidStrictEstimate(value);

                // assert
                expect(actual).toBe(false);
            }
        );
    });
    describe("isValidEstimate", () => {
        it.each(["1/4", "1/2", "1", "2", "3", "5", "8", "13", "20", "40", "100"])(
            "should accept %s story points as an estimate",
            (estimate: string) => {
                // arrange
                const value = eval(estimate);

                // act
                const actual = validationUtils.isValidEstimate(value);

                // assert
                expect(actual).toBe(true);
            }
        );
        it.each(["4", "7", "12", "99"])("should accept %s story points as a non-standard split estimate", (estimate: string) => {
            // arrange
            const value = eval(estimate);

            // act
            const actual = validationUtils.isValidEstimate(value);

            // assert
            expect(actual).toBe(true);
        });
        it.each(["-1", "101"])(
            "should not accept %s story points as an estimate because they're outside range",
            (estimate: string) => {
                // arrange
                const value = eval(estimate);

                // act
                const actual = validationUtils.isValidEstimate(value);

                // assert
                expect(actual).toBe(false);
            }
        );
        it.each([undefined, null])(
            "should accept %s story points as an estimate because they represent un-estimated story estimates",
            (estimate: string) => {
                // arrange
                const value = estimate;

                // act
                const actual = validationUtils.isValidEstimate(value);

                // assert
                expect(actual).toBe(true);
            }
        );
        it.each(["a", "", "_"])(
            "should not accept '%s' story points as an estimate because they're not numbers",
            (estimate: any) => {
                // arrange
                const value = estimate;

                // act
                const actual = validationUtils.isValidEstimate(value);

                // assert
                expect(actual).toBe(false);
            }
        );
    });
    describe("isValidStringEstimate", () => {
        it.each(["", "1/4", "1/2", "1", "2", "3", "5", "8", "13", "20", "40", "100"])(
            "should accept %s story points as an estimate",
            (estimate: string) => {
                // arrange
                const value = !estimate ? estimate : `${eval(estimate)}`;

                // act
                const actual = validationUtils.isValidStringEstimate(value);

                // assert
                expect(actual).toBe(true);
            }
        );
        it.each(["4", "7", "12", "99"])("should accept %s story points as a non-standard split estimate", (estimate: string) => {
            // arrange
            const value = estimate;

            // act
            const actual = validationUtils.isValidStringEstimate(value);

            // assert
            expect(actual).toBe(true);
        });
        it.each([null, undefined])("should accept %s story points as an estimate", (estimate: string) => {
            // arrange
            const value = estimate;

            // act
            const actual = validationUtils.isValidStringEstimate(value);

            // assert
            expect(actual).toBe(true);
        });
        it.each(["-1", "101", "a", "_"])("should not accept %s story points as an estimate", (estimate: string) => {
            // arrange
            const value = estimate;

            // act
            const actual = validationUtils.isValidStringEstimate(value);

            // assert
            expect(actual).toBe(false);
        });
    });
    describe("isValidStrictStringEstimate", () => {
        it.each(["", "1/4", "1/2", "1", "2", "3", "5", "8", "13", "20", "40", "100"])(
            "should accept %s story points as an estimate",
            (estimate: string) => {
                // arrange
                const value = !estimate ? estimate : `${eval(estimate)}`;

                // act
                const actual = validationUtils.isValidStrictStringEstimate(value);

                // assert
                expect(actual).toBe(true);
            }
        );
        it.each(["4", "7", "12", "99"])("should not accept %s story points as a non-standard estimate", (estimate: string) => {
            // arrange
            const value = estimate;

            // act
            const actual = validationUtils.isValidStrictStringEstimate(value);

            // assert
            expect(actual).toBe(false);
        });
        it.each([null, undefined])("should accept %s story points as an estimate", (estimate: string) => {
            // arrange
            const value = estimate;

            // act
            const actual = validationUtils.isValidStrictStringEstimate(value);

            // assert
            expect(actual).toBe(true);
        });
        it.each(["-1", "101", "a", "_"])("should not accept %s story points as an estimate", (estimate: string) => {
            // arrange
            const value = estimate;

            // act
            const actual = validationUtils.isValidStrictStringEstimate(value);

            // assert
            expect(actual).toBe(false);
        });
    });
});
