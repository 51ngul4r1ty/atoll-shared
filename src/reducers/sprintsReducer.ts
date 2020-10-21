// externals
import { produce } from "immer";

// consts/enums
import * as ActionTypes from "../actions/actionTypes";

// interfaces/types
import { AnyFSA, StandardModelItem } from "../types";
import { ApiGetBffViewsPlanSuccessAction } from "../actions/apiBffViewsPlan";
import { ApiSprint } from "../apiModelTypes";

// utils
import { isoDateStringToDate } from "../utils/apiPayloadConverters";
import { CollapseSprintPanelAction, ExpandSprintPanelAction } from "../actions/sprintActions";

export interface Sprint extends StandardModelItem {
    name: string;
    expanded: boolean;
    displayIndex: number;
    startDate: Date;
    finishDate: Date;
    projectId: string;
    plannedPoints: number | null;
    acceptedPoints: number | null;
    velocityPoints: number | null;
    usedSplitPoints: number | null;
    remainingSplitPoints: number | null;
}

export type SprintsState = Readonly<{
    items: Sprint[];
}>;

export const sprintsReducerInitialState = Object.freeze<SprintsState>({
    items: []
});

export const mapApiItemToSprint = (apiItem: ApiSprint): Sprint => ({
    id: apiItem.id,
    expanded: false, // TODO: Add smart logic for this
    name: apiItem.name,
    displayIndex: apiItem.displayindex,
    startDate: isoDateStringToDate(apiItem.startdate),
    finishDate: isoDateStringToDate(apiItem.finishdate),
    createdAt: apiItem.createdAt,
    updatedAt: apiItem.updatedAt,
    projectId: apiItem.projectId,
    plannedPoints: apiItem.plannedPoints,
    acceptedPoints: apiItem.acceptedPoints,
    velocityPoints: apiItem.velocityPoints,
    usedSplitPoints: apiItem.usedSplitPoints,
    remainingSplitPoints: apiItem.remainingSplitPoints
});

export const mapApiItemsToSprints = (apiItems: ApiSprint[]): Sprint[] => {
    return apiItems.map((item) => mapApiItemToSprint(item));
};

export const sprintsReducer = (state: SprintsState = sprintsReducerInitialState, action: AnyFSA): SprintsState =>
    produce(state, (draft) => {
        const { type } = action;
        switch (type) {
            case ActionTypes.COLLAPSE_SPRINT_PANEL: {
                const actionTyped = action as CollapseSprintPanelAction;
                draft.items.forEach((item) => {
                    if (item.id === actionTyped.payload.sprintId) {
                        item.expanded = false;
                    }
                    item.id;
                });
                return;
            }
            case ActionTypes.EXPAND_SPRINT_PANEL: {
                const actionTyped = action as ExpandSprintPanelAction;
                draft.items.forEach((item) => {
                    if (item.id === actionTyped.payload.sprintId) {
                        item.expanded = true;
                    }
                    item.id;
                });
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsPlanSuccessAction;
                const { payload } = actionTyped;
                draft.items = mapApiItemsToSprints(payload.response.data.sprints);
                return;
            }
        }
    });
