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
import * as userSelectors from "../selectors/userSelectors";
import * as sprintSelectors from "../selectors/sprintSelectors";
import * as backlogItemSelectors from "../selectors/backlogItemSelectors";
import * as appSelectors from "../selectors/appSelectors";
import * as sprintBacklogSelectors from "../selectors/sprintBacklogSelectors";

const mapStateToProps = (state: StateTree): PlanViewStateProps => {
    const allItems = backlogItemSelectors.getAllBacklogItems(state);
    const includeArchivedSprints = sprintBacklogSelectors.getIncludeArchivedSprints(state);
    const sprints = sprintSelectors.getPlanViewSprints(state, includeArchivedSprints);
    let result: PlanViewStateProps = {
        allItems,
        busySplittingStory: sprintBacklogSelectors.isSplitInProgress(state),
        editMode: appSelectors.getAppEditMode(state),
        electronClient: appSelectors.getElectronClient(state),
        includeArchivedSprints,
        loading: appSelectors.isPlanViewLoading(state),
        openedDetailMenuBacklogItemId: backlogItemSelectors.getOpenedDetailMenuBacklogItemId(state),
        openedDetailMenuSprintBacklogInfo: sprintBacklogSelectors.getOpenedDetailMenuInfo(state),
        openingDetailMenuSprintBacklogInfo: sprintBacklogSelectors.getOpeningDetailMenuInfo(state),
        openedDetailMenuSprintId: sprintSelectors.getOpenedDetailMenuSprintId(state),
        openedDatePickerInfo: sprintSelectors.getOpenedDatePickerInfo(state),
        projectId: userSelectors.getCurrentProjectId(state),
        selectedProductBacklogItemCount: backlogItemSelectors.getSelectedBacklogItemCount(state),
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
