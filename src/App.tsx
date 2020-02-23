// externals
import * as React from "react";

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
}

export interface AppDispatchProps {
    onLoaded: { () };
}

export type AppProps = AppStateProps & AppDispatchProps;

/* exported component */

export class App extends React.Component<AppProps, {}> {
    private themeHelper = new ThemeHelper();
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.themeHelper.init();
        this.props.onLoaded();
    }
    componentDidUpdate(prevProps: Readonly<AppProps>) {
        const detectBrowserDarkMode = this.props.detectBrowserDarkMode;
        if (prevProps.detectBrowserDarkMode !== detectBrowserDarkMode) {
            this.themeHelper.detectBrowserDarkMode = detectBrowserDarkMode;
        }
    }
    render() {
        return (
            <div className={css.app}>
                {/* <Helmet
                    defaultTitle="Atoll"
                    titleTemplate="Atoll – %s"
                    link={[{ rel: "icon", type: "image/png", href: favicon }]}
                /> */}
                {this.props.children}
            </div>
        );
    }
}
