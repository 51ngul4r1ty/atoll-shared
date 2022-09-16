// interfaces/types
import type { FSA } from "../types/reactHelperTypes";

// consts/enums
import * as ActionTypes from "./actionTypes";

export type SetCurrentProjectIdActionPayload = {
    projectId: string;
};
export type SetCurrentProjectIdAction = FSA<typeof ActionTypes.SET_CURRENT_PROJECT_ID, SetCurrentProjectIdActionPayload>;
export const setCurrentProjectId = (projectId: string): SetCurrentProjectIdAction => ({
    type: ActionTypes.SET_CURRENT_PROJECT_ID,
    payload: {
        projectId
    }
});
