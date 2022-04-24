// test related
import "jest";

// externals
import produce from "immer";

// code under test
import { rebuildAllItems } from "../backlogItems/backlogItemsReducerHelper";

// interfaces/types
import type { BacklogItemWithSource, SaveableBacklogItem } from "../backlogItems/backlogItemsReducerTypes";
import type { PushBacklogItemModel } from "../../middleware/wsMiddleware";
import type { WebsocketPushNotificationData } from "../../types/pushTypes";

// consts/enums
import { backlogItemsReducerInitialState } from "../backlogItems/backlogItemsReducer";
import { BacklogItemStatus } from "../../types/backlogItemEnums";
import { PushOperationType } from "../../types/pushEnums";
import { Source } from "../enums";

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
                status: undefined,
                startedAt: undefined,
                finishedAt: undefined,
                acceptedAt: undefined,
                releasedAt: undefined,
                partIndex: undefined,
                storyEstimate: undefined,
                totalParts: undefined,
                unallocatedParts: undefined,
                unallocatedPoints: undefined,
                saving: false
            };
            const addedItem1InAllItems: BacklogItemWithSource = {
                ...addedItem,
                source: Source.Added
            };
            const item: BacklogItemWithSource = {
                acceptanceCriteria: "",
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
                status: BacklogItemStatus.NotStarted,
                startedAt: undefined,
                finishedAt: undefined,
                acceptedAt: undefined,
                releasedAt: undefined,
                partIndex: undefined,
                storyEstimate: undefined,
                totalParts: undefined,
                unallocatedParts: undefined,
                unallocatedPoints: undefined,
                saving: false
            };
            const pushedItem1: WebsocketPushNotificationData<PushBacklogItemModel> = {
                item: {
                    acceptanceCriteria: "",
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
                    status: BacklogItemStatus.NotStarted,
                    startedAt: undefined,
                    finishedAt: undefined,
                    acceptedAt: undefined,
                    releasedAt: undefined,
                    partIndex: undefined,
                    storyEstimate: undefined,
                    totalParts: undefined,
                    unallocatedParts: undefined,
                    unallocatedPoints: undefined
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
                status: BacklogItemStatus.NotStarted,
                startedAt: undefined,
                finishedAt: undefined,
                acceptedAt: undefined,
                releasedAt: undefined,
                partIndex: undefined,
                storyEstimate: undefined,
                totalParts: undefined,
                unallocatedParts: undefined,
                unallocatedPoints: undefined,
                saving: false
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
