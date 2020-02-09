// externals
import * as React from "react";
// import Helmet from "react-helmet";

// libraries
import { themeList } from "./themes/all";

// components
import { TopMenuPanel } from "./components/organisms/panels/TopMenuPanel";

// style
import css from "./InnerApp.module.css";
import { BacklogItem, BacklogItemPlanningPanel } from "./components/organisms/panels/BacklogItemPlanningPanel";

// images
// TODO: Fix this issue - getting "Image is not defined" for SSR webpack build
// import favicon from "./assets/favicon.png";

/* exported interface */

export interface InnerAppStateProps {
    backlogItems: BacklogItem[];
}

export interface InnerAppDispatchProps {
    onLoaded: { () };
    onChangeTab: { (tabId: string) };
}

export type InnerAppProps = InnerAppStateProps & InnerAppDispatchProps;

/* exported component */

export class InnerApp extends React.Component<InnerAppProps, {}> {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.onLoaded();
    }
    render() {
        return (
            <div className={css.app}>
                {/* <Helmet
                    defaultTitle="Atoll"
                    titleTemplate="Atoll – %s"
                    link={[{ rel: "icon", type: "image/png", href: favicon }]}
                /> */}
                <TopMenuPanel
                    onChangeTab={(tabId: string) => {
                        if (this.props.onChangeTab) {
                            this.props.onChangeTab(tabId);
                        }
                    }}
                />
                <BacklogItemPlanningPanel backlogItems={this.props.backlogItems} />
            </div>
        );
    }
}
