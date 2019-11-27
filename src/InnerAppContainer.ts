// externals
import { connect } from "react-redux";

// components
import { InnerApp, InnerAppEventProps, InnerAppAttributeProps } from "./InnerApp";
import { StateTree } from "./types";

// actions
import { getBacklogItems } from "./actions/backlogItems";
import { Dispatch } from "redux";

const mapStateToProps = (state: StateTree): InnerAppAttributeProps => {
    const backlogItems = state.backlogItems.items.map((item) => ({
        id: item.id,
        storyPhrase: item.storyPhrase,
        rolePhrase: item.rolePhrase,
        reasonPhrase: item.reasonPhrase
    }));
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
