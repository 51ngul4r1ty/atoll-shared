// externals
import { produce } from "immer";

// interfaces/types
import type { AnyFSA } from "../../types/reactHelperTypes";
import type { ApiGetBffViewsPlanSuccessAction } from "../../actions/apiBffViewsPlan";

// consts/enums
import * as ActionTypes from "../../actions/actionTypes";

// utils
import { mapApiItemToProject } from "../../mappers/projectMappers";

export type ProjectState = Readonly<{
    id: string | null;
    name: string | null;
    description: string | null;
}>;

export const projectReducerInitialState = Object.freeze<ProjectState>({
    id: null,
    name: null,
    description: null
});

export const projectReducer = (state: ProjectState = projectReducerInitialState, action: AnyFSA): ProjectState =>
    produce(state, (draft) => {
        const { type } = action;
        switch (type) {
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsPlanSuccessAction;
                const { payload } = actionTyped;
                const projectFromApi = mapApiItemToProject(payload.response.data.project);
                draft.id = projectFromApi.id;
                draft.name = projectFromApi.name;
                draft.description = projectFromApi.description;
                return;
            }
        }
    });
