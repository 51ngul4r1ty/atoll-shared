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
    sprintDetailClicked
} from "../actions/sprintActions";
import { apiBffViewsPlan } from "../actions/apiBffViewsPlan";
import {
    changeSprintPlanningArchivedFilter,
    moveSelectedBacklogItemsToSprintUsingApi,
    sprintBacklogItemAcceptedClicked,
    sprintBacklogItemDetailClicked,
    sprintBacklogItemDoneClicked,
    sprintBacklogItemInProgressClicked,
    sprintBacklogItemNotStartedClicked,
    sprintBacklogItemReleasedClicked,
    sprintMoveItemToBacklogClicked
} from "../actions/sprintBacklogActions";

// interfaces/types
import { BacklogItemType } from "../types/backlogItemTypes";

// utils
import { isPlatformWindows } from "../utils";

// selectors
import { getCurrentProjectId } from "../selectors/userSelectors";
import { getOpenedDetailMenuSprintId, getPlanViewSprints } from "../selectors/sprintSelectors";
import {
    getAllBacklogItems,
    getOpenedDetailMenuBacklogItemId,
    getSelectedBacklogItemCount
} from "../selectors/backlogItemSelectors";
import { getAppEditMode, getElectronClient } from "../selectors/appSelectors";
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
        openedDetailMenuBacklogItemId: getOpenedDetailMenuBacklogItemId(state),
        openedDetailMenuSprintBacklogInfo: getOpenedDetailMenuInfo(state),
        openedDetailMenuSprintId: getOpenedDetailMenuSprintId(state),
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
        onAddNewBacklogItemForm: (type: BacklogItemType) => dispatch(addNewBacklogItemForm(type)),
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
        onSprintDetailClicked: (sprintId: string) => dispatch(sprintDetailClicked(sprintId)),
        onItemDetailClicked: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintBacklogItemDetailClicked(sprintId, backlogItemId)),
        onMoveItemToBacklogClicked: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintMoveItemToBacklogClicked(sprintId, backlogItemId)),
        onBacklogItemAcceptedClicked: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintBacklogItemAcceptedClicked(sprintId, backlogItemId)),
        onBacklogItemDoneClicked: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintBacklogItemDoneClicked(sprintId, backlogItemId)),
        onBacklogItemInProgressClicked: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintBacklogItemInProgressClicked(sprintId, backlogItemId)),
        onBacklogItemNotStartedClicked: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintBacklogItemNotStartedClicked(sprintId, backlogItemId)),
        onBacklogItemReleasedClicked: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintBacklogItemReleasedClicked(sprintId, backlogItemId))
    };
};

export const PlanViewContainer = connect(mapStateToProps, mapDispatchToProps)(PlanView);
