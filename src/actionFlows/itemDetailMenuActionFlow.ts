/**
 * Purpose: keep everything related to the sprint backlog item's "item detail menu" opening in one place.
 * Notes:
 *   This flow includes the following sequence of actions:
 *   1. SPRINT_BACKLOG_ITEM_DETAIL_CLICK (the click to open the detail menu for the sprint backlog item).
 *   2. API action to get sprint data ("step 1").
 *   3. API_GET_SPRINT_REQUEST
 *   4.1. API_GET_SPRINT_SUCCESS
 *     4.1.1. TOGGLE_SPRINT_BACKLOG_ITEM_DETAIL (if there's no next sprint)
 *     --- OR ---
 *     4.1.2. API action to get next sprint data ("step 2").
 *       4.1.2.1. API_GET_SPRINT_REQUEST
 *       4.1.2.2. API_GET_SPRINT_SUCCESS
 *         4.1.2.3.1. API action to get sprint backlog items data
 *         4.1.2.3.2. API_GET_SPRINT_BACKLOG_ITEMS_REQUEST
 *         4.1.2.3.3. API_GET_SPRINT_BACKLOG_ITEMS_SUCCESS
 *           4.1.2.3.3.1. TOGGLE_SPRINT_BACKLOG_ITEM_DETAIL
 *         --- OR ---
 *         4.1.2.3.4. API_GET_SPRINT_BACKLOG_ITEMS_FAILURE
 *       --- OR ---
 *       4.1.2.3. API_GET_SPRINT_FAILURE
 *   --- OR ---
 *   4.2. API_GET_SPRINT_FAILURE
 */

// interfaces/types
import type { ApiGetSprintSuccessActionMeta, ApiGetSprintSuccessActionPayload } from "../actions/apiSprints";
import type { ApiBacklogItemInSprint } from "../types/apiModelTypes";
import type { StoreTyped } from "../types/reduxHelperTypes";

// utils
import { buildFullUri, getLinkByRel, LINK_REL_NEXT } from "../utils/apiLinkHelper";

// consts/enums
import {
    ITEM_DETAIL_CLICK_STEP_1_NAME,
    ITEM_DETAIL_CLICK_STEP_2_NAME,
    ITEM_DETAIL_CLICK_STEP_3_NAME
} from "./itemDetailMenuActionFlowConsts";

// selectors
import * as sprintBacklogSelectors from "../selectors/sprintBacklogSelectors";
import * as appSelectors from "../selectors/appSelectors";

// actions
import { apiGetSprint } from "../actions/apiSprints";
import { apiGetSprintBacklogItems } from "../actions/apiSprintBacklog";
import { hasBacklogItemAtLeastBeenAccepted } from "../utils/backlogItemStatusHelper";
import { hideSprintBacklogItemDetail, showSprintBacklogItemDetail } from "../actions/sprintBacklogActions";
import { alreadyShowingMenu } from "../utils/dropdownMenuUtils";

export type ApiItemDetailMenuActionFlowSuccessMeta = {
    triggerAction: string;
    stepName: string;
    sprintId: string; // TODO: move to original action params
    backlogItemId: string; // TODO: move to original action params
};

// #region middleware - handleSprintBacklogItemDetailClick

export const handleSprintBacklogItemDetailClick = (
    store: StoreTyped,
    actionType: string,
    sprintId: string,
    backlogItemId: string,
    strictMode: boolean
) => {
    const state = store.getState();
    const backlogItem = sprintBacklogSelectors.getSprintBacklogItemById(state, sprintId, backlogItemId);
    const openedDetailMenuBacklogItemId = sprintBacklogSelectors.getSprintBacklogOpenedDetailMenuItemId(state);
    if (alreadyShowingMenu(openedDetailMenuBacklogItemId, backlogItemId)) {
        store.dispatch(hideSprintBacklogItemDetail(sprintId, backlogItemId));
    } else if (hasBacklogItemAtLeastBeenAccepted(backlogItem.status)) {
        const splitToNextSprintAvailable = false;
        store.dispatch(showSprintBacklogItemDetail(sprintId, backlogItemId, splitToNextSprintAvailable, strictMode));
    } else {
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
    }
};

// #endregion

// #region middleware - handleGetSprintSuccessForItemDetailClick

export const handleGetSprintSuccessForItemDetailClick = (
    store: StoreTyped,
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
    store: StoreTyped
) => {
    const nextSprintLink = getLinkByRel(payload.response?.data?.item?.links, LINK_REL_NEXT);
    if (nextSprintLink === null) {
        const splitToNextSprintAvailable = false;
        const sprintId = meta.passthrough.sprintId;
        const backlogItemId = meta.passthrough.backlogItemId;
        const state = store.getState();
        const strictMode = appSelectors.isStrictMode(state);
        store.dispatch(showSprintBacklogItemDetail(sprintId, backlogItemId, splitToNextSprintAvailable, strictMode));
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
    store: StoreTyped
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
    store: StoreTyped,
    stepName: string,
    apiBacklogItems: ApiBacklogItemInSprint[],
    sprintId: string,
    backlogItemId: string
) => {
    if (stepName === ITEM_DETAIL_CLICK_STEP_3_NAME) {
        const matchingItems = apiBacklogItems.filter((item) => item.id === backlogItemId);
        const hasBacklogItem = matchingItems.length > 0;
        const splitToNextSprintAvailable = !hasBacklogItem;
        const state = store.getState();
        const strictMode = appSelectors.isStrictMode(state);
        store.dispatch(showSprintBacklogItemDetail(sprintId, backlogItemId, splitToNextSprintAvailable, strictMode));
    } else {
        throw new Error("Unexpected result- ITEM_DETAIL_CLICK_STEP_3_NAME expected as stepName");
    }
};

// #endregion
