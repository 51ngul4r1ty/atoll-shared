// externals
import * as React from "react";
// import Helmet from "react-helmet";

// components
import { PlanningPanelBacklogItem, BacklogItemPlanningPanel } from "./components/organisms/panels/BacklogItemPlanningPanel";
import { TopMenuPanelContainer } from "./containers/TopMenuPanelContainer";

// style
import css from "./App.module.css";

// interfaces/types
import { EditMode } from "./components/molecules/buttons/EditButton";
import { BacklogItemType } from "./types";

// images
// TODO: Fix this issue - getting "Image is not defined" for SSR webpack build
// import favicon from "./assets/favicon.png";

/* exported interface */

export interface PlanViewStateProps {
    addedBacklogItems: PlanningPanelBacklogItem[];
    backlogItems: PlanningPanelBacklogItem[];
    editMode: EditMode;
}

export interface PlanViewDispatchProps {
    onLoaded: { () };
    onAddNewBacklogItem: { (type: BacklogItemType) };
}

export type PlanViewProps = PlanViewStateProps & PlanViewDispatchProps;

/* exported component */

export class PlanView extends React.Component<PlanViewProps, {}> {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.onLoaded();
    }
    render() {
        return (
            <>
                {/* <Helmet
                    defaultTitle="Atoll"
                    titleTemplate="Atoll – %s"
                    link={[{ rel: "icon", type: "image/png", href: favicon }]}
                /> */}
                <TopMenuPanelContainer activeTabId="plan" />
                <BacklogItemPlanningPanel
                    addedBacklogItems={this.props.addedBacklogItems}
                    backlogItems={this.props.backlogItems}
                    editMode={this.props.editMode}
                    onAddNewBacklogItem={(type: BacklogItemType) => {
                        this.props.onAddNewBacklogItem(type);
                    }}
                />
            </>
        );
    }
}
