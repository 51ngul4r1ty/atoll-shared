// externals
import { connect } from "react-redux";

// components
import { InnerApp, InnerAppEventProps, InnerAppAttributeProps } from "./InnerApp";
import { AppState } from "./types";

// actions
import { getBacklogItems } from "./actions/backlogItems";
import { Dispatch } from "redux";

const mapStateToProps = (state: AppState): InnerAppAttributeProps => {
    return {};
};

const mapDispatchToProps = (dispatch: Dispatch<any>): InnerAppEventProps => {
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
