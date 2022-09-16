// externals
import { Draft, produce } from "immer";

// consts/enums
import * as ActionTypes from "../../actions/actionTypes";
import { PushState } from "../enums";

// interfaces/types
import type { AnyFSA } from "../../types/reactHelperTypes";
import type {
    ApiGetSprintBacklogItemsFailureAction,
    ApiGetSprintBacklogItemsSuccessAction,
    ApiPostSprintBacklogItemSuccessAction,
    ApiSplitSprintItemSuccessAction,
    ApiSprintBacklogItemSetStatusSuccessAction
} from "../../actions/apiSprintBacklog";
import type { BacklogItemInSprint } from "../../types/backlogItemTypes";
import type { BacklogItemInSprintWithSource } from "../backlogItems/backlogItemsReducerTypes";
import type {
    AddBacklogItemToSprintAction,
    ChangeSprintPlanningArchivedFilterAction,
    MoveBacklogItemToSprintAction,
    PatchBacklogItemInSprintAction,
    RemoveSprintBacklogItemAction,
    SprintBacklogItemDetailClickAction,
    ShowSprintBacklogItemDetailAction,
    HideSprintBacklogItemDetailAction
} from "../../actions/sprintBacklogActions";
import type { AppClickAction } from "../../actions/appActions";
import type { ApiGetBffViewsPlanSuccessAction } from "../../actions/apiBffViewsPlan";
import type { ApiBacklogItemInSprint } from "../../types/apiModelTypes";
import type { ApiGetSprintFailureAction } from "../../actions/apiSprints";
import type {
    ApiBacklogItemPartWithSprintId,
    ApiGetBacklogItemSuccessAction,
    ApiJoinUnallocatedBacklogItemPartsSuccessAction
} from "../../actions/apiBacklogItems";

// consts/enums
import {
    ITEM_DETAIL_CLICK_STEP_1_NAME,
    ITEM_DETAIL_CLICK_STEP_2_NAME,
    ITEM_DETAIL_CLICK_STEP_3_NAME
} from "../../actionFlows/itemDetailMenuActionFlowConsts";

// utils
import { mapApiItemsToSprintBacklogItems } from "../../mappers/backlogItemMappers";
import { mapApiStatusToBacklogItem } from "../../mappers/statusMappers";
import { alreadyShowingMenu, calcToggledOpenMenuItemId } from "../../utils/dropdownMenuUtils";
import { shouldHideDetailMenu } from "../../components/utils/itemDetailMenuUtils";
import { getFlowInfoFromAction } from "../../utils/actionFlowUtils";

export type SprintBacklogSprint = {
    items: BacklogItemInSprint[];
};

export type SprintBacklogSprintInfo = SprintBacklogSprint & {
    backlogItemsInSprint: { [backlogItemId: string]: boolean };
};

export type SprintBacklogState = Readonly<{
    includeArchivedSprints: boolean;
    openedDetailMenuBacklogItemId: string | null;
    openingDetailMenuBacklogItemId: string | null;
    openedDetailMenuSprintId: string | null;
    openingDetailMenuSprintId: string | null;
    splitInProgress: boolean;
    sprints: { [sprintId: string]: SprintBacklogSprintInfo };
}>;

export const sprintBacklogReducerInitialState = Object.freeze<SprintBacklogState>({
    includeArchivedSprints: false,
    openedDetailMenuBacklogItemId: null,
    openingDetailMenuBacklogItemId: null,
    openedDetailMenuSprintId: null,
    openingDetailMenuSprintId: null,
    splitInProgress: false,
    sprints: {}
});

export const getOrAddSprintById = (draft: Draft<SprintBacklogState>, sprintId: string): SprintBacklogSprintInfo => {
    let sprint = draft.sprints[sprintId];
    if (!sprint) {
        draft.sprints[sprintId] = { items: [], backlogItemsInSprint: {} };
        sprint = draft.sprints[sprintId];
    }
    return sprint;
};

export const linkBacklogItemToSprint = (draft: Draft<SprintBacklogState>, sprintId: string, backlogItemId: string) => {
    const sprintInfo = getOrAddSprintById(draft, sprintId);
    sprintInfo.backlogItemsInSprint[backlogItemId] = true;
};

