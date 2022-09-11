// externals
import { produce } from "immer";

// interfaces/types
import type { AnyFSA } from "../../types/reactHelperTypes";
import type { ApiGetBffViewsPlanSuccessAction } from "../../actions/apiBffViewsPlan";

// consts/enums
import * as ActionTypes from "../../actions/actionTypes";

// utils
import { mapApiItemToProject } from "../../mappers/projectMappers";
import { ApiGetProjectsSuccessAction } from "../../actions/apiProjects";
import { Project } from "./projectReducerTypes";

export type ProjectState = Readonly<{
    id: string | null;
    name: string | null;
    description: string | null;
    projectPickerOpen: boolean;
    projects: Project[];
    projectsLoaded: boolean;
}>;

export const projectReducerInitialState = Object.freeze<ProjectState>({
    id: null,
    name: null,
    description: null,
    projectPickerOpen: false,
    projects: [],
    projectsLoaded: false
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
            case ActionTypes.API_GET_PROJECTS_SUCCESS: {
                const actionTyped = action as ApiGetProjectsSuccessAction;
                const payload = actionTyped.payload;
                const projectsFromApi = payload.response.data.items.map(mapApiItemToProject);
                draft.projects = projectsFromApi;
                draft.projectsLoaded = true;
                return;
            }
            case ActionTypes.PROJECT_PICKER_OPENED: {
                draft.projectPickerOpen = true;
                return;
            }
            case ActionTypes.PROJECT_PICKER_CLOSED: {
                draft.projectPickerOpen = false;
                return;
            }
        }
    });
