// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { App, AppStateProps, AppDispatchProps } from "./App";

// state
import { StateTree, UserPreferences } from "./types";

// actions
import { receiveWebSocketMessage } from "./actions/wsActions";
import { initApp, appClick } from "./actions/appActions";

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
            dispatch(initApp());
        },
        onAppClick: (e: MouseEvent) => {
            dispatch(appClick(e));
        },
        onWebSocketMessageReceived: (data: any) => {
            dispatch(receiveWebSocketMessage(data));
        }
    };
};

export const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
