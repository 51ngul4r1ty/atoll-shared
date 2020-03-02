// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { PlanView, PlanViewStateProps, PlanViewDispatchProps } from "./PlanView";
import { PlanningPanelBacklogItem } from "./components/organisms/panels/BacklogItemPlanningPanel";

// state
import { StateTree, BacklogItemType, BacklogItem } from "./types";

// actions
import { getBacklogItems, addNewBacklogItem } from "./actions/backlogItems";
import { setEditMode } from "./actions/appActions";

// interfaces/types
import { EditMode } from "./components/molecules/buttons/EditButton";

const buildBacklogItem = (item: BacklogItem): PlanningPanelBacklogItem => {
    const result: PlanningPanelBacklogItem = {
        estimate: item.estimate,
        externalId: item.externalId,
        id: item.id,
        storyPhrase: item.storyPhrase,
        rolePhrase: item.rolePhrase,
        reasonPhrase: item.reasonPhrase,
        type: item.type,
        editing: false
    };
    return result;
};

const mapStateToProps = (state: StateTree): PlanViewStateProps => {
    const addedBacklogItems: PlanningPanelBacklogItem[] = state.backlogItems.addedItems.map((item) => {
        return { ...buildBacklogItem(item), editing: true };
    });
    const backlogItems: PlanningPanelBacklogItem[] = state.backlogItems.items.map((item) => buildBacklogItem(item));
    let result: PlanViewStateProps = {
        addedBacklogItems,
        backlogItems,
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

// const AppContainer = withRouter(
//     connect(
//         mapStateToProps,
//         mapDispatchToProps
//     )(App)
// ); // withTranslation()<any>(App));

export const PlanViewContainer = connect(mapStateToProps, mapDispatchToProps)(PlanView);
