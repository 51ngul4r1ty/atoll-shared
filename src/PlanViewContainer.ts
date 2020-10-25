// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { PlanView, PlanViewStateProps, PlanViewDispatchProps } from "./PlanView";

// state
import { StateTree } from "./reducers/rootReducer";

// actions
import { addNewBacklogItem, reorderBacklogItems } from "./actions/backlogItemActions";
import { addNewSprint, collapseSprintPanel, expandSprintPanel } from "./actions/sprintActions";
import { apiBffViewsPlan } from "./actions/apiBffViewsPlan";

// interfaces/types
import { BacklogItemType } from "./types/backlogItemTypes";

// utils
import { isPlatformWindows } from "./utils";

// selectors
import { getCurrentProjectId } from "./selectors/userSelectors";
import { getPlanViewSprints } from "./selectors/sprintSelectors";
import { getAllBacklogItems, getSelectedBacklogItemCount } from "./selectors/backlogItemSelectors";
import { addBacklogItemToSprint } from "./actions/sprintBacklogActions";

const mapStateToProps = (state: StateTree): PlanViewStateProps => {
    const allItems = getAllBacklogItems(state);
    const sprints = getPlanViewSprints(state);
    let result: PlanViewStateProps = {
        allItems,
        // TODO: Convert this to a selector
        editMode: state.app.editMode,
        // TODO: Convert this to a selector
        openedDetailMenuBacklogItemId: state.backlogItems.openedDetailMenuBacklogItemId,
        // TODO: Convert this to a selector
        electronClient: state.app.electronClient,
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
        onAddNewBacklogItem: (type: BacklogItemType) => dispatch(addNewBacklogItem(type)),
        onAddBacklogItemToSprint: (sprintId: string) => dispatch(addBacklogItemToSprint(sprintId)),
        onAddNewSprint: () => dispatch(addNewSprint()),
        onReorderBacklogItems: (sourceItemId: string, targetItemId: string) =>
            dispatch(reorderBacklogItems(sourceItemId, targetItemId)),
        onExpandCollapse: (sprintId: string, expand: boolean) => {
            if (expand) {
                dispatch(expandSprintPanel(sprintId));
            } else {
                dispatch(collapseSprintPanel(sprintId));
            }
        }
    };
};

export const PlanViewContainer = connect(mapStateToProps, mapDispatchToProps)(PlanView);
