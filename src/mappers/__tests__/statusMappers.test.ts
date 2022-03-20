// test related
import "jest";

// consts/enums
import { BacklogItemStatus } from "../../types/backlogItemEnums";

// code under test
import * as statusMappers from "../statusMappers";

describe("Status Mappers", () => {
    describe("mapBacklogItemStatusToApi", () => {
        it("should map NotStarted status to N", () => {
            // arrange
            const status = BacklogItemStatus.NotStarted;

            // act
            const actual = statusMappers.mapBacklogItemStatusToApi(status);

            // assert
            expect(actual).toBe("N");
        });
        it("should map InProgress status to P", () => {
            // arrange
            const status = BacklogItemStatus.InProgress;

            // act
            const actual = statusMappers.mapBacklogItemStatusToApi(status);

            // assert
            expect(actual).toBe("P");
        });
        it("should map InProgress status to D", () => {
            // arrange
            const status = BacklogItemStatus.Done;

            // act
            const actual = statusMappers.mapBacklogItemStatusToApi(status);

            // assert
            expect(actual).toBe("D");
        });
        it("should map Accepted status to A", () => {
            // arrange
            const status = BacklogItemStatus.Accepted;

            // act
            const actual = statusMappers.mapBacklogItemStatusToApi(status);

            // assert
            expect(actual).toBe("A");
        });
        it("should map InProgress status to R", () => {
            // arrange
            const status = BacklogItemStatus.Released;

            // act
            const actual = statusMappers.mapBacklogItemStatusToApi(status);

            // assert
            expect(actual).toBe("R");
        });
        it("should preserve null value because null and undefined are used for different purposes", () => {
            // arrange
            const status = null;

            // act
            const actual = statusMappers.mapBacklogItemStatusToApi(status);

            // assert
            expect(actual).toBeNull();
        });
        it("should preserve undefined value because null and undefined are used for different purposes", () => {
            // arrange
            const status = undefined;

            // act
            const actual = statusMappers.mapBacklogItemStatusToApi(status);

            // assert
            expect(actual).toBeUndefined();
        });
    });
});
