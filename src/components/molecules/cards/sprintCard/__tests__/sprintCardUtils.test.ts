// test related
import "jest";
import { DateOnly } from "../../../../../types/dateTypes";

// code under test
import { formatDateRange } from "../sprintCardUtils";

describe("sprintCardUtils", () => {
    describe("formatDateRange", () => {
        it("should handle a date range that span months", () => {
            const result = formatDateRange(new DateOnly(2021, 1, 20), new DateOnly(2021, 2, 2));
            expect(result).toBe("Jan 20 to Feb 2, 2021");
        });
        it("should handle a date range that span months", () => {
            const result = formatDateRange(new DateOnly(2021, 1, 6), new DateOnly(2021, 1, 19));
            expect(result).toBe("Jan 6 to 19, 2021");
        });
    });
});
