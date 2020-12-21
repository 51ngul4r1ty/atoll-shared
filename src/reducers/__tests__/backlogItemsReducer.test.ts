// test related
import "jest";

// externals
import produce from "immer";

// code under test
import { rebuildAllItems } from "../backlogItems/backlogItemsReducerHelper";
import { backlogItemsReducerInitialState } from "../backlogItems/backlogItemsReducer";
import { BacklogItemWithSource, SaveableBacklogItem } from "../backlogItems/backlogItemsReducerTypes";

// interfaces/types
import { PushOperationType, WebsocketPushNotificationData } from "../../types";
import { PushBacklogItemModel } from "../../middleware/wsMiddleware";
import { backlogItemsReducer } from "../backlogItems/backlogItemsReducer";
import { Source } from "../types";

// consts/enums
import { selectProductBacklogItem, unselectProductBacklogItem } from "../../actions/backlogItemActions";
import { BacklogItemStatus } from "../../types/backlogItemTypes";

describe("Backlog Items Reducer", () => {
    describe("rebuildAllItems", () => {
        it("should update correctly", () => {
            const addedItem: SaveableBacklogItem = {
                acceptanceCriteria: undefined,
                createdAt: undefined,
                estimate: undefined,
                externalId: undefined,
                friendlyId: undefined,
                id: undefined,
                instanceId: 1,
                projectId: undefined,
                reasonPhrase: undefined,
                rolePhrase: undefined,
                saved: false,
                storyPhrase: undefined,
                type: "issue",
                updatedAt: undefined,
                status: undefined
            };
            const addedItem1InAllItems: BacklogItemWithSource = {
                ...addedItem,
                source: Source.Added
            };
            const item: BacklogItemWithSource = {
                createdAt: new Date("2020-05-16T17:49:30.265Z"),
                estimate: null,
                externalId: "t-1",
                friendlyId: "1",
                id: "20650986d6b84db79b2a9fa8239016ad",
                projectId: null,
                reasonPhrase: null,
                rolePhrase: null,
                saved: true,
                source: Source.Loaded,
                storyPhrase: "test",
                type: "story",
                updatedAt: new Date("2020-05-16T17:49:30.265Z"),
                status: BacklogItemStatus.NotStarted
            };
            const pushedItem1: WebsocketPushNotificationData<PushBacklogItemModel> = {
                item: {
                    createdAt: new Date("2020-06-02T01:15:54.715Z"),
                    estimate: null,
                    externalId: "t-2",
                    friendlyId: "2",
                    id: "3ba659af17e344aebd02a23b394964b3",
                    nextBacklogItemId: "20650986d6b84db79b2a9fa8239016ad",
                    prevBacklogItemId: null,
                    projectId: null,
                    reasonPhrase: null,
                    rolePhrase: null,
                    storyPhrase: "test 2",
                    type: "story",
                    updatedAt: new Date("2020-06-02T01:15:54.715Z"),
                    version: 0,
                    status: BacklogItemStatus.NotStarted
                },
                operation: PushOperationType.Added
            };
            const pushedItem1InAllItems: BacklogItemWithSource = {
                acceptanceCriteria: "",
                createdAt: new Date("2020-06-02T01:15:54.715Z"),
                estimate: null,
                externalId: "t-2",
                friendlyId: "2",
                id: "3ba659af17e344aebd02a23b394964b3",
                instanceId: undefined,
                projectId: null,
                reasonPhrase: null,
                rolePhrase: null,
                source: Source.Pushed,
                storyPhrase: "test 2",
                type: "story",
                updatedAt: new Date("2020-06-02T01:15:54.715Z"),
                status: BacklogItemStatus.NotStarted
            };
            produce(
                { ...backlogItemsReducerInitialState, addedItems: [addedItem], items: [item], pushedItems: [pushedItem1] },
                (draft) => {
                    rebuildAllItems(draft);
                    expect(draft.addedItems).toEqual([addedItem]);
                    expect(draft.allItems).toEqual([addedItem1InAllItems, pushedItem1InAllItems, item]);
                    expect(draft.items).toEqual([item]);
                    expect(draft.openedDetailMenuBacklogItemId).toEqual(null);
                    expect(draft.pushedItems).toEqual([pushedItem1]);
                }
            );
        });
    });
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
