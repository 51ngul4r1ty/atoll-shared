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
import { EditMode } from "./components/molecules/buttons/EditButton";
import { BacklogItemType, SaveableBacklogItem } from "./reducers/backlogItemsReducer";

const convertSaved = (saved: boolean | undefined): boolean => {
    if (saved === true) {
        return true;
    } else if (saved === false) {
        return false;
    } else {
        // default to saved if it isn't provided
        return true;
    }
};

const buildBacklogItem = (item: SaveableBacklogItem): PlanningPanelBacklogItem => {
    const result: PlanningPanelBacklogItem = {
        displayIndex: item.displayIndex,
        estimate: item.estimate,
        externalId: item.externalId,
        id: item.id,
        instanceId: item.instanceId,
        storyPhrase: item.storyPhrase,
        rolePhrase: item.rolePhrase,
        reasonPhrase: item.reasonPhrase,
        type: item.type,
        saved: convertSaved(item.saved)
    };
    return result;
};

const mapStateToProps = (state: StateTree): PlanViewStateProps => {
    const addedBacklogItems: PlanningPanelBacklogItem[] = state.backlogItems.addedItems.map((item) => {
        return { ...buildBacklogItem(item), editing: true };
    });
    const backlogItems: PlanningPanelBacklogItem[] = state.backlogItems.items.map((item) => buildBacklogItem(item));
    const highlightedDividers = state.backlogItems.pushedItems.map((item) => item.displayIndex);
    let result: PlanViewStateProps = {
        addedBacklogItems,
        backlogItems,
        highlightedDividers,
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
