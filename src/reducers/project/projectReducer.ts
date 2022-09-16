// externals
import { produce } from "immer";

// interfaces/types
import type { AnyFSA } from "../../types/reactHelperTypes";
import type { ApiGetBffViewsPlanSuccessAction } from "../../actions/apiBffViewsPlan";
import type { Project } from "./projectReducerTypes";
import type { ApiGetProjectsSuccessAction } from "../../actions/apiProjects";

// consts/enums
import * as ActionTypes from "../../actions/actionTypes";
import { ITEM_MENU_OPENER_DATA_CLASS, ITEM_MENU_PANEL_DATA_CLASS } from "../../components/common/consts";

// utils
import { mapApiItemToProject } from "../../mappers/projectMappers";
import { AppClickAction } from "../../actions/appActions";

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
            case ActionTypes.APP_CLICK: {
                const actionTyped = action as AppClickAction;
                const parent = actionTyped.payload.parent;
                console.log("APP_CLICK", {
                    parentDataClass: parent?.dataClass,
                    parentItemId: parent?.itemId,
                    parentItemType: parent?.itemType
                });
                const dataClass = parent?.dataClass;
                if (
                    draft.projectPickerOpen &&
                    dataClass !== ITEM_MENU_PANEL_DATA_CLASS &&
                    dataClass !== ITEM_MENU_OPENER_DATA_CLASS
                ) {
                    draft.projectPickerOpen = false;
                }
                return;
            }
        }
    });
