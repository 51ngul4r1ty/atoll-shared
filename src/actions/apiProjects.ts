// actions
import * as ActionTypes from "./actionTypes";
import * as ApiActionNames from "./apiActionNames";

// config
import { getApiBaseUrl } from "../config";

// consts/enums
import { APPLICATION_JSON } from "../constants";
import { ApiBatchAction } from "../middleware/apiBatchTypes";

// utils
import { buildActionTypes } from "./utils/apiActionUtils";

export interface ApiBatchGetProjectAndRouteToBacklogItemViewBody {
    backlogitemId: string;
}

export interface ApiBatchGetProjectAndRouteToBacklogItemViewItemActionParams {
    projectId: string;
}

export interface ApiBatchGetProjectAndRouteToBacklogItemViewBatchActionParams {
    projectId: string;
    backlogItemId: string;
}

export type ApiBatchGetProjectAndRouteToBacklogItemViewAction = ApiBatchAction<
    ApiBatchGetProjectAndRouteToBacklogItemViewBody,
    ApiBatchGetProjectAndRouteToBacklogItemViewItemActionParams,
    ApiBatchGetProjectAndRouteToBacklogItemViewBatchActionParams
>;

/**
 * Retrieves the project (so it can get the "display id" for the route) and then route to the
 * URL that we can build for the backlog item under that project.
 * @param projectId Used to get project "display id."
 * @param backlogItemId The ID of the backlog item to view.
 */
export const apiBatchGetProjectAndRouteToBacklogItemView = (
    projectId: string,
    backlogItemId: string
): ApiBatchGetProjectAndRouteToBacklogItemViewAction => {
    const calls = [
        {
            payload: {
                endpoint: `${getApiBaseUrl()}api/v1/projects/${projectId}`,
                method: "GET",
                headers: { Accept: APPLICATION_JSON },
                types: buildActionTypes(ApiActionNames.GET_PROJECT)
            },
            meta: {
                actionParams: {
                    projectId
                }
            }
        }
    ];
    return {
        type: ActionTypes.API_BATCH,
        calls,
        meta: {
            actionParams: {
                projectId,
                backlogItemId
            }
        }
    };
};
