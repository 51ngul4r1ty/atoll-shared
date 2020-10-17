// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { PlanView, PlanViewStateProps, PlanViewDispatchProps } from "./PlanView";

// state
import { StateTree } from "./types";

// actions
import { apiGetBacklogItems } from "./actions/apiBacklogItems";
import { addNewBacklogItem, reorderBacklogItems } from "./actions/backlogItems";

// interfaces/types
import { BacklogItemType } from "./reducers/backlogItems/backlogItemsReducerTypes";

// utils
import { isPlatformWindows } from "./utils";

// selectors
import { getCurrentProjectId } from "./selectors/userSelectors";
import { apiBffViewsPlan } from "./actions/apiBffViewsPlan";
import { getPlanViewSprints } from "./selectors/sprintSelectors";
import { getAllBacklogItems } from "./selectors/backlogItemSelectors";

const mapStateToProps = (state: StateTree): PlanViewStateProps => {
    const allItems = getAllBacklogItems(state);
    const sprints = getPlanViewSprints(state);
    let result: PlanViewStateProps = {
        allItems,
        editMode: state.app.editMode,
        openedDetailMenuBacklogItemId: state.backlogItems.openedDetailMenuBacklogItemId,
        electronClient: state.app.electronClient,
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
        onReorderBacklogItems: (sourceItemId: string, targetItemId: string) =>
            dispatch(reorderBacklogItems(sourceItemId, targetItemId))
    };
};

export const PlanViewContainer = connect(mapStateToProps, mapDispatchToProps)(PlanView);
