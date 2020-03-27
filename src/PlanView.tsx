// externals
import * as React from "react";
// import Helmet from "react-helmet";

// components
import { PlanningPanelBacklogItem, BacklogItemPlanningPanel } from "./components/organisms/panels/BacklogItemPlanningPanel";
import { TopMenuPanelContainer } from "./containers/TopMenuPanelContainer";

// contexts
import { AppContext } from "./contexts/appContextUtil";

// style
import css from "./App.module.css";

// interfaces/types
import { EditMode } from "./components/molecules/buttons/EditButton";
import { BacklogItemType, BacklogItemWithSource, SaveableBacklogItem } from "./reducers/backlogItemsReducer";

// images
// TODO: Fix this issue - getting "Image is not defined" for SSR webpack build
// import favicon from "./assets/favicon.png";

/* exported interface */

export interface PlanViewStateProps {
    allItems: BacklogItemWithSource[];
    editMode: EditMode;
}

export interface PlanViewDispatchProps {
    onLoaded: { () };
    onAddNewBacklogItem: { (type: BacklogItemType) };
}

export type PlanViewProps = PlanViewStateProps & PlanViewDispatchProps;

/* exported component */

export class PlanView extends React.Component<PlanViewProps, {}> {
    static contextType = AppContext;
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.onLoaded();
    }
    render() {
        return (
            <>
                <TopMenuPanelContainer activeTabId="plan" />
                <BacklogItemPlanningPanel
                    allItems={this.props.allItems}
                    editMode={this.props.editMode}
                    onAddNewBacklogItem={(type: BacklogItemType) => {
                        this.props.onAddNewBacklogItem(type);
                    }}
                    renderMobile={this.context.state?.isMobile}
                />
            </>
        );
    }
}
