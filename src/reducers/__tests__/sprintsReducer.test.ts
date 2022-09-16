// test related
import "jest";

// externals
import produce from "immer";

// utils
import { DateOnly } from "../../types/dateTypes";

// consts/enums
import { Source } from "../enums";

// interfaces/types
import type { SprintsState } from "../sprints/sprintsReducer";

// consts/enums
import { sprintsReducerInitialState } from "../sprints/sprintsReducer";

// code under test
import { rebuildAllItems } from "../sprints/sprintsReducerHelper";

// test utils
import { buildSprintForTesting } from "../../__tests__/objectBuilders";

describe("Sprints Reducer", () => {
    describe("rebuildAllItems", () => {
        it("builds an empty list when nothing has been loaded yet", () => {
            let sprintsState: SprintsState;
            {
                // arrange
                sprintsState = produce(sprintsReducerInitialState, (draft) => {
                    {
                        // act
                        rebuildAllItems(draft);
                    }
                });
            }
            {
                // assert
                expect(sprintsState.allItems).toStrictEqual([]);
            }
        });
        it("builds a sorted list of sprints after a new sprint is added", () => {
            let newState: SprintsState;
            let sprintsState: SprintsState;
            let buildSprint1: { () };
            let buildSprint2: { () };
            {
                // arrange
                buildSprint1 = () => buildSprintForTesting(1, new DateOnly(2021, 5, 4));
                buildSprint2 = () => buildSprintForTesting(1, new DateOnly(2021, 5, 18));
                newState = {
                    ...sprintsReducerInitialState,
                    items: [buildSprint1()],
                    addedItems: [buildSprint2()]
                };
            }
            {
                // act
                sprintsState = produce(newState, (draft) => {
                    rebuildAllItems(draft);
                });
            }
            {
                // assert
                const expectedSprint1 = { ...buildSprint1(), source: Source.Loaded, saved: true };
                const expectedSprint2 = { ...buildSprint2(), source: Source.Added };
                expect(sprintsState.allItems).toStrictEqual([expectedSprint1, expectedSprint2]);
            }
        });
    });
});
