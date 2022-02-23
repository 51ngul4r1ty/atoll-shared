/**
 * Purpose: keep everything related to the sprint backlog item's "item detail menu" opening in one place.
 */

// externals
import type { Store } from "redux";

// state
import type { StateTree } from "../reducers/rootReducer";

// interfaces/types
import type { ApiGetSprintSuccessActionMeta, ApiGetSprintSuccessActionPayload } from "../actions/apiSprints";

// utils
import { buildFullUri, getLinkByRel, LINK_REL_NEXT } from "../utils/apiLinkHelper";

// actions
import { apiGetSprint } from "../actions/apiSprints";
import { toggleSprintBacklogItemDetail } from "../actions/sprintBacklogActions";
import { apiGetSprintBacklogItems } from "../actions/apiSprintBacklog";
import { ApiBacklogItemInSprint } from "../types/apiModelTypes";

export const ITEM_DETAIL_CLICK_STEP_1_NAME = "1-GetSprintDetails";
export const ITEM_DETAIL_CLICK_STEP_2_NAME = "2-GetNextSprintDetails";
export const ITEM_DETAIL_CLICK_STEP_3_NAME = "3-GetNextSprintBacklogItems";

export type ApiItemDetailMenuActionFlowSuccessMeta = {
    triggerAction: string;
    stepName: string;
    sprintId: string; // TODO: move to original action params
    backlogItemId: string; // TODO: move to original action params
};

// #region middleware - handleSprintBacklogItemDetailClick

export const handleSprintBacklogItemDetailClick = (
    store: Store<StateTree>,
    actionType: string,
    sprintId: string,
    backlogItemId: string
) => {
    store.dispatch(
        apiGetSprint(sprintId, {
            passthroughData: {
                triggerAction: actionType,
                sprintId: sprintId,
                backlogItemId: backlogItemId,
                stepName: ITEM_DETAIL_CLICK_STEP_1_NAME
            }
        })
    );
};

// #endregion

// #region middleware - handleGetSprintSuccessForItemDetailClick

export const handleGetSprintSuccessForItemDetailClick = (
    store: Store<StateTree>,
    stepName: string,
    payload: ApiGetSprintSuccessActionPayload,
    meta: ApiGetSprintSuccessActionMeta
) => {
    switch (stepName) {
        case ITEM_DETAIL_CLICK_STEP_1_NAME: {
            processSprintDataForItemDetailClickStep1(payload, meta, store);
            break;
        }
        case ITEM_DETAIL_CLICK_STEP_2_NAME: {
            processSprintDataForItemDetailClickStep2(payload, meta, store);
            break;
        }
        default: {
            throw new Error("Unexpected result- SPRINT_BACKLOG_ITEM_DETAIL_CLICK should only use sprint endpoint for steps 1 & 2");
        }
    }
};

const processSprintDataForItemDetailClickStep1 = (
    payload: ApiGetSprintSuccessActionPayload,
    meta: ApiGetSprintSuccessActionMeta,
    store: Store<StateTree>
) => {
    const nextSprintLink = getLinkByRel(payload.response?.data?.item?.links, LINK_REL_NEXT);
    if (nextSprintLink === null) {
        const splitToNextSprintAvailable = false;
        const sprintId = meta.passthrough.sprintId;
        const backlogItemId = meta.passthrough.backlogItemId;
        store.dispatch(toggleSprintBacklogItemDetail(sprintId, backlogItemId, splitToNextSprintAvailable));
    } else {
        const nextSprintUri = nextSprintLink?.uri;
        if (!nextSprintUri) {
            throw new Error(`'next' link returned for sprint "${payload.response?.data?.item?.id}" but it is empty!`);
        }
        const endpointOverride = buildFullUri(meta.requestBody, nextSprintUri);
        const sprintId = null;
        store.dispatch(
            apiGetSprint(sprintId, {
                passthroughData: {
                    ...meta.passthrough,
                    stepName: ITEM_DETAIL_CLICK_STEP_2_NAME
                },
                endpointOverride
            })
        );
    }
};

const processSprintDataForItemDetailClickStep2 = (
    payload: ApiGetSprintSuccessActionPayload,
    meta: ApiGetSprintSuccessActionMeta,
    store: Store<StateTree>
) => {
    const sprintId = payload.response?.data?.item?.id;
    if (!sprintId) {
        throw new Error("Unexpected condition- sprint ID should be returned in payload got item-detail-click step 2");
    }
    store.dispatch(
        apiGetSprintBacklogItems(sprintId, {
            passthroughData: {
                ...meta.passthrough,
                stepName: ITEM_DETAIL_CLICK_STEP_3_NAME
            }
        })
    );
};

// #endregion

// #region middleware - handleGetSprintBacklogItemsSuccessForItemDetailClick

export const handleGetSprintBacklogItemsSuccessForItemDetailClick = (
    store: Store<StateTree>,
    stepName: string,
    apiBacklogItems: ApiBacklogItemInSprint[],
    sprintId: string,
    backlogItemId: string
) => {
    if (stepName === ITEM_DETAIL_CLICK_STEP_3_NAME) {
        const matchingItems = apiBacklogItems.filter((item) => item.id === backlogItemId);
        const hasBacklogItem = matchingItems.length > 0;
        const splitToNextSprintAvailable = !hasBacklogItem;
        store.dispatch(toggleSprintBacklogItemDetail(sprintId, backlogItemId, splitToNextSprintAvailable));
    } else {
        throw new Error("Unexpected result- ITEM_DETAIL_CLICK_STEP_3_NAME expected as stepName");
    }
};

// #endregion
