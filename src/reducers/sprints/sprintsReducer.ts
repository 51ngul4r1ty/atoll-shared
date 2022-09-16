// externals
import { produce } from "immer";

// interfaces/types
import type { AnyFSA } from "../../types/reactHelperTypes";
import type { ApiGetBffViewsPlanSuccessAction } from "../../actions/apiBffViewsPlan";
import type { ApiGetSprintBacklogItemsSuccessAction, ApiSplitSprintItemSuccessAction } from "../../actions/apiSprintBacklog";
import {
    AddSprintAction,
    CancelEditSprintAction,
    CancelUnsavedSprintAction,
    CollapseSprintPanelAction,
    EditSprintAction,
    ExpandSprintPanelAction,
    ShowSprintRangeDatePickerAction,
    ToggleSprintDetailAction,
    UpdateSprintFieldsAction
} from "../../actions/sprintActions";
import type {
    ApiSetSprintArchiveFlagSuccessAction,
    ApiDeleteSprintSuccessAction,
    ApiGetSprintsSuccessAction,
    ApiPostSprintSuccessAction,
    ApiPutSprintSuccessAction
} from "../../actions/apiSprints";
import type {
    EditableSprint,
    OriginalSprintData,
    SaveableSprint,
    Sprint,
    SprintOpenedDatePickerInfo,
    SprintWithSource
} from "./sprintsReducerTypes";

// consts/enums
import * as ActionTypes from "../../actions/actionTypes";
import { NewSprintPosition } from "../../actions/sprintActions";

// components
import { SprintDetailShowingPicker } from "../../components/organisms/forms/SprintDetailForm";

// actions
import { AppClickAction } from "../../actions/appActions";
import { UpdateSprintStatsAction } from "../../actions/sprintActions";
import { ShowSprintBacklogItemDetailAction } from "../../actions/sprintBacklogActions";

// utils
import { calcToggledOpenMenuItemId } from "../../utils/dropdownMenuUtils";
import { mapApiItemsToSprints } from "../../mappers/sprintMappers";
import { shouldHideDetailMenu } from "../../components/utils/itemDetailMenuUtils";
import {
    rebuildAllItems,
    markBacklogItemsLoaded,
    getSprintById,
    updateSprintById,
    idsMatch,
    updateItemFieldsInAllItems,
    removeSprint,
    updateStateToHideDatePicker,
    updateSprintFromPayload
} from "./sprintsReducerHelper";
import * as logger from "../../utils/logger";

export type SprintsState = Readonly<{
    addedItems: SaveableSprint[];
    allItems: SprintWithSource[];
    archivedSprintCount: number | null;
    items: EditableSprint[];
    openedDatePickerInfo: SprintOpenedDatePickerInfo;
    openedDetailMenuSprintId: string | null;
    originalData: OriginalSprintData;
    splitToNextSprintAvailable: boolean;
    totalSprintCount: number | null;
}>;

export const sprintsReducerInitialState = Object.freeze<SprintsState>({
    addedItems: [],
    allItems: [],
    items: [],
    openedDetailMenuSprintId: null,
    originalData: {},
    openedDatePickerInfo: {
        sprintId: null,
        showPicker: SprintDetailShowingPicker.None
    },
    splitToNextSprintAvailable: false,
    totalSprintCount: null,
    archivedSprintCount: null
});

