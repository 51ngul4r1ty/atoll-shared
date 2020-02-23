// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { App, AppStateProps, AppDispatchProps } from "./App";

// state
import { StateTree } from "./types";

// actions
import { getUserPreferences } from "./actions/userActions";

const mapStateToProps = (state: StateTree): AppStateProps => {
    return {};
};

const mapDispatchToProps = (dispatch: Dispatch): AppDispatchProps => {
    return {
        onLoaded: () => {
            dispatch(getUserPreferences());
        }
    };
};

// const AppContainer = withRouter(
//     connect(
//         mapStateToProps,
//         mapDispatchToProps
//     )(App)
// ); // withTranslation()<any>(App));

export const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
