// test related
import "jest";

// code under test
import { backlogItemsReducer } from "../backlogItems/backlogItemsReducer";

// actions
import { selectProductBacklogItem, unselectProductBacklogItem } from "../../actions/backlogItemActions";

describe("Backlog Items Reducer", () => {
    describe("action SELECT_PRODUCT_BACKLOG_ITEM", () => {
        it("should handle empty array correctly", () => {
            const itemId = "item1";
            const result = backlogItemsReducer(undefined, selectProductBacklogItem(itemId));
            expect(result.selectedItemIds).toHaveLength(1);
            expect(result.selectedItemIds[0]).toEqual("item1");
        });
        it("should handle duplicate item add correctly", () => {
            const itemId = "item1";
            const state = backlogItemsReducer(undefined, selectProductBacklogItem(itemId));
            const result = backlogItemsReducer(state, selectProductBacklogItem(itemId));
            expect(result.selectedItemIds).toHaveLength(1);
            expect(result.selectedItemIds[0]).toEqual("item1");
        });
    });
    describe("action UNSELECT_PRODUCT_BACKLOG_ITEM", () => {
        it("should handle empty array correctly", () => {
            const itemId = "item1";
            backlogItemsReducer(undefined, selectProductBacklogItem(itemId));
            const result = backlogItemsReducer(undefined, unselectProductBacklogItem(itemId));
            expect(result.selectedItemIds).toHaveLength(0);
        });
    });
});
