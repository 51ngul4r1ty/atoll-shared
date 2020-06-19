// externals
import * as React from "react";

// components
import { AppContext, AppProvider } from "./contexts/appContextUtil";

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
    executingOnClient: boolean;
}

export interface AppDispatchProps {
    onAppClick: { (e: MouseEvent) };
    onAppKeyUp: { (e: KeyboardEvent) };
    onLoaded: { () };
    onWebSocketMessageReceived: { (data: any) };
}

export type AppProps = AppStateProps & AppDispatchProps;

export interface AppState {
    isMobile: boolean;
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
    render() {
        const classNameToUse = this.state?.isMobile ? `${css.app} ${css.mobile}` : css.app;
        return (
            <AppProvider value={{ state: this.state, updateIsMobile: this.updateIsMobile }}>
                <div className={classNameToUse}>
                    {/* <Helmet
                    defaultTitle="Atoll"
                    titleTemplate="Atoll – %s"
                    link={[{ rel: "icon", type: "image/png", href: favicon }]}
                /> */}
                    {this.props.children}
                </div>
            </AppProvider>
        );
    }
}
