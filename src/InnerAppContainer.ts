// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { push } from "connected-react-router";

// components
import { InnerApp, InnerAppDispatchProps, InnerAppStateProps } from "./InnerApp";
import { BacklogItem } from "./components/organisms/panels/BacklogItemPlanningPanel";

// state
import { StateTree } from "./types";

// actions
import { getBacklogItems } from "./actions/backlogItems";
import { setEditMode } from "./actions/appActions";

// interfaces/types
import { EditMode } from "./components/molecules/buttons/EditButton";

const mapStateToProps = (state: StateTree): InnerAppStateProps => {
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
    let result: InnerAppStateProps = {
        backlogItems,
        editMode: state.app.editMode
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): InnerAppDispatchProps => {
    return {
        onLoaded: () => dispatch(getBacklogItems()),
        onChangeTab: (tabId: string) => {
            switch (tabId) {
                case "plan":
                    dispatch(push("/plan"));
                    break;
                case "sprint":
                    dispatch(push("/sprint"));
                    break;
                case "review":
                    dispatch(push("/review"));
                    break;
            }
        },
        setEditMode: (editMode: EditMode) => {
            dispatch(setEditMode(editMode));
        }
    };
};

// const AppContainer = withRouter(
//     connect(
//         mapStateToProps,
//         mapDispatchToProps
//     )(App)
// ); // withTranslation()<any>(App));

export default connect(mapStateToProps, mapDispatchToProps)(InnerApp);
