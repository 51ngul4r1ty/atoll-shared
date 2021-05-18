// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { PlanView, PlanViewStateProps, PlanViewDispatchProps } from "./PlanView";

// state
import { StateTree } from "../reducers/rootReducer";

// actions
import { addNewBacklogItemForm, reorderBacklogItems } from "../actions/backlogItemActions";
import {
    addNewSprintForm,
    collapseSprintPanel,
    expandSprintPanel,
    NewSprintPosition,
    sprintDetailClick
} from "../actions/sprintActions";
import { apiBffViewsPlan } from "../actions/apiBffViewsPlan";
import {
    changeSprintPlanningArchivedFilter,
    moveSelectedBacklogItemsToSprintUsingApi,
    sprintBacklogItemAcceptedClick,
    sprintBacklogItemDetailClick,
    sprintBacklogItemDoneClick,
    sprintBacklogItemIdClick,
    sprintBacklogItemInProgressClick,
    sprintBacklogItemNotStartedClick,
    sprintBacklogItemReleasedClick,
    sprintMoveItemToBacklogClick,
    sprintSplitBacklogItemClick
} from "../actions/sprintBacklogActions";

// interfaces/types
import { BacklogItemType } from "../types/backlogItemTypes";

// utils
import { isPlatformWindows } from "../utils";

// selectors
import { getCurrentProjectId } from "../selectors/userSelectors";
import { getOpenedDatePickerInfo, getOpenedDetailMenuSprintId, getPlanViewSprints } from "../selectors/sprintSelectors";
import {
    getAllBacklogItems,
    getOpenedDetailMenuBacklogItemId,
    getSelectedBacklogItemCount
} from "../selectors/backlogItemSelectors";
import { getAppEditMode, getElectronClient, isPlanViewLoading } from "../selectors/appSelectors";
import { getIncludeArchivedSprints, getOpenedDetailMenuInfo } from "../selectors/sprintBacklogSelectors";

const mapStateToProps = (state: StateTree): PlanViewStateProps => {
    const allItems = getAllBacklogItems(state);
    const includeArchivedSprints = getIncludeArchivedSprints(state);
    const sprints = getPlanViewSprints(state, includeArchivedSprints);
    let result: PlanViewStateProps = {
        allItems,
        editMode: getAppEditMode(state),
        electronClient: getElectronClient(state),
        includeArchivedSprints,
        loading: isPlanViewLoading(state),
        openedDetailMenuBacklogItemId: getOpenedDetailMenuBacklogItemId(state),
        openedDetailMenuSprintBacklogInfo: getOpenedDetailMenuInfo(state),
        openedDetailMenuSprintId: getOpenedDetailMenuSprintId(state),
        openedDatePickerInfo: getOpenedDatePickerInfo(state),
        projectId: getCurrentProjectId(state),
        selectedProductBacklogItemCount: getSelectedBacklogItemCount(state),
        showWindowTitleBar: !isPlatformWindows(),
        sprints
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): PlanViewDispatchProps => {
    return {
        onLoaded: () => {
            dispatch(apiBffViewsPlan());
        },
        onAddNewBacklogItemForm: (type: BacklogItemType, projectId: string) => dispatch(addNewBacklogItemForm(type, projectId)),
        onAddBacklogItemToSprint: (sprintId: string) => dispatch(moveSelectedBacklogItemsToSprintUsingApi(sprintId)),
        onAddNewSprintForm: (position: NewSprintPosition) => dispatch(addNewSprintForm(position)),
        onArchivedFilterChange: (checked: boolean) => {
            dispatch(changeSprintPlanningArchivedFilter(checked));
        },
        onReorderBacklogItems: (sourceItemId: string, targetItemId: string) =>
            dispatch(reorderBacklogItems(sourceItemId, targetItemId)),
        onExpandCollapse: (sprintId: string, expand: boolean) => {
            if (expand) {
                dispatch(expandSprintPanel(sprintId));
            } else {
                dispatch(collapseSprintPanel(sprintId));
            }
        },
        onSprintDetailClick: (sprintId: string) => dispatch(sprintDetailClick(sprintId)),
        onItemDetailClick: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintBacklogItemDetailClick(sprintId, backlogItemId)),
        onBacklogItemIdClick: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintBacklogItemIdClick(sprintId, backlogItemId)),
        onMoveItemToBacklogClick: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintMoveItemToBacklogClick(sprintId, backlogItemId)),
        onSplitBacklogItemClick: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintSplitBacklogItemClick(sprintId, backlogItemId)),
        onBacklogItemAcceptedClick: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintBacklogItemAcceptedClick(sprintId, backlogItemId)),
        onBacklogItemDoneClick: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintBacklogItemDoneClick(sprintId, backlogItemId)),
        onBacklogItemInProgressClick: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintBacklogItemInProgressClick(sprintId, backlogItemId)),
        onBacklogItemNotStartedClick: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintBacklogItemNotStartedClick(sprintId, backlogItemId)),
        onBacklogItemReleasedClick: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintBacklogItemReleasedClick(sprintId, backlogItemId))
    };
};

export const PlanViewContainer = connect(mapStateToProps, mapDispatchToProps)(PlanView);
