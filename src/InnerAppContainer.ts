// externals
import { connect } from "react-redux";

// components
import { InnerApp, InnerAppDispatchProps, InnerAppStateProps } from "./InnerApp";
import { StateTree } from "./types";

// actions
import { getBacklogItems } from "./actions/backlogItems";
import { Dispatch } from "redux";
import { BacklogItem } from "./components/organisms/panels/BacklogItemPlanningPanel";
import { getHistoryInstance } from "./config";

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
        backlogItems
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): InnerAppDispatchProps => {
    return {
        onLoaded: () => dispatch(getBacklogItems()),
        onChangeTab: (tabId: string) => {
            const history = getHistoryInstance();
            switch (tabId) {
                case "plan":
                    dispatch(history.push("/plan"));
                    break;
                case "sprint":
                    dispatch(history.push("/sprint"));
                    break;
                case "review":
                    dispatch(history.push("/review"));
                    break;
            }
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
