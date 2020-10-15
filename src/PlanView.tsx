// externals
import * as React from "react";
// import Helmet from "react-helmet";

// components
import { PlanningPanelBacklogItem, BacklogItemPlanningPanel } from "./components/organisms/panels/BacklogItemPlanningPanel";
import { TopMenuPanelContainer } from "./containers/TopMenuPanelContainer";

// contexts
import { AppContext } from "./contexts/appContextUtil";

// style
import css from "./PlanView.module.css";

// interfaces/types
import { EditMode } from "./components/molecules/buttons/EditButton";
import { BacklogItemType, BacklogItemWithSource, SaveableBacklogItem } from "./reducers/backlogItemsReducer";
import { SprintPlanningPanel, SprintStatus } from "./components/organisms/panels/SprintPlanningPanel";

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
}

export interface PlanViewDispatchProps {
    onLoaded: { (projectId: string) };
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
        this.props.onLoaded(this.props.projectId);
    }
    render() {
        const sprints = [
            {
                name: "Sprint 192",
                startDate: new Date(2019, 4, 30),
                finishDate: new Date(2019, 5, 12),
                status: SprintStatus.Completed
            },
            {
                name: "Sprint 193",
                startDate: new Date(2019, 5, 13),
                finishDate: new Date(2019, 5, 26),
                status: SprintStatus.InProgress
            }
        ];
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
                    <SprintPlanningPanel className={css.sprints} sprints={sprints} />
                </div>
            </>
        );
    }
}
