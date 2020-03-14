// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { App, AppStateProps, AppDispatchProps } from "./App";

// state
import { StateTree, UserPreferences } from "./types";

// actions
import { getUserPreferences } from "./actions/userActions";
import { receiveWebSocketMessage } from "./actions/wsActions";

const mapStateToProps = (state: StateTree): AppStateProps => {
    const userPreferences = (state.user && state.user.preferences) || ({} as UserPreferences);
    return {
        detectBrowserDarkMode: userPreferences.detectBrowserDarkMode,
        executingOnClient: state.app.executingOnClient || false
    };
};

const mapDispatchToProps = (dispatch: Dispatch): AppDispatchProps => {
    return {
        onLoaded: () => {
            dispatch(getUserPreferences());
        },
        onWebSocketMessageReceived: (data: any) => {
            dispatch(receiveWebSocketMessage(data));
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