export const unlinkBacklogItemFromSprint = (draft: Draft<SprintBacklogState>, sprintId: string, backlogItemId: string) => {
    const sprintInfo = getOrAddSprintById(draft, sprintId);
    if (sprintInfo.backlogItemsInSprint[backlogItemId]) {
        delete sprintInfo.backlogItemsInSprint[backlogItemId];
    }
};

export const getSprintBacklogItemByIdFromSlice = (
    sprintBacklogState: SprintBacklogState,
    sprintId: string,
    backlogItemId: string
): BacklogItemInSprintWithSource | null => {
    const sprint = sprintBacklogState.sprints[sprintId];
    if (!sprint) {
        return null;
    }
    const matchingItems = sprint.items.filter((item) => item.id === backlogItemId);
    if (matchingItems.length === 1) {
        const matchingItem = matchingItems[0];
        return matchingItem as BacklogItemInSprintWithSource;
    } else {
        return null;
    }
};

export const addSprintBacklogItems = (
    draft: Draft<SprintBacklogState>,
    sprintId: string,
    backlogItems: ApiBacklogItemInSprint[]
) => {
    let sprint = getOrAddSprintById(draft, sprintId);
    sprint.items = [];
    const items = mapApiItemsToSprintBacklogItems(backlogItems);
    if (!items) {
        throw new Error("Unexpected condition- addSprintBacklogItems had items undefined");
    }
    items.forEach((item) => {
        const backlogItemId = item.id;
        linkBacklogItemToSprint(draft, sprintId, backlogItemId);
        sprint.items.push(item);
    });
};

