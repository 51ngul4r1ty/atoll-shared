// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { PlanView, PlanViewStateProps, PlanViewDispatchProps } from "./PlanView";
import { BacklogItem } from "./components/organisms/panels/BacklogItemPlanningPanel";

// state
import { StateTree } from "./types";

// actions
import { getBacklogItems } from "./actions/backlogItems";
import { setEditMode } from "./actions/appActions";

// interfaces/types
import { EditMode } from "./components/molecules/buttons/EditButton";

const mapStateToProps = (state: StateTree): PlanViewStateProps => {
    const backlogItems: BacklogItem[] = state.backlogItems.items.map((item) => {
        const result: BacklogItem = {
            estimate: item.estimate,
            externalId: item.externalId,
            id: item.id,
            storyPhrase: item.storyPhrase,
            rolePhrase: item.rolePhrase,
            reasonPhrase: item.reasonPhrase,
            type: item.type
        };
        return result;
    });
    let result: PlanViewStateProps = {
        backlogItems,
        editMode: state.app.editMode
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): PlanViewDispatchProps => {
    return {
        onLoaded: () => dispatch(getBacklogItems())
    };
};

// const AppContainer = withRouter(
//     connect(
//         mapStateToProps,
//         mapDispatchToProps
//     )(App)
// ); // withTranslation()<any>(App));

export const PlanViewContainer = connect(mapStateToProps, mapDispatchToProps)(PlanView);
