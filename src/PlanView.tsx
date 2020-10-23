// externals
import * as React from "react";
// import Helmet from "react-helmet";

// components
import { BacklogItemPlanningPanel } from "./components/organisms/panels/backlogItemPlanning/BacklogItemPlanningPanel";
import { TopMenuPanelContainer } from "./containers/TopMenuPanelContainer";

// contexts
import { AppContext } from "./contexts/appContextUtil";

// style
import css from "./PlanView.module.css";

// interfaces/types
import { EditMode } from "./components/molecules/buttons/EditButton";
import { BacklogItemWithSource } from "./reducers/backlogItems/backlogItemsReducerTypes";
import { BacklogItemType } from "./types/backlogItemTypes";
import { SprintPlanningPanelSprint } from "./components/organisms/panels/sprintPlanning/sprintPlanningPanelTypes";

// components
import { SprintPlanningPanel } from "./components/organisms/panels/sprintPlanning/SprintPlanningPanel";

// images
// TODO: Fix this issue - getting "Image is not defined" for SSR webpack build
// import favicon from "./assets/favicon.png";

/* exported interface */

export interface PlanViewStateProps {
    allItems: BacklogItemWithSource[];
    editMode: EditMode;
    electronClient: boolean;
    openedDetailMenuBacklogItemId: string | null;
    projectId: string;
    showWindowTitleBar: boolean;
    sprints: SprintPlanningPanelSprint[];
}

export interface PlanViewDispatchProps {
    onLoaded: { (projectId: string) };
    onAddNewBacklogItem: { (type: BacklogItemType) };
    onReorderBacklogItems: { (sourceItemId: string, targetItemId: string) };
    onExpandCollapse: { (sprintId: string, expand: boolean) };
}

export type PlanViewProps = PlanViewStateProps & PlanViewDispatchProps;

/* exported component */

export class PlanView extends React.Component<PlanViewProps, {}> {
    static contextType = AppContext;
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.onLoaded(this.props.projectId);
    }
    render() {
        return (
            <>
                <TopMenuPanelContainer
                    activeTabId="plan"
                    treatAsElectronTitleBar={this.props.electronClient && !this.props.showWindowTitleBar}
                />
                <div className={css.content}>
                    <BacklogItemPlanningPanel
                        className={css.backlog}
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
                    <SprintPlanningPanel
                        className={css.sprints}
                        sprints={this.props.sprints}
                        onExpandCollapse={(sprintId: string, expand: boolean) => {
                            if (this.props.onExpandCollapse) {
                                this.props.onExpandCollapse(sprintId, expand);
                            }
                        }}
                    />
                </div>
            </>
        );
    }
}
