// test related
import "jest";
import { DateOnly } from "../../../../../types/dateTypes";

// code under test
import { formatDateRange } from "../sprintCardUtils";

describe("sprintCardUtils", () => {
    describe("formatDateRange", () => {
        it("should handle a date range that spans months", () => {
            const result = formatDateRange(new DateOnly(2021, 1, 20), new DateOnly(2021, 2, 2));
            expect(result).toBe("Jan 20 to Feb 2, 2021");
        });
        it("should handle a date range in the same month", () => {
            const result = formatDateRange(new DateOnly(2021, 1, 6), new DateOnly(2021, 1, 19));
            expect(result).toBe("Jan 6 to 19, 2021");
        });
        it("should handle a date range that spans years", () => {
            const result = formatDateRange(new DateOnly(2020, 12, 23), new DateOnly(2021, 1, 5));
            expect(result).toBe("Dec 23, 2020 to Jan 5, 2021");
        });
    });
});
