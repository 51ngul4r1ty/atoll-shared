// externals
import * as React from "react";

// components
import { AppContext, AppProvider } from "./contexts/appContextUtil";
import { FrameCloseButton } from "./components/molecules/buttons/FrameCloseButton";
import { FrameMaximizeButton, MaximizedState } from "./components/molecules/buttons/FrameMaximizeButton";
import { FrameMinimizeButton } from "./components/molecules/buttons/FrameMinimizeButton";

// utils
import { ThemeHelper } from "./utils/themeHelper";
import * as wsClient from "./utils/wsClient";
import * as logger from "./utils/logger";

// style
import css from "./App.module.css";

// consts/enums
import * as loggingTags from "./constants/loggingTags";

// images
// TODO: Fix this issue - getting "Image is not defined" for SSR webpack build
// import favicon from "./assets/favicon.png";

/* exported interface */

export interface AppStateProps {
    detectBrowserDarkMode: boolean;
    executingOnClient: boolean; // i.e. electron
}

export interface AppDispatchProps {
    onAppClick: { (e: MouseEvent) };
    onAppKeyUp: { (e: KeyboardEvent) };
    onClose: { () };
    onMaximize: { () };
    onRestore: { () };
    onMinimize: { () };
    onLoaded: { () };
    onWebSocketMessageReceived: { (data: any) };
}

export type AppProps = AppStateProps & AppDispatchProps;

export interface AppState {
    isMobile: boolean;
    hasError?: boolean;
    errorMessage?: string;
}

/* exported component */

export class App extends React.Component<AppProps, AppState> {
    static contextType = AppContext;
    private themeHelper = new ThemeHelper();
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
        this.setState({ isMobile: false });
        this.context.updateIsMobile = (value) => {
            this.updateIsMobile(value);
        };
        this.handleResize();
    }
    componentWillUnmount() {
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
    handleClick = (e: MouseEvent) => {
        const logContainer = logger.info("app click", [loggingTags.APP_EVENTS]);
        if (this.props.onAppClick) {
            this.props.onAppClick(e);
        }
        return true;
    };
    handleKeyUp = (e: KeyboardEvent) => {
        const logContainer = logger.info("app key", [loggingTags.APP_EVENTS]);
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
        const executingOnClient = this.props.executingOnClient;
        if (executingOnClient && prevProps.executingOnClient !== executingOnClient) {
        }
    }
    updateIsMobile = (value: boolean) => {
        if (this.state?.isMobile !== value) {
            this.setState({ isMobile: value });
        }
    };
    static getDerivedStateFromError(error) {
        return { hasError: true, errorMessage: error };
    }
    render() {
        const classNameToUse = this.state?.isMobile ? `${css.app} ${css.mobile}` : css.app;
        const titleBar = !this.props.executingOnClient ? null : (
            <div className={css.appTitleBar}>
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
                        className={css.appTitleBarMaximizeButton}
                        onClick={(currentState) => {
                            if (currentState === MaximizedState.NotMaximized) {
                                if (this.props.onMaximize) {
                                    this.props.onMaximize();
                                    return true;
                                } else {
                                    return false;
                                }
                            } else if (currentState === MaximizedState.Maximized) {
                                if (this.props.onRestore) {
                                    this.props.onRestore();
                                    return true;
                                } else {
                                    return false;
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
            </div>
        );
        if (this.state?.hasError) {
            return <div>ERROR MESSAGE: {this.state?.errorMessage}</div>;
        } else {
            return (
                <AppProvider value={{ state: this.state, updateIsMobile: this.updateIsMobile }}>
                    <div className={classNameToUse}>
                        {/* <Helmet
                    defaultTitle="Atoll"
                    titleTemplate="Atoll – %s"
                    link={[{ rel: "icon", type: "image/png", href: favicon }]}
                /> */}
                        {this.props.children}
                        {titleBar}
                    </div>
                </AppProvider>
            );
        }
    }
}
