// test related
import "jest";

// consts/enums
import * as ActionTypes from "../../actions/actionTypes";
import { ITEM_DETAIL_CLICK_STEP_1_NAME, ITEM_DETAIL_CLICK_STEP_2_NAME } from "../../actionFlows/itemDetailMenuActionFlow";

// code under test
import { sprintBacklogReducer, SprintBacklogState } from "../sprintBacklogReducer";

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
});
