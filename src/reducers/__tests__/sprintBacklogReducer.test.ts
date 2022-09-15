// test related
import "jest";

// consts/enums
import * as ActionTypes from "../../actions/actionTypes";
import {
    ITEM_DETAIL_CLICK_STEP_1_NAME,
    ITEM_DETAIL_CLICK_STEP_2_NAME,
    ITEM_DETAIL_CLICK_STEP_3_NAME
} from "../../actionFlows/itemDetailMenuActionFlowConsts";
import { BacklogItemStatus } from "../../types/backlogItemEnums";
import { PushState } from "../enums";

// interfaces/types
import type { BacklogItemInSprint } from "../../types/backlogItemTypes";
import type { ShowSprintBacklogItemDetailAction } from "../../actions/sprintBacklogActions";

// code under test
import { sprintBacklogReducer, SprintBacklogSprintInfo, SprintBacklogState } from "../sprintBacklog/sprintBacklogReducer";

describe("Sprint Backlog Reducer", () => {
    describe("API_GET_SPRINT_FAILURE", () => {
        it("should not close backlog item detail menu when a sprint API call is unrelated to the menu display flow", () => {
            // arrange
            const state = { openingDetailMenuBacklogItemId: "12345" } as SprintBacklogState;
            const action = {
                type: ActionTypes.API_GET_SPRINT_FAILURE
            };

            // act
            const actual = sprintBacklogReducer(state, action);

            // assert
            expect(actual.openingDetailMenuBacklogItemId).not.toBe(null);
            expect(actual.openingDetailMenuSprintId).not.toBe(null);
        });
        it.each(["step 1", "step 2"])(
            "should close backlog item detail menu when sprint API call is related to the menu display flow (%s)",
            (stepTestDescrip) => {
                // arrange
                const state = {
                    openingDetailMenuSprintId: "A1",
                    openingDetailMenuBacklogItemId: "12345"
                } as SprintBacklogState;
                const stepName = stepTestDescrip === "step 1" ? ITEM_DETAIL_CLICK_STEP_1_NAME : ITEM_DETAIL_CLICK_STEP_2_NAME;
                const action = {
                    type: ActionTypes.API_GET_SPRINT_FAILURE,
                    meta: {
                        actionParams: {
                            sprintId: "A1"
                        },
                        passthrough: {
                            triggerAction: ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK,
                            stepName
                        }
                    }
                };

                // act
                const actual = sprintBacklogReducer(state, action);

                // assert
                expect(actual.openingDetailMenuBacklogItemId).toBe(null);
                expect(actual.openingDetailMenuSprintId).toBe(null);
            }
        );
        it.each(["step 1", "step 2"])(
            "should not close backlog item detail menu when sprint API call is for a different sprint (%s)",
            (stepTestDescrip) => {
                // arrange
                const state = {
                    openingDetailMenuSprintId: "B2",
                    openingDetailMenuBacklogItemId: "12345"
                } as SprintBacklogState;
                const stepName = stepTestDescrip === "step 1" ? ITEM_DETAIL_CLICK_STEP_1_NAME : ITEM_DETAIL_CLICK_STEP_2_NAME;
                const action = {
                    type: ActionTypes.API_GET_SPRINT_FAILURE,
                    meta: {
                        actionParams: {
                            sprintId: "A1"
                        },
                        passthrough: {
                            triggerAction: ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK,
                            stepName
                        }
                    }
                };

                // act
                const actual = sprintBacklogReducer(state, action);

                // assert
                expect(actual.openingDetailMenuBacklogItemId).not.toBe(null);
                expect(actual.openingDetailMenuSprintId).not.toBe(null);
            }
        );
        it("should throw an error if a new step is introduced that this code cannot handle", () => {
            // arrange
            const state = {
                openingDetailMenuSprintId: "A1",
                openingDetailMenuBacklogItemId: "12345"
            } as SprintBacklogState;
            const stepName = "THERE IS NO WAY THERE IS A STEP CALLED THIS!";
            const action = {
                type: ActionTypes.API_GET_SPRINT_FAILURE,
                meta: {
                    actionParams: {
                        sprintId: "A1"
                    },
                    passthrough: {
                        triggerAction: ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK,
                        stepName
                    }
                }
            };

            // act
            const t = () => sprintBacklogReducer(state, action);

            // assert
            expect(t).toThrowError(
                'Unable to handle API_GET_SPRINT_FAILURE for "app/click:sprint-backlog-item-detail" ' +
                    'step "THERE IS NO WAY THERE IS A STEP CALLED THIS!"'
            );
        });
    });
    describe("API_GET_SPRINT_BACKLOG_ITEMS_FAILURE", () => {
        it("should not close item detail menu when a backlog items API call is unrelated to the menu display flow", () => {
            // arrange
            const state = { openingDetailMenuBacklogItemId: "12345" } as SprintBacklogState;
            const action = {
                type: ActionTypes.API_GET_SPRINT_BACKLOG_ITEMS_FAILURE
            };

            // act
            const actual = sprintBacklogReducer(state, action);

            // assert
            expect(actual.openingDetailMenuBacklogItemId).not.toBe(null);
            expect(actual.openingDetailMenuSprintId).not.toBe(null);
        });
        it("should close item detail menu when backlog items API call is related to the menu display flow", () => {
            // arrange
            const state = {
                openingDetailMenuSprintId: "A1",
                openingDetailMenuBacklogItemId: "12345"
            } as SprintBacklogState;
            const stepName = ITEM_DETAIL_CLICK_STEP_3_NAME;
            const sprintId = "A1";
            const action = {
                type: ActionTypes.API_GET_SPRINT_BACKLOG_ITEMS_FAILURE,
                meta: {
                    passthrough: {
                        triggerAction: ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK,
                        stepName,
                        sprintId
                    }
                }
            };

            // act
            const actual = sprintBacklogReducer(state, action);

            // assert
            expect(actual.openingDetailMenuBacklogItemId).toBe(null);
            expect(actual.openingDetailMenuSprintId).toBe(null);
        });
        it("should not close backlog item detail menu when sprint API call is for a different sprint", () => {
            // arrange
            const state = {
                openingDetailMenuSprintId: "B2",
                openingDetailMenuBacklogItemId: "12345"
            } as SprintBacklogState;
            const stepName = ITEM_DETAIL_CLICK_STEP_3_NAME;
            const sprintId = "A1";
            const action = {
                type: ActionTypes.API_GET_SPRINT_BACKLOG_ITEMS_FAILURE,
                meta: {
                    passthrough: {
                        triggerAction: ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK,
                        stepName,
                        sprintId
                    }
                }
            };

            // act
            const actual = sprintBacklogReducer(state, action);

            // assert
            expect(actual.openingDetailMenuBacklogItemId).not.toBe(null);
            expect(actual.openingDetailMenuSprintId).not.toBe(null);
        });
        it("should throw an error if a new step is introduced that this code cannot handle", () => {
            // arrange
            const state = {
                openingDetailMenuSprintId: "A1",
                openingDetailMenuBacklogItemId: "12345"
            } as SprintBacklogState;
            const stepName = "THERE IS NO WAY THERE IS A STEP CALLED THIS!";
            const sprintId = "A1";
            const action = {
                type: ActionTypes.API_GET_SPRINT_BACKLOG_ITEMS_FAILURE,
                meta: {
                    passthrough: {
                        triggerAction: ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK,
                        stepName,
                        sprintId
                    }
                }
            };

            // act
            const t = () => sprintBacklogReducer(state, action);

            // assert
            expect(t).toThrowError(
                'Unable to handle API_GET_SPRINT_BACKLOG_ITEMS_FAILURE for "app/click:sprint-backlog-item-detail" ' +
                    'step "THERE IS NO WAY THERE IS A STEP CALLED THIS!"'
            );
        });
    });
    describe("SHOW_SPRINT_BACKLOG_ITEM_DETAIL", () => {
        const buildBacklogItem = (backlogItemId: string) => {
            const backlogItem: BacklogItemInSprint = {
                id: backlogItemId,
                acceptanceCriteria: null,
                acceptedAt: null,
                createdAt: new Date(2020, 0, 1),
                estimate: null,
                externalId: null,
                finishedAt: null,
                friendlyId: "fake-friendly-id",
                partIndex: 1,
                projectId: "fake-project-id",
                reasonPhrase: null,
                releasedAt: null,
                rolePhrase: null,
                startedAt: null,
                status: BacklogItemStatus.InProgress,
                storyPhrase: "fake story phrase",
                totalParts: 2,
                type: "story",
                unallocatedParts: 0,
                unallocatedPoints: 0,
                updatedAt: new Date(2020, 0, 1),

                backlogItemPartId: "fake-backlog-item-part-id",
                displayindex: 1,
                partPercentage: 100,
                storyStatus: BacklogItemStatus.InProgress,
                storyStartedAt: null,
                storyFinishedAt: null,
                storyUpdatedAt: null
            };
            return backlogItem;
        };
        const buildState = (sprintId: string, sprint: SprintBacklogSprintInfo) => {
            const state: SprintBacklogState = {
                includeArchivedSprints: true,
                openedDetailMenuBacklogItemId: null,
                openingDetailMenuBacklogItemId: null,
                openedDetailMenuSprintId: null,
                openingDetailMenuSprintId: null,
                splitInProgress: false,
                sprints: {
                    [sprintId]: sprint
                }
            };
            return state;
        };
        const buildSprintInfo = (backlogItemId: string) => {
            const sprint: SprintBacklogSprintInfo = {
                items: [buildBacklogItem(backlogItemId)],
                backlogItemsInSprint: {
                    [backlogItemId]: true
                }
            };
            return sprint;
        };
        it("should set opened state when item detail menu was not open yet", () => {
            // arrange
            const backlogItemId = "fake-backlog-item-id";
            const sprintId = "fake-sprint-id";
            const sprint = buildSprintInfo(backlogItemId);
            const state = buildState(sprintId, sprint);
            const action: ShowSprintBacklogItemDetailAction = {
                type: ActionTypes.SHOW_SPRINT_BACKLOG_ITEM_DETAIL,
                payload: {
                    sprintId: "fake-sprint-id",
                    backlogItemId: "fake-backlog-item-id",
                    splitToNextSprintAvailable: true,
                    strictMode: false
                }
            };

            // act
            const actual = sprintBacklogReducer(state, action);

            // assert
            expect(actual.openedDetailMenuBacklogItemId).toBe(backlogItemId);
            expect(actual.openingDetailMenuBacklogItemId).toBe(null);
        });
        it("should clear opened state when item detail menu was open already", () => {
            // arrange
            const backlogItemId = "fake-backlog-item-id";
            const sprintId = "fake-sprint-id";
            const sprint = buildSprintInfo(backlogItemId);
            const state: SprintBacklogState = { ...buildState(sprintId, sprint), openedDetailMenuBacklogItemId: backlogItemId };
            const action: ShowSprintBacklogItemDetailAction = {
                type: ActionTypes.SHOW_SPRINT_BACKLOG_ITEM_DETAIL,
                payload: {
                    sprintId: "fake-sprint-id",
                    backlogItemId: "fake-backlog-item-id",
                    splitToNextSprintAvailable: true,
                    strictMode: false
                }
            };

            // act
            const actual = sprintBacklogReducer(state, action);

            // assert
            expect(actual.openedDetailMenuBacklogItemId).toBe(null);
            expect(actual.openingDetailMenuBacklogItemId).toBe(null);
        });
        it("should switch opened state to new item when different item detail menu was open", () => {
            // arrange
            const backlogItemId = "fake-backlog-item-id";
            const otherBacklogItemId = "fake-different-item-that-was-open-id";
            const sprintId = "fake-sprint-id";
            const sprint = buildSprintInfo(backlogItemId);
            const state: SprintBacklogState = {
                ...buildState(sprintId, sprint),
                openedDetailMenuBacklogItemId: otherBacklogItemId
            };
            const action: ShowSprintBacklogItemDetailAction = {
                type: ActionTypes.SHOW_SPRINT_BACKLOG_ITEM_DETAIL,
                payload: {
                    sprintId: "fake-sprint-id",
                    backlogItemId: "fake-backlog-item-id",
                    splitToNextSprintAvailable: true,
                    strictMode: false
                }
            };

            // act
            const actual = sprintBacklogReducer(state, action);

            // assert
            expect(actual.openedDetailMenuBacklogItemId).toBe(backlogItemId);
            expect(actual.openingDetailMenuBacklogItemId).toBe(null);
        });
        it("should not set opened state when pushed item is a deletion", () => {
            // arrange
            const backlogItemId = "fake-backlog-item-id";
            const sprintId = "fake-sprint-id";
            const baseSprintInfo = buildSprintInfo(backlogItemId);
            const baseSprintInfoItem = baseSprintInfo.items[0];
            const sprint = { ...baseSprintInfo, items: [{ ...baseSprintInfoItem, pushState: PushState.Removed }] };
            const state = buildState(sprintId, sprint);
            const action: ShowSprintBacklogItemDetailAction = {
                type: ActionTypes.SHOW_SPRINT_BACKLOG_ITEM_DETAIL,
                payload: {
                    sprintId: "fake-sprint-id",
                    backlogItemId: "fake-backlog-item-id",
                    splitToNextSprintAvailable: true,
                    strictMode: false
                }
            };

            // act
            const actual = sprintBacklogReducer(state, action);

            // assert
            expect(actual.openedDetailMenuBacklogItemId).toBe(null);
            expect(actual.openingDetailMenuBacklogItemId).toBe(null);
        });
        it("should switch menu to new item regardless of whether backlog item is in sprint backlog item slice", () => {
            // arrange
            const backlogItemId = "item-id-to-open-menu-for";
            const stateBacklogItemId = "previously-opened-menu-item-id";
            const sprintId = "fake-sprint-id";
            const baseSprintInfo = buildSprintInfo(stateBacklogItemId);
            const baseSprintInfoItem = baseSprintInfo.items[0];
            const sprint = {
                ...baseSprintInfo,
                items: [{ ...baseSprintInfoItem, pushState: PushState.Removed }],
                backlogItemsInSprint: {}
            };
            const state: SprintBacklogState = buildState(sprintId, sprint);
            const action: ShowSprintBacklogItemDetailAction = {
                type: ActionTypes.SHOW_SPRINT_BACKLOG_ITEM_DETAIL,
                payload: {
                    sprintId,
                    backlogItemId: backlogItemId,
                    splitToNextSprintAvailable: true,
                    strictMode: false
                }
            };

            // act
            const actual = sprintBacklogReducer(state, action);

            // assert
            expect(actual.openedDetailMenuBacklogItemId).toBe("item-id-to-open-menu-for");
            expect(actual.openingDetailMenuBacklogItemId).toBe(null);
        });
    });
});
