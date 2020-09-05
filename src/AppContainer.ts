// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";

// components
import { App, AppStateProps, AppDispatchProps } from "./App";

// state
import { StateTree, UserPreferences } from "./types";

// actions
import { receiveWebSocketMessage } from "./actions/wsActions";
import { initApp, appClick, appKeyUp } from "./actions/appActions";

const mapStateToProps = (state: StateTree): AppStateProps => {
    const userPreferences = (state.user && state.user.preferences) || ({} as UserPreferences);
    return {
        detectBrowserDarkMode: userPreferences.detectBrowserDarkMode,
        executingOnClient: state.app.executingOnClient || false,
        electronClient: state.app.electronClient || false
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
        onAppKeyUp: (e: KeyboardEvent) => {
            dispatch(appKeyUp(e));
        },
        onClose: () => {
            // This is electron specific code - may be better to handle it in a more decoupled way?
            const globalCloseApp = (window as any).atoll__CloseApp;
            if (globalCloseApp) {
                globalCloseApp();
            }
        },
        onMaximize: () => {
            // This is electron specific code - may be better to handle it in a more decoupled way?
            const globalMaximizeApp = (window as any).atoll__MaximizeApp;
            if (globalMaximizeApp) {
                globalMaximizeApp();
            }
        },
        onRestore: () => {
            // This is electron specific code - may be better to handle it in a more decoupled way?
            const globalRestoreApp = (window as any).atoll__RestoreApp;
            if (globalRestoreApp) {
                globalRestoreApp();
            }
        },
        onMinimize: () => {
            // This is electron specific code - may be better to handle it in a more decoupled way?
            const globalMinimizeApp = (window as any).atoll__MinimizeApp;
            if (globalMinimizeApp) {
                globalMinimizeApp();
            }
        },
        onTitleBarDoubleClick: () => {
            // This is electron specific code - may be better to handle it in a more decoupled way?
            const globalTitleBarDoubleClick = (window as any).atoll__TitleBarDoubleClick;
            if (globalTitleBarDoubleClick) {
                globalTitleBarDoubleClick();
            }
        },
        onWebSocketMessageReceived: (data: any) => {
            dispatch(receiveWebSocketMessage(data));
        }
    };
};

export const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
