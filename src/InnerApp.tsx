// externals
import * as React from "react";
// import Helmet from "react-helmet";

// components
import { TopMenuPanel } from "./components/organisms/panels/TopMenuPanel";

// style
import css from "./InnerApp.module.css";
import { BacklogItem, BacklogItemPlanningPanel } from "./components/organisms/panels/BacklogItemPlanningPanel";

// interfaces/types
import { EditMode } from "./components/molecules/buttons/EditButton";

// images
// TODO: Fix this issue - getting "Image is not defined" for SSR webpack build
// import favicon from "./assets/favicon.png";

/* exported interface */

export interface InnerAppStateProps {
    backlogItems: BacklogItem[];
    editMode: EditMode;
}

export interface InnerAppDispatchProps {
    onLoaded: { () };
    onChangeTab: { (tabId: string) };
    setEditMode: { (editMode: EditMode) };
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
                    editMode={this.props.editMode}
                    onChangeTab={(tabId: string) => {
                        if (this.props.onChangeTab) {
                            this.props.onChangeTab(tabId);
                        }
                    }}
                    setEditMode={(editMode: EditMode) => {
                        if (this.props.setEditMode) {
                            this.props.setEditMode(editMode);
                        }
                    }}
                />
                <BacklogItemPlanningPanel backlogItems={this.props.backlogItems} editMode={this.props.editMode} />
            </div>
        );
    }
}
