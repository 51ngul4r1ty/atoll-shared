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
    openedDetailMenuBacklogItemId: string | null;
    electronClient: boolean;
    showWindowTitleBar: boolean;
}

export interface PlanViewDispatchProps {
    onLoaded: { () };
    onAddNewBacklogItem: { (type: BacklogItemType) };
    onReorderBacklogItems: { (sourceItemId: string, targetItemId: string) };
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
                <TopMenuPanelContainer
                    activeTabId="plan"
                    treatAsElectronTitleBar={this.props.electronClient && !this.props.showWindowTitleBar}
                />
                <BacklogItemPlanningPanel
                    allItems={this.props.allItems}
                    editMode={this.props.editMode}
                    onAddNewBacklogItem={(type: BacklogItemType) => {
                        this.props.onAddNewBacklogItem(type);
                    }}
                    onReorderBacklogItems={(sourceItemId: string, targetItemId: string) => {
                        this.props.onReorderBacklogItems(sourceItemId, targetItemId);
                    }}
                    renderMobile={this.context.state?.isMobile}
                    openedDetailMenuBacklogItemId={this.props.openedDetailMenuBacklogItemId}
                />
            </>
        );
    }
}
