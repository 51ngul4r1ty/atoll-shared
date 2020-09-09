// test related
import "jest";

// externals
import produce, { Draft } from "immer";

// code under test
import {
    backlogItemsReducerInitialState,
    rebuildAllItems,
    BacklogItemSource,
    BacklogItemWithSource,
    EditableBacklogItem,
    SaveableBacklogItem
} from "../backlogItemsReducer";

// interfaces/types
import { PushOperationType, WebsocketPushNotificationData } from "../../types";
import { PushBacklogItemModel } from "../../middleware/wsMiddleware";
import { isNullOrUndefined } from "util";

describe("Backlog Items Reducer", () => {
    describe("rebuildAllItems", () => {
        it("should update correctly", () => {
            const addedItem: SaveableBacklogItem = {
                type: "issue",
                instanceId: 1,
                saved: false,
                createdAt: undefined,
                updatedAt: undefined,
                estimate: undefined,
                externalId: undefined,
                reasonPhrase: undefined,
                rolePhrase: undefined,
                storyPhrase: undefined,
                id: undefined
            };
            const addedItem1InAllItems: BacklogItemWithSource = {
                ...addedItem,
                source: BacklogItemSource.Added
            };
            const item: BacklogItemWithSource = {
                id: "20650986d6b84db79b2a9fa8239016ad",
                externalId: "t-1",
                rolePhrase: null,
                storyPhrase: "test",
                reasonPhrase: null,
                estimate: null,
                type: "story",
                createdAt: new Date("2020-05-16T17:49:30.265Z"),
                updatedAt: new Date("2020-05-16T17:49:30.265Z"),
                saved: true,
                source: BacklogItemSource.Loaded
            };
            const pushedItem1: WebsocketPushNotificationData<PushBacklogItemModel> = {
                item: {
                    version: 0,
                    externalId: "t-2",
                    storyPhrase: "test 2",
                    type: "story",
                    id: "3ba659af17e344aebd02a23b394964b3",
                    updatedAt: new Date("2020-06-02T01:15:54.715Z"),
                    createdAt: new Date("2020-06-02T01:15:54.715Z"),
                    rolePhrase: null,
                    reasonPhrase: null,
                    estimate: null,
                    prevBacklogItemId: null,
                    nextBacklogItemId: "20650986d6b84db79b2a9fa8239016ad"
                },
                operation: PushOperationType.Added
            };
            const pushedItem1InAllItems: BacklogItemWithSource = {
                externalId: "t-2",
                storyPhrase: "test 2",
                type: "story",
                id: "3ba659af17e344aebd02a23b394964b3",
                instanceId: undefined,
                createdAt: new Date("2020-06-02T01:15:54.715Z"),
                updatedAt: new Date("2020-06-02T01:15:54.715Z"),
                rolePhrase: null,
                reasonPhrase: null,
                estimate: null,
                source: BacklogItemSource.Pushed
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
});
