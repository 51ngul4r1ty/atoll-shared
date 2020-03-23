// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { PlanView, PlanViewStateProps, PlanViewDispatchProps } from "./PlanView";
import { PlanningPanelBacklogItem } from "./components/organisms/panels/BacklogItemPlanningPanel";

// state
import { StateTree } from "./types";

// actions
import { getBacklogItems, addNewBacklogItem } from "./actions/backlogItems";
import { setEditMode } from "./actions/appActions";

// interfaces/types
import { BacklogItemType } from "./reducers/backlogItemsReducer";

const mapStateToProps = (state: StateTree): PlanViewStateProps => {
    // TODO: Switch to using selectors?
    const allItems = state.backlogItems.allItems;
    // const highlightedDividers = state.backlogItems.pushedItems.map((item) => item.displayIndex);
    let result: PlanViewStateProps = {
        allItems,
        highlightedDividers: [],
        editMode: state.app.editMode
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): PlanViewDispatchProps => {
    return {
        onLoaded: () => dispatch(getBacklogItems()),
        onAddNewBacklogItem: (type: BacklogItemType) => dispatch(addNewBacklogItem(type))
    };
};

export const PlanViewContainer = connect(mapStateToProps, mapDispatchToProps)(PlanView);
