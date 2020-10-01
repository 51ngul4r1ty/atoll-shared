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
                friendlyId: undefined,
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
                createdAt: new Date("2020-05-16T17:49:30.265Z"),
                estimate: null,
                externalId: "t-1",
                friendlyId: "1",
                id: "20650986d6b84db79b2a9fa8239016ad",
                projectId: null,
                reasonPhrase: null,
                rolePhrase: null,
                saved: true,
                source: BacklogItemSource.Loaded,
                storyPhrase: "test",
                type: "story",
                updatedAt: new Date("2020-05-16T17:49:30.265Z")
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
                    version: 0
                },
                operation: PushOperationType.Added
            };
            const pushedItem1InAllItems: BacklogItemWithSource = {
                createdAt: new Date("2020-06-02T01:15:54.715Z"),
                estimate: null,
                externalId: "t-2",
                friendlyId: "2",
                id: "3ba659af17e344aebd02a23b394964b3",
                instanceId: undefined,
                projectId: null,
                reasonPhrase: null,
                rolePhrase: null,
                source: BacklogItemSource.Pushed,
                storyPhrase: "test 2",
                type: "story",
                updatedAt: new Date("2020-06-02T01:15:54.715Z")
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
