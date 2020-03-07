// externals
import * as React from "react";

// components
import { AppContext, AppProvider } from "./contexts/appContextUtil";

// // components
// import { BacklogItem, BacklogItemPlanningPanel } from "./components/organisms/panels/BacklogItemPlanningPanel";
// import { TopMenuPanelContainer } from "./containers/TopMenuPanelContainer";

// utils
import { ThemeHelper } from "./utils/themeHelper";

// style
import css from "./App.module.css";

// // interfaces/types
// import { EditMode } from "./components/molecules/buttons/EditButton";

// images
// TODO: Fix this issue - getting "Image is not defined" for SSR webpack build
// import favicon from "./assets/favicon.png";

/* exported interface */

export interface AppStateProps {
    detectBrowserDarkMode: boolean;
    executingOnClient: boolean;
}

export interface AppDispatchProps {
    onLoaded: { () };
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
        this.themeHelper.init();
        this.props.onLoaded();
        window.addEventListener("resize", this.handleResize);
        this.setState({ isMobile: false });
        this.context.updateIsMobile = (value) => {
            this.updateIsMobile(value);
        };
        this.handleResize();
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }
    handleResize = () => {
        const width = window.innerWidth;
        if (width < 450) {
            this.context.updateIsMobile(true);
        } else {
            this.context.updateIsMobile(false);
        }
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
        console.log(`UPDATING IS MOBILE TO ${value}`);
        if (this.state?.isMobile !== value) {
            console.log(`${this.state?.isMobile} !== ${value}`);
            this.setState({ isMobile: value });
        }
    };
    render() {
        // // TODO: This seems unnecessary... it will already be initialized to this
        // const contextValue = setAppContextValue({ mobile: false });

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
