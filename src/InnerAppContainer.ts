// externals
import { connect } from "react-redux";

// components
import { InnerApp, InnerAppEventProps, InnerAppAttributeProps } from "./InnerApp";
import { StateTree } from "./types";

// actions
import { getBacklogItems } from "./actions/backlogItems";
import { Dispatch } from "redux";
import { BacklogItem } from "./components/panels/BacklogItemPlanningPanel";

const mapStateToProps = (state: StateTree): InnerAppAttributeProps => {
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
    let result: InnerAppAttributeProps = {
        backlogItems
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): InnerAppEventProps => {
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

export default connect(mapStateToProps, mapDispatchToProps)(InnerApp);
