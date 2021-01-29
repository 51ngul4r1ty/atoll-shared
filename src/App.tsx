// externals
import * as React from "react";
import Helmet from "react-helmet";

// components
import { AppContext, AppProvider } from "./contexts/appContextUtil";
import { FrameCloseButton } from "./components/molecules/buttons/FrameCloseButton";
import { FrameMaximizeButton } from "./components/molecules/buttons/FrameMaximizeButton";
import { FrameMinimizeButton } from "./components/molecules/buttons/FrameMinimizeButton";

// utils
import { ThemeHelper } from "./utils/themeHelper";
import * as wsClient from "./utils/wsClient";
import * as logger from "./utils/logger";
import { isPlatformWindows, currentPlatformValue } from "./utils/osUtils";
import { buildClassName, buildOsClassName } from "./utils";

// consts/enums
import * as loggingTags from "./constants/loggingTags";
import { GLOBAL_CSS_CLASS_ALL, GLOBAL_CSS_CLASS_MOBILE } from "./constants";

// style
import css from "./App.module.css";

// images
// TODO: Fix this issue - getting "Image is not defined" for SSR webpack build
// import favicon from "./assets/favicon.png";

/* exported interface */

export interface AppStateProps {
    detectBrowserDarkMode: boolean;
    executingOnClient: boolean; // any client (inlcuding web browser), not just electron
    electronClient: boolean;
    allowTitleBarWindowDragging: boolean;
    isWindowMaximized?: { (): boolean | undefined }; // NOTE: This is a callback, it is not used for dispatch!
}

export interface AppDispatchProps {
    onAppClick: { (e: MouseEvent) };
    onAppKeyUp: { (e: KeyboardEvent) };
    onClose: { () };
    onMaximize: { () };
    onRestore: { () };
    onMinimize: { () };
    onTitleBarDoubleClick: { (): boolean };
    onLoaded: { () };
    onWebSocketMessageReceived: { (data: any) };
}

export type AppProps = AppStateProps & AppDispatchProps;

export interface AppState {
    isMobile: boolean;
    isMaximized: boolean;
    hasError?: boolean;
    errorMessage?: string;
}

/* exported component */