export const sprintBacklogReducer = (
    state: SprintBacklogState = sprintBacklogReducerInitialState,
    action: AnyFSA
): SprintBacklogState =>
    produce(state, (draft) => {
        const { type } = action;
        switch (type) {
            case ActionTypes.API_GET_SPRINT_BACKLOG_ITEMS_SUCCESS: {
                const actionTyped = action as ApiGetSprintBacklogItemsSuccessAction;
                const sprintId = actionTyped.meta.actionParams.sprintId;
                addSprintBacklogItems(draft, sprintId, actionTyped.payload.response.data.items);
                return;
            }
            case ActionTypes.API_GET_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as ApiGetBacklogItemSuccessAction;
                const triggerAction = actionTyped.meta?.passthrough?.triggerAction;
                const isSelectAction = triggerAction === ActionTypes.SELECT_PRODUCT_BACKLOG_ITEM;
                const isUnselectAction = triggerAction === ActionTypes.UNSELECT_PRODUCT_BACKLOG_ITEM;
                if (isSelectAction || isUnselectAction) {
                    const backlogItemId = actionTyped.meta?.passthrough?.backlogItemId;
                    if (!backlogItemId) {
                        throw new Error(
                            "Unexpected condition- API_GET_BACKLOG_ITEM_SUCCESS expects backlogItemId in passthrough data"
                        );
                    }
                    const backlogItemSprintIds = actionTyped.payload.response.data.extra?.sprintIds || [];
                    const linkOrUnlinkFunction = isSelectAction ? linkBacklogItemToSprint : unlinkBacklogItemFromSprint;
                    backlogItemSprintIds.forEach((sprintId) => {
                        linkOrUnlinkFunction(draft, sprintId, backlogItemId);
                    });
                }
                return;
            }
            case ActionTypes.MOVE_BACKLOG_ITEM_TO_SPRINT: {
                const actionTyped = action as MoveBacklogItemToSprintAction;
                const sprintId = actionTyped.payload.sprintId;
                let sprint = getOrAddSprintById(draft, sprintId);
                sprint.items.push(actionTyped.payload.sprintBacklogItem);
                return;
            }
            case ActionTypes.ADD_BACKLOG_ITEM_TO_SPRINT: {
                const actionTyped = action as AddBacklogItemToSprintAction;
                const sprintId = actionTyped.payload.sprintId;
                let sprint = getOrAddSprintById(draft, sprintId);
                sprint.items.push(actionTyped.payload.backlogItem);
                return;
            }
            case ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK: {
                const actionTyped = action as SprintBacklogItemDetailClickAction;
                const sprintId = actionTyped.payload.sprintId;
                const backlogItemId = actionTyped.payload.backlogItemId;
                const strictMode = actionTyped.payload.strictMode;
                if (!alreadyShowingMenu(draft.openedDetailMenuBacklogItemId, backlogItemId)) {
                    draft.openingDetailMenuBacklogItemId = calcToggledOpenMenuItemId(
                        draft.openingDetailMenuBacklogItemId,
                        backlogItemId,
                        strictMode,
                        (itemId: string) => getSprintBacklogItemByIdFromSlice(state, sprintId, itemId),
                        (item) => item?.pushState !== PushState.Removed
                    );
                    draft.openingDetailMenuSprintId = draft.openingDetailMenuBacklogItemId ? sprintId : null;
                }
                return;
            }
            case ActionTypes.API_GET_SPRINT_FAILURE: {
                const actionTyped = action as ApiGetSprintFailureAction;
                const { triggerAction, stepName } = getFlowInfoFromAction(actionTyped);
                if (triggerAction !== ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK) {
                    return;
                } else if (stepName === ITEM_DETAIL_CLICK_STEP_1_NAME || stepName === ITEM_DETAIL_CLICK_STEP_2_NAME) {
                    if (draft.openingDetailMenuSprintId === actionTyped.meta.actionParams.sprintId) {
                        draft.openingDetailMenuSprintId = null;
                        draft.openingDetailMenuBacklogItemId = null;
                    }
                } else {
                    throw new Error(`Unable to handle API_GET_SPRINT_FAILURE for "${triggerAction}" step "${stepName}"`);
                }
                return;
            }
            case ActionTypes.API_GET_SPRINT_BACKLOG_ITEMS_FAILURE: {
                const actionTyped = action as ApiGetSprintBacklogItemsFailureAction;
                const { triggerAction, stepName } = getFlowInfoFromAction(actionTyped);
                if (triggerAction === ActionTypes.SPRINT_BACKLOG_ITEM_DETAIL_CLICK) {
                    if (stepName === ITEM_DETAIL_CLICK_STEP_3_NAME) {
                        if (draft.openingDetailMenuSprintId === actionTyped.meta.passthrough.sprintId) {
                            draft.openingDetailMenuSprintId = null;
                            draft.openingDetailMenuBacklogItemId = null;
                        }
                    } else {
                        throw new Error(
                            `Unable to handle API_GET_SPRINT_BACKLOG_ITEMS_FAILURE for "${triggerAction}" step "${stepName}"`
                        );
                    }
                }
                return;
            }
            case ActionTypes.SHOW_SPRINT_BACKLOG_ITEM_DETAIL: {
                const actionTyped = action as ShowSprintBacklogItemDetailAction;
                const sprintId = actionTyped.payload.sprintId;
                const getItem = (itemId: string) => getSprintBacklogItemByIdFromSlice(state, sprintId, itemId);
                const includeItemCheck = (item) => item?.pushState !== PushState.Removed;
                const strictMode = actionTyped.payload.strictMode;
                draft.openedDetailMenuBacklogItemId = calcToggledOpenMenuItemId(
                    draft.openedDetailMenuBacklogItemId,
                    actionTyped.payload.backlogItemId,
                    strictMode,
                    getItem,
                    includeItemCheck
                );
                draft.openedDetailMenuSprintId = draft.openedDetailMenuBacklogItemId ? sprintId : null;
                const hasItemDetailMenuOpened = !!draft.openedDetailMenuBacklogItemId;
                if (hasItemDetailMenuOpened) {
                    draft.openingDetailMenuSprintId = null;
                    draft.openingDetailMenuBacklogItemId = null;
                }
                return;
            }
            case ActionTypes.HIDE_SPRINT_BACKLOG_ITEM_DETAIL: {
                const actionTyped = action as HideSprintBacklogItemDetailAction;
                const sprintId = actionTyped.payload.sprintId;
                const backlogItemId = actionTyped.payload.backlogItemId;
                if (draft.openedDetailMenuSprintId === sprintId && draft.openedDetailMenuBacklogItemId === backlogItemId) {
                    draft.openedDetailMenuSprintId = null;
                    draft.openedDetailMenuBacklogItemId = null;
                    draft.openingDetailMenuSprintId = null;
                    draft.openingDetailMenuBacklogItemId = null;
                }
                return;
            }
            case ActionTypes.API_DELETE_SPRINT_BACKLOG_ITEM_SUCCESS: {
                draft.openedDetailMenuSprintId = null;
                draft.openedDetailMenuBacklogItemId = null;
                return;
            }
            case ActionTypes.API_PATCH_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as ApiSprintBacklogItemSetStatusSuccessAction;
                const sprintId = actionTyped.meta.actionParams.sprintId;
                const backlogItemPartId = actionTyped.meta.actionParams.backlogItemPartId;

                const sprint = draft.sprints[sprintId];
                if (!sprint) {
                    return;
                }
                sprint.items.forEach((item) => {
                    if (item.backlogItemPartId === backlogItemPartId) {
                        item.status = mapApiStatusToBacklogItem(actionTyped.meta.requestBody.data.status);
                    }
                });
                draft.openedDetailMenuSprintId = null;
                draft.openedDetailMenuBacklogItemId = null;
                return;
            }
            case ActionTypes.REMOVE_SPRINT_BACKLOG_ITEM: {
                const actionTyped = action as RemoveSprintBacklogItemAction;
                const sprintId = actionTyped.payload.sprintId;
                const backlogItemId = actionTyped.payload.backlogItemId;
                const sprint = draft.sprints[sprintId];
                if (!sprint) {
                    throw Error(`Unexpected scenario: sprint ${sprintId} does not exist`);
                } else {
                    let idx = -1;
                    let foundIdx = -1;
                    sprint.items.forEach((item) => {
                        idx++;
                        if (item.id === backlogItemId) {
                            foundIdx = idx;
                        }
                    });
                    if (foundIdx >= 0) {
                        sprint.items.splice(foundIdx, 1);
                    } else {
                        throw Error(`Unexpected scenario: backlog item ${backlogItemId} does not exist`);
                    }
                }
                unlinkBacklogItemFromSprint(draft, sprintId, backlogItemId);

                return;
            }
            case ActionTypes.API_POST_SPRINT_BACKLOG_ITEM_SUCCESS: {
                const actionTyped = action as ApiPostSprintBacklogItemSuccessAction;
                const sprintId = actionTyped.meta.actionParams.sprintId;
                const backlogItemId = actionTyped.meta.actionParams.backlogItemId;
                linkBacklogItemToSprint(draft, sprintId, backlogItemId);
                return;
            }
            case ActionTypes.PATCH_BACKLOG_ITEM_IN_SPRINT: {
                const actionTyped = action as PatchBacklogItemInSprintAction;
                const sprintId = actionTyped.payload.sprintId;
                const backlogItemId = actionTyped.payload.backlogItemId;
                const sprint = draft.sprints[sprintId];
                if (!sprint) {
                    throw Error(`Unexpected scenario: sprint ${sprintId} does not exist`);
                } else {
                    const matchingItems = sprint.items.filter((item) => item.id === backlogItemId);
                    if (matchingItems.length === 1) {
                        const backlogItem = matchingItems[0];
                        const patchObj = actionTyped.payload.patchObj;
                        Object.keys(patchObj).forEach((key) => {
                            backlogItem[key] = patchObj[key];
                        });
                    } else {
                        throw Error(
                            `Unexpected scenario: should be a single backlog item matching ${backlogItemId}, ` +
                                `there were ${matchingItems.length}`
                        );
                    }
                }

                return;
            }
            case ActionTypes.API_DELETE_SPRINT_BACKLOG_ITEM_FAILURE: {
                // TODO: Handle failure - it may not be here though, probably needs to be at app level for message?
                return;
            }
            case ActionTypes.SET_SPRINT_PLANNING_ARCHIVED_FILTER: {
                const actionTyped = action as ChangeSprintPlanningArchivedFilterAction;
                if (draft.includeArchivedSprints !== actionTyped.payload.includeArchived) {
                    draft.includeArchivedSprints = actionTyped.payload.includeArchived;
                }
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsPlanSuccessAction;
                const { payload } = actionTyped;
                const sprintBacklogItems = payload.response.data.sprintBacklogItems;
                const expandedSprintId = payload.response.data.expandedSprintId;
                if (expandedSprintId) {
                    addSprintBacklogItems(draft, expandedSprintId, sprintBacklogItems);
                }
                return;
            }
            case ActionTypes.API_POST_SPRINT_BACKLOG_ITEM_PART_REQUEST: {
                draft.splitInProgress = true;
                return;
            }
            case ActionTypes.API_POST_SPRINT_BACKLOG_ITEM_PART_SUCCESS: {
                const actionTyped = action as ApiSplitSprintItemSuccessAction;
                const totalParts = actionTyped.payload.response.data.extra.backlogItem.totalParts;
                const backlogItemId = actionTyped.payload.response.data.extra.backlogItem.id;
                Object.keys(draft.sprints).forEach((sprintKey) => {
                    const sprint = draft.sprints[sprintKey];
                    const isBacklogItemInSprint = sprint.backlogItemsInSprint[backlogItemId];
                    if (isBacklogItemInSprint) {
                        sprint.items.forEach((backlogItem) => {
                            if (backlogItem.id === backlogItemId) {
                                backlogItem.totalParts = totalParts;
                            }
                        });
                    }
                });
                const sprintId = actionTyped.meta.actionParams.sprintId;
                linkBacklogItemToSprint(draft, sprintId, backlogItemId);
                draft.splitInProgress = false;
                draft.openedDetailMenuBacklogItemId = null;
                return;
            }
            case ActionTypes.API_POST_SPRINT_BACKLOG_ITEM_PART_FAILURE: {
                draft.splitInProgress = false;
                draft.openedDetailMenuBacklogItemId = null;
                return;
            }
            case ActionTypes.API_POST_ACTION_JOIN_UNALLOCATED_BACKLOG_ITEM_PARTS_SUCCESS: {
                const actionTyped = action as ApiJoinUnallocatedBacklogItemPartsSuccessAction;
                const apiBacklogItem = actionTyped.payload.response.data.item;
                const backlogItemId = apiBacklogItem.id;
                const apiBacklogItemPartsBySprintId: { [sprintId: string]: ApiBacklogItemPartWithSprintId } = {};
                const apiExtraData = actionTyped.payload.response.data.extra;
                apiExtraData.backlogItemPartsWithSprintId.forEach((apiBacklogItemPartWithSprintId) => {
                    const sprintId = apiBacklogItemPartWithSprintId.sprintId;
                    if (sprintId) {
                        apiBacklogItemPartsBySprintId[sprintId] = apiBacklogItemPartWithSprintId;
                    }
                });
                Object.keys(draft.sprints).forEach((sprintId) => {
                    const sprint = draft.sprints[sprintId];
                    const isBacklogItemInSprint = sprint.backlogItemsInSprint[backlogItemId];
                    if (isBacklogItemInSprint) {
                        sprint.items.forEach((sprintBacklogItem) => {
                            if (sprintBacklogItem.id === backlogItemId) {
                                const apiBacklogItemPart = apiBacklogItemPartsBySprintId[sprintId];
                                sprintBacklogItem.partIndex = apiBacklogItemPart.partIndex;
                                sprintBacklogItem.totalParts = apiBacklogItem.totalParts;
                            }
                        });
                    }
                });
                return;
            }
            case ActionTypes.APP_CLICK: {
                const actionTyped = action as AppClickAction;
                const parent = actionTyped.payload.parent;
                const hideMenu = shouldHideDetailMenu(
                    parent?.dataClass,
                    parent?.itemId,
                    parent?.itemType,
                    draft.openedDetailMenuBacklogItemId
                );
                if (hideMenu) {
                    draft.openedDetailMenuBacklogItemId = null;
                }

                return;
            }
            default:
                return;
        }
    });
