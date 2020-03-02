// externals
import * as React from "react";
// import Helmet from "react-helmet";

// components
import { AddButton } from "./components/molecules/buttons/AddButton";
import { BacklogItem, BacklogItemPlanningPanel } from "./components/organisms/panels/BacklogItemPlanningPanel";
import { TopMenuPanelContainer } from "./containers/TopMenuPanelContainer";
import { UserStoryDetailForm } from "./components/organisms/forms/UserStoryDetailForm";

// style
import css from "./App.module.css";

// interfaces/types
import { EditMode } from "./components/molecules/buttons/EditButton";

// images
// TODO: Fix this issue - getting "Image is not defined" for SSR webpack build
// import favicon from "./assets/favicon.png";

/* exported interface */

export interface PlanViewStateProps {
    backlogItems: BacklogItem[];
    editMode: EditMode;
}

export interface PlanViewDispatchProps {
    onLoaded: { () };
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
                <BacklogItemPlanningPanel backlogItems={this.props.backlogItems} editMode={this.props.editMode} />
                <UserStoryDetailForm />
            </>
        );
    }
}