export class App extends React.Component<AppProps, AppState> {
    static contextType = AppContext;
    private themeHelper = new ThemeHelper();
    private timeoutHandle: NodeJS.Timeout;
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        wsClient.init((data: any) => {
            this.props.onWebSocketMessageReceived(data);
        });
        this.themeHelper.init();
        this.props.onLoaded();
        window.addEventListener("resize", this.handleResize);
        window.addEventListener("click", this.handleClick);
        window.addEventListener("keyup", this.handleKeyUp);
        this.setState({
            isMobile: false,
            isMaximized: this.props.isWindowMaximized()
        });
        this.context.updateIsMobile = (value) => {
            this.updateIsMobile(value);
        };
        this.handleResize();
        this.handleWindowMaximize();
    }
    componentWillUnmount() {
        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
        }
        window.removeEventListener("resize", this.handleResize);
        window.removeEventListener("click", this.handleClick);
        window.removeEventListener("keyup", this.handleKeyUp);
    }
    handleResize = () => {
        const width = window.innerWidth;
        if (width < 450) {
            this.context.updateIsMobile(true);
        } else {
            this.context.updateIsMobile(false);
        }
    };
    handleWindowMaximize = () => {
        this.timeoutHandle = setTimeout(() => {
            this.updateIsMaximized();
            this.handleWindowMaximize();
        }, 500);
    };
    handleClick = (e: MouseEvent) => {
        logger.info("app click", [loggingTags.APP_EVENTS]);
        if (this.props.onAppClick) {
            this.props.onAppClick(e);
        }
        return true;
    };
    handleKeyUp = (e: KeyboardEvent) => {
        logger.info("app key", [loggingTags.APP_EVENTS]);
        if (this.props.onAppKeyUp) {
            this.props.onAppKeyUp(e);
        }
        return true;
    };
    componentDidUpdate(prevProps: Readonly<AppProps>) {
        const detectBrowserDarkMode = this.props.detectBrowserDarkMode;
        if (prevProps.detectBrowserDarkMode !== detectBrowserDarkMode) {
            this.themeHelper.detectBrowserDarkMode = detectBrowserDarkMode;
        }
    }
    updateIsMobile = (value: boolean) => {
        if (this.state?.isMobile !== value) {
            this.setState({ isMobile: value, isMaximized: this.state?.isMaximized });
        }
    };
    updateIsMaximized = () => {
        const value = this.props.isWindowMaximized();
        if (this.state?.isMaximized !== value) {
            this.setState({ isMobile: this.state?.isMobile, isMaximized: value });
        }
    };
    static getDerivedStateFromError(error) {
        return { hasError: true, errorMessage: error };
    }
    render() {
        const classNameToUse = buildClassName(
            css.app,
            GLOBAL_CSS_CLASS_ALL,
            this.state?.isMobile ? GLOBAL_CSS_CLASS_MOBILE : null,
            this.props.electronClient ? buildOsClassName(currentPlatformValue) : null
        );
        const isWindowsElectronClient = this.props.electronClient && isPlatformWindows();

        const titleBarButtons = (
            <div className={css.appTitleBarButtons}>
                <FrameMinimizeButton
                    className={css.appTitleBarMinimizeButton}
                    onClick={() => {
                        if (this.props.onMinimize) {
                            this.props.onMinimize();
                        }
                    }}
                />
                <FrameMaximizeButton
                    isMaximized={this.props.isWindowMaximized()}
                    className={css.appTitleBarMaximizeButton}
                    onClick={() => {
                        if (this.props.isWindowMaximized) {
                            if (this.props.isWindowMaximized()) {
                                this.props.onRestore();
                            } else {
                                this.props.onMaximize();
                            }
                        }
                    }}
                />
                <FrameCloseButton
                    className={css.appTitleBarCloseButton}
                    onClick={() => {
                        if (this.props.onClose) {
                            this.props.onClose();
                        }
                    }}
                />
            </div>
        );
        let windowFrameCustomElts;
        if (!this.props.electronClient) {
            windowFrameCustomElts = null;
        } else if (isWindowsElectronClient && this.props.allowTitleBarWindowDragging) {
            windowFrameCustomElts = (
                <div
                    className={css.appTitleBar}
                    onDoubleClick={() => {
                        if (this.props.onTitleBarDoubleClick) {
                            this.props.onTitleBarDoubleClick();
                        }
                    }}
                >
                    <div className={css.appTitleBarDragArea} />
                    {titleBarButtons}
                </div>
            );
        } else if (isWindowsElectronClient && !this.props.allowTitleBarWindowDragging) {
            windowFrameCustomElts = titleBarButtons;
        } else {
            windowFrameCustomElts = (
                <div
                    className={css.appTitleBar}
                    onDoubleClick={() => {
                        if (this.props.onTitleBarDoubleClick) {
                            this.props.onTitleBarDoubleClick();
                        }
                    }}
                >
                    <div className={css.appTitleBarDragArea} />
                </div>
            );
        }
        if (this.state?.hasError) {
            return <div>ERROR MESSAGE: {this.state?.errorMessage}</div>;
        } else {
            return (
                <AppProvider
                    value={{
                        state: this.state,
                        updateIsMobile: this.updateIsMobile
                    }}
                >
                    <div className={classNameToUse}>
                        <Helmet defaultTitle="Atoll" titleTemplate="Atoll – %s">
                            <meta name="description" content="Agile software project management" />
                        </Helmet>
                        {this.props.children}
                    </div>
                    <div id="atollModalPanel" />
                    {windowFrameCustomElts}
                </AppProvider>
            );
        }
    }
}
