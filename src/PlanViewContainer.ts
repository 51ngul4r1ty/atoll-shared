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
import { BacklogItemType } from "./reducers/backlogItemsReducer";

// utils
import { isPlatformWindows } from "./utils";
import { apiGetSprints } from "./actions/apiSprints";

// selectors
import { getCurrentProjectId } from "./selectors/userSelectors";

const mapStateToProps = (state: StateTree): PlanViewStateProps => {
    // TODO: Switch to using selectors?
    const allItems = state.backlogItems.allItems;
    // const highlightedDividers = state.backlogItems.pushedItems.map((item) => item.displayIndex);
    let result: PlanViewStateProps = {
        allItems,
        editMode: state.app.editMode,
        openedDetailMenuBacklogItemId: state.backlogItems.openedDetailMenuBacklogItemId,
        electronClient: state.app.electronClient,
        showWindowTitleBar: !isPlatformWindows(),
        projectId: getCurrentProjectId(state)
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): PlanViewDispatchProps => {
    return {
        onLoaded: (projectId: string) => {
            dispatch(apiGetBacklogItems());
            dispatch(apiGetSprints(projectId));
        },
        onAddNewBacklogItem: (type: BacklogItemType) => dispatch(addNewBacklogItem(type)),
        onReorderBacklogItems: (sourceItemId: string, targetItemId: string) =>
            dispatch(reorderBacklogItems(sourceItemId, targetItemId))
    };
};

export const PlanViewContainer = connect(mapStateToProps, mapDispatchToProps)(PlanView);
