// test related
import "jest";

// code under test
import { removeAvailableItem } from "../availableItemsUtils";

describe("Available Items Utils", () => {
    describe("removeAvailableItem", () => {
        it("should throw an error when trying to remove an item from an empty lists", () => {
            let availableItems = [];
            let item = {
                id: "NOT-IN-AN-EMPTY-LIST-NOT-POSSIBLE!",
                projectId: "",
                backlogItemId: "",
                nextBacklogItemId: "",
                createdAt: undefined,
                updatedAt: undefined,
                version: undefined
            };
            expect(() => removeAvailableItem(availableItems, item)).toThrowError(
                "Unable to remove item - NOT-IN-AN-EMPTY-LIST-NOT-POSSIBLE!"
            );
        });
        it("should remove single item from list", () => {
            let availableItems = [
                {
                    id: "ONLY-ITEM-IN-LIST",
                    projectId: "",
                    backlogItemId: "",
                    nextBacklogItemId: "",
                    createdAt: undefined,
                    updatedAt: undefined,
                    version: undefined,
                    linkCount: undefined
                }
            ];
            let item = {
                id: "ONLY-ITEM-IN-LIST",
                projectId: "",
                backlogItemId: "",
                nextBacklogItemId: "",
                createdAt: undefined,
                updatedAt: undefined,
                version: undefined
            };
            removeAvailableItem(availableItems, item);
            expect(availableItems).toHaveLength(0);
        });
        it("should remove last item from list", () => {
            let availableItems = [
                {
                    id: "ITEM-1",
                    projectId: "",
                    backlogItemId: "",
                    nextBacklogItemId: "",
                    createdAt: undefined,
                    updatedAt: undefined,
                    version: undefined,
                    linkCount: undefined
                },
                {
                    id: "ITEM-2",
                    projectId: "",
                    backlogItemId: "",
                    nextBacklogItemId: "",
                    createdAt: undefined,
                    updatedAt: undefined,
                    version: undefined,
                    linkCount: undefined
                }
            ];
            let item = {
                id: "ITEM-2",
                projectId: "",
                backlogItemId: "",
                nextBacklogItemId: "",
                createdAt: undefined,
                updatedAt: undefined,
                version: undefined
            };
            removeAvailableItem(availableItems, item);
            expect(availableItems).toHaveLength(1);
            expect(availableItems[0].id).toEqual("ITEM-1");
        });
        it("should remove first item from list", () => {
            let availableItems = [
                {
                    id: "ITEM-1",
                    projectId: "",
                    backlogItemId: "",
                    nextBacklogItemId: "",
                    createdAt: undefined,
                    updatedAt: undefined,
                    version: undefined,
                    linkCount: undefined
                },
                {
                    id: "ITEM-2",
                    projectId: "",
                    backlogItemId: "",
                    nextBacklogItemId: "",
                    createdAt: undefined,
                    updatedAt: undefined,
                    version: undefined,
                    linkCount: undefined
                }
            ];
            let item = {
                id: "ITEM-1",
                projectId: "",
                backlogItemId: "",
                nextBacklogItemId: "",
                createdAt: undefined,
                updatedAt: undefined,
                version: undefined
            };
            removeAvailableItem(availableItems, item);
            expect(availableItems).toHaveLength(1);
            expect(availableItems[0].id).toEqual("ITEM-2");
        });
    });
});