export const sprintsReducer = (state: SprintsState = sprintsReducerInitialState, action: AnyFSA): SprintsState => {
    const functionTag = "sprintReducer";
    return produce(state, (draft) => {
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
                rebuildAllItems(draft);
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
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.API_GET_BFF_VIEWS_PLAN_SUCCESS: {
                const actionTyped = action as ApiGetBffViewsPlanSuccessAction;
                const projectStats = actionTyped.payload.response.data.projectStats;
                draft.totalSprintCount = projectStats?.totalSprintCount || null;
                draft.archivedSprintCount = projectStats?.archivedSprintCount || null;
                const { payload } = actionTyped;
                const sprintsFromApi = mapApiItemsToSprints(payload.response.data.sprints);
                const expandedSprintId = payload.response.data.expandedSprintId;
                const sprints: Sprint[] = [];
                sprintsFromApi.forEach((sprintFromApi) => {
                    sprints.push({
                        ...sprintFromApi,
                        expanded: sprintFromApi.id === expandedSprintId
                    });
                });
                draft.items = sprints;
                markBacklogItemsLoaded(draft, expandedSprintId);
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.API_GET_SPRINTS_SUCCESS: {
                const actionTyped = action as ApiGetSprintsSuccessAction;
                const { payload } = actionTyped;
                draft.addedItems = [];
                draft.items = mapApiItemsToSprints(payload.response.data.items);
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.API_GET_SPRINT_BACKLOG_ITEMS_SUCCESS: {
                const actionTyped = action as ApiGetSprintBacklogItemsSuccessAction;
                const sprintId = actionTyped.meta.actionParams.sprintId;
                if (!draft.items) {
                    return;
                }
                markBacklogItemsLoaded(draft, sprintId);
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.ADD_SPRINT: {
                const actionTyped = action as AddSprintAction;
                const position = actionTyped.payload.position;
                const newItem = actionTyped.payload.sprint;
                if (position === NewSprintPosition.Before) {
                    draft.addedItems = [newItem, ...draft.addedItems];
                } else if (position === NewSprintPosition.After) {
                    draft.addedItems = [...draft.addedItems, newItem];
                } else {
                    throw Error(`Unexpected ${position}`);
                }
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.EDIT_SPRINT: {
                const actionTyped = action as EditSprintAction;
                const sprintId = actionTyped.payload.sprintId;

                const sprint = getSprintById(draft as SprintsState, sprintId);
                draft.originalData[sprintId] = sprint;

                updateSprintById(draft, sprintId, (item) => {
                    item.editing = true;
                });
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.CANCEL_UNSAVED_SPRINT: {
                const actionTyped = action as CancelUnsavedSprintAction;
                const newItems = [];
                draft.addedItems.forEach((addedItem) => {
                    if (addedItem.instanceId !== actionTyped.payload.instanceId) {
                        newItems.push(addedItem);
                    }
                });
                draft.addedItems = newItems;
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.CANCEL_EDIT_SPRINT: {
                const actionTyped = action as CancelEditSprintAction;
                const sprintId = actionTyped.payload.itemId;

                const originalSprintData = draft.originalData[sprintId];
                updateSprintById(draft, actionTyped.payload.itemId, (item) => {
                    item.editing = false;
                    item.name = originalSprintData.name;
                    item.startDate = originalSprintData.startDate.clone();
                    item.finishDate = originalSprintData.finishDate.clone();
                });
                delete draft.originalData[sprintId];
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.UPDATE_SPRINT_FIELDS: {
                const actionTyped = action as UpdateSprintFieldsAction;
                draft.addedItems.forEach((addedItem) => {
                    if (idsMatch(addedItem as SaveableSprint, actionTyped.payload)) {
                        updateSprintFromPayload(addedItem as SaveableSprint, actionTyped.payload);
                    }
                });
                draft.items.forEach((item) => {
                    if (idsMatch(item as EditableSprint, actionTyped.payload)) {
                        updateSprintFromPayload(item as EditableSprint, actionTyped.payload);
                    }
                });
                updateItemFieldsInAllItems(draft, actionTyped.payload);
                return;
            }
            case ActionTypes.API_POST_SPRINT_SUCCESS: {
                const actionTyped = action as ApiPostSprintSuccessAction;
                const { payload, meta } = actionTyped;
                const updatedSprint = payload.response.data.item;
                const instanceId = meta.instanceId;
                draft.addedItems.forEach((addedItem) => {
                    if (addedItem.instanceId === instanceId) {
                        addedItem.id = updatedSprint.id;
                        addedItem.saved = true;
                    }
                });
                draft.totalSprintCount += 1;
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.TOGGLE_SPRINT_ITEM_DETAIL: {
                const actionTyped = action as ToggleSprintDetailAction;
                const sprintId = actionTyped.payload.sprintId;
                const strictMode = actionTyped.payload.strictMode;
                draft.openedDetailMenuSprintId = calcToggledOpenMenuItemId(draft.openedDetailMenuSprintId, sprintId, strictMode);
                return;
            }
            case ActionTypes.APP_CLICK: {
                const actionTyped = action as AppClickAction;
                const parent = actionTyped.payload.parent;
                const hideMenu = shouldHideDetailMenu(
                    parent?.dataClass,
                    parent?.itemId,
                    parent?.itemType,
                    draft.openedDetailMenuSprintId
                );
                if (hideMenu) {
                    draft.openedDetailMenuSprintId = null;
                }
                return;
            }
            case ActionTypes.API_DELETE_SPRINT_SUCCESS: {
                const actionTyped = action as ApiDeleteSprintSuccessAction;
                const id = actionTyped.meta.originalActionArgs.sprintId;
                const archived = actionTyped.payload.response.data.item.archived;
                removeSprint(draft, id, archived);
                return;
            }
            case ActionTypes.API_SET_SPRINT_ARCHIVE_FLAG_SUCCESS: {
                const blockTag = "API_SET_SPRINT_ARCHIVE_FLAG_SUCCESS";
                const actionTyped = action as ApiSetSprintArchiveFlagSuccessAction;
                const meta = actionTyped.meta;
                const id = meta.originalActionArgs.sprintId;
                let found = false;
                draft.items.forEach((item) => {
                    if (item.id === id) {
                        item.archived = meta.originalActionArgs.archived;
                        found = true;
                    }
                });
                if (!found) {
                    draft.addedItems.forEach((item) => {
                        if (item.id === id) {
                            item.archived = meta.originalActionArgs.archived;
                            found = true;
                        }
                    });
                }
                if (!found) {
                    logger.warn(`unable to find archived item with ID "${id}" to update archive status`, [functionTag, blockTag]);
                }
                const isArchivedNow = actionTyped.payload.response.data.item.archived;
                if (!draft.archivedSprintCount) {
                    draft.archivedSprintCount = 0;
                }
                if (isArchivedNow) {
                    draft.archivedSprintCount += 1;
                } else {
                    draft.archivedSprintCount -= 1;
                }
                rebuildAllItems(draft);
                draft.openedDetailMenuSprintId = null;
                return;
            }
            case ActionTypes.UPDATE_SPRINT_STATS: {
                const actionTyped = action as UpdateSprintStatsAction;
                const sprintId = actionTyped.payload.sprintId;
                const newSprintStats = actionTyped.payload.sprintStats;
                let changed = false;
                draft.items.forEach((item) => {
                    if (item.id === sprintId) {
                        if (item.plannedPoints !== newSprintStats.plannedPoints) {
                            item.plannedPoints = newSprintStats.plannedPoints;
                            changed = true;
                        }
                        if (item.acceptedPoints !== newSprintStats.acceptedPoints) {
                            item.acceptedPoints = newSprintStats.acceptedPoints;
                            changed = true;
                        }
                        if (item.totalPoints !== newSprintStats.totalPoints) {
                            item.totalPoints = newSprintStats.totalPoints;
                            changed = true;
                        }
                    }
                });
                if (changed) {
                    rebuildAllItems(draft);
                }
                return;
            }
            case ActionTypes.API_PUT_SPRINT_SUCCESS: {
                const actionTyped = action as ApiPutSprintSuccessAction;
                const sprintId = actionTyped.payload.response.data.item.id;
                updateSprintById(draft, sprintId, (item) => {
                    item.editing = false;
                    item.saved = true;
                });
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.SHOW_SPRINT_RANGE_DATE_PICKER: {
                const actionTyped = action as ShowSprintRangeDatePickerAction;
                draft.openedDatePickerInfo = {
                    sprintId: actionTyped.payload.sprintId,
                    showPicker: actionTyped.payload.showPicker
                };
                return;
            }
            case ActionTypes.HIDE_SPRINT_RANGE_DATE_PICKER: {
                updateStateToHideDatePicker(draft);
                return;
            }
            case ActionTypes.API_PUT_SPRINT_FAILURE: {
                updateStateToHideDatePicker(draft);
                return;
            }
            case ActionTypes.API_POST_SPRINT_BACKLOG_ITEM_PART_SUCCESS: {
                const actionTyped = action as ApiSplitSprintItemSuccessAction;
                const extra = actionTyped.payload.response.data.extra;
                const sprintStats = extra.sprintStats;
                const sprintId = extra.sprintBacklogItem.sprintId;
                updateSprintById(draft, sprintId, (item) => {
                    item.totalPoints = sprintStats.totalPoints;
                    item.acceptedPoints = sprintStats.acceptedPoints;
                    item.plannedPoints = sprintStats.plannedPoints;
                });
                rebuildAllItems(draft);
                return;
            }
            case ActionTypes.SHOW_SPRINT_BACKLOG_ITEM_DETAIL: {
                const actionTyped = action as ShowSprintBacklogItemDetailAction;
                draft.splitToNextSprintAvailable = actionTyped.payload.splitToNextSprintAvailable;
                return;
            }
            case ActionTypes.HIDE_SPRINT_BACKLOG_ITEM_DETAIL: {
                // NOTE: although this shouldn't be necessary we reset it back to "factory defaults" to be safe.
                draft.splitToNextSprintAvailable = sprintsReducerInitialState.splitToNextSprintAvailable;
                return;
            }
            case ActionTypes.API_POST_SPRINT_SUCCESS: {
                draft.totalSprintCount += 1;
                return;
            }
        }
    });
};
