// externals
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";

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

// selectors
import * as userSelectors from "../selectors/userSelectors";
import * as sprintSelectors from "../selectors/sprintSelectors";
import * as backlogItemSelectors from "../selectors/backlogItemSelectors";
import * as appSelectors from "../selectors/appSelectors";
import * as sprintBacklogSelectors from "../selectors/sprintBacklogSelectors";

// utils
import { isPlatformWindows } from "../utils";
import { buildCurrentViewInitializationAction } from "../utils/initializer";

const mapStateToProps = (state: StateTree): PlanViewStateProps => {
    const allItems = backlogItemSelectors.getAllBacklogItems(state);
    const archivedSprintCount = sprintSelectors.getArchivedSprintCount(state);
    const includeArchivedSprints = sprintBacklogSelectors.getIncludeArchivedSprints(state);
    const sprints = sprintSelectors.getPlanViewSprints(state, includeArchivedSprints);
    const initAction = buildCurrentViewInitializationAction(state);
    let result: PlanViewStateProps = {
        initAction,
        archivedSprintCount,
        allItems,
        busyJoiningUnallocatedParts: backlogItemSelectors.isBusyJoiningUnallocatedParts(state),
        busySplittingStory: sprintBacklogSelectors.isSplitInProgress(state),
        editMode: appSelectors.getAppEditMode(state),
        electronClient: appSelectors.getElectronClient(state),
        includeArchivedSprints,
        loading: appSelectors.isPlanViewLoading(state),
        errorMessage: appSelectors.isPlanViewError(state)
            ? "An error occurred while loading this view - please refresh browser to retry or contact a support person to assist"
            : null,
        openedDetailMenuBacklogItemId: backlogItemSelectors.getProductBacklogOpenedDetailMenuItemId(state),
        openedDetailMenuSprintBacklogInfo: sprintBacklogSelectors.getSprintBacklogOpenedDetailMenuInfo(state),
        openingDetailMenuSprintBacklogInfo: sprintBacklogSelectors.getSprintBacklogOpeningDetailMenuInfo(state),
        openedDetailMenuSprintId: sprintSelectors.getOpenedDetailMenuSprintId(state),
        openedDatePickerInfo: sprintSelectors.getOpenedDatePickerInfo(state),
        splitToNextSprintAvailable: sprintSelectors.getSplitToNextSprintAvailable(state),
        projectId: userSelectors.getCurrentProjectId(state),
        selectedProductBacklogItemCount: backlogItemSelectors.getSelectedBacklogItemCount(state),
        sprintsToDisableAddItemAction: sprintBacklogSelectors.getSprintsToDisableAddItemsAction(state),
        showWindowTitleBar: !isPlatformWindows(),
        sprints,
        strictMode: appSelectors.isStrictMode(state)
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): PlanViewDispatchProps => {
    return {
        onLoaded: (initAction: Action) => {
            dispatch(initAction);
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
        onSprintDetailClick: (sprintId: string, strictMode: boolean) => dispatch(sprintDetailClick(sprintId, strictMode)),
        onItemDetailClick: (sprintId: string, backlogItemId: string, strictMode: boolean) =>
            dispatch(sprintBacklogItemDetailClick(sprintId, backlogItemId, strictMode)),
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
