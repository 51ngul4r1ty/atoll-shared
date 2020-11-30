// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { PlanView, PlanViewStateProps, PlanViewDispatchProps } from "./PlanView";

// state
import { StateTree } from "./reducers/rootReducer";

// actions
import { addNewBacklogItemForm, reorderBacklogItems } from "./actions/backlogItemActions";
import {
    addNewSprintForm,
    collapseSprintPanel,
    expandSprintPanel,
    NewSprintPosition,
    sprintDetailClicked
} from "./actions/sprintActions";
import { apiBffViewsPlan } from "./actions/apiBffViewsPlan";
import {
    moveSelectedBacklogItemsToSprintUsingApi,
    sprintBacklogItemDetailClicked,
    sprintBacklogItemDoneClicked,
    sprintMoveItemToBacklogClicked
} from "./actions/sprintBacklogActions";

// interfaces/types
import { BacklogItemType } from "./types/backlogItemTypes";

// utils
import { isPlatformWindows } from "./utils";

// selectors
import { getCurrentProjectId } from "./selectors/userSelectors";
import { getOpenedDetailMenuSprintId, getPlanViewSprints } from "./selectors/sprintSelectors";
import {
    getAllBacklogItems,
    getOpenedDetailMenuBacklogItemId,
    getSelectedBacklogItemCount
} from "./selectors/backlogItemSelectors";
import { getAppEditMode, getElectronClient } from "./selectors/appSelectors";
import { getOpenedDetailMenuInfo } from "./selectors/sprintBacklogSelectors";

const mapStateToProps = (state: StateTree): PlanViewStateProps => {
    const allItems = getAllBacklogItems(state);
    const sprints = getPlanViewSprints(state);
    let result: PlanViewStateProps = {
        allItems,
        editMode: getAppEditMode(state),
        openedDetailMenuSprintId: getOpenedDetailMenuSprintId(state),
        openedDetailMenuBacklogItemId: getOpenedDetailMenuBacklogItemId(state),
        openedDetailMenuSprintBacklogInfo: getOpenedDetailMenuInfo(state),
        electronClient: getElectronClient(state),
        selectedProductBacklogItemCount: getSelectedBacklogItemCount(state),
        showWindowTitleBar: !isPlatformWindows(),
        projectId: getCurrentProjectId(state),
        sprints
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): PlanViewDispatchProps => {
    return {
        onLoaded: (projectId: string) => {
            dispatch(apiBffViewsPlan());
        },
        onAddNewBacklogItemForm: (type: BacklogItemType) => dispatch(addNewBacklogItemForm(type)),
        onAddBacklogItemToSprint: (sprintId: string) => dispatch(moveSelectedBacklogItemsToSprintUsingApi(sprintId)),
        onAddNewSprintForm: (position: NewSprintPosition) => dispatch(addNewSprintForm(position)),
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
        onBacklogItemDoneClicked: (sprintId: string, backlogItemId: string) =>
            dispatch(sprintBacklogItemDoneClicked(sprintId, backlogItemId))
    };
};

export const PlanViewContainer = connect(mapStateToProps, mapDispatchToProps)(PlanView);
