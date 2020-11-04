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
import { OpenedDetailMenuInfo } from "./selectors/sprintBacklogSelectors";

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
    openedDetailMenuSprintBacklogInfo: OpenedDetailMenuInfo;
    projectId: string;
    selectedProductBacklogItemCount: number;
    showWindowTitleBar: boolean;
    sprints: SprintPlanningPanelSprint[];
}

export interface PlanViewDispatchProps {
    onAddBacklogItemToSprint: { (sprintId: string): void };
    onAddNewBacklogItem: { (type: BacklogItemType): void };
    onAddNewSprint: { (): void };
    onExpandCollapse: { (sprintId: string, expand: boolean): void };
    onItemDetailClicked: { (sprintId: string, backlogItemId: string): void };
    onMoveItemToBacklogClicked: { (sprintId: string, backlogItemId: string): void };
    onLoaded: { (projectId: string): void };
    onReorderBacklogItems: { (sourceItemId: string, targetItemId: string): void };
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
                        openedDetailMenuBacklogItemId={this.props.openedDetailMenuBacklogItemId}
                        renderMobile={this.context.state?.isMobile}
                        onAddNewBacklogItem={(type: BacklogItemType) => {
                            this.props.onAddNewBacklogItem(type);
                        }}
                        onReorderBacklogItems={(sourceItemId: string, targetItemId: string) => {
                            this.props.onReorderBacklogItems(sourceItemId, targetItemId);
                        }}
                    />
                    <SprintPlanningPanel
                        className={css.sprints}
                        editMode={this.props.editMode}
                        sprints={this.props.sprints}
                        renderMobile={this.context.state?.isMobile}
                        selectedProductBacklogItemCount={this.props.selectedProductBacklogItemCount}
                        openedDetailMenuInfo={this.props.openedDetailMenuSprintBacklogInfo}
                        onExpandCollapse={(sprintId: string, expand: boolean) => {
                            if (this.props.onExpandCollapse) {
                                this.props.onExpandCollapse(sprintId, expand);
                            }
                        }}
                        onAddNewSprintBefore={() => {
                            // TODO: Differentiate this from "after"
                            if (this.props.onAddNewSprint) {
                                this.props.onAddNewSprint();
                            }
                        }}
                        onAddNewSprintAfter={() => {
                            // TODO: Differentiate this from "after"
                            if (this.props.onAddNewSprint) {
                                this.props.onAddNewSprint();
                            }
                        }}
                        onAddBacklogItem={(sprintId: string) => {
                            if (this.props.onAddBacklogItemToSprint) {
                                this.props.onAddBacklogItemToSprint(sprintId);
                            }
                        }}
                        onDetailClicked={(sprintId: string, backlogItemId: string) => {
                            if (this.props.onItemDetailClicked) {
                                this.props.onItemDetailClicked(sprintId, backlogItemId);
                            }
                        }}
                        onMoveItemToBacklogClicked={(sprintId: string, backlogItemId: string) => {
                            if (this.props.onMoveItemToBacklogClicked) {
                                this.props.onMoveItemToBacklogClicked(sprintId, backlogItemId);
                            }
                        }}
                    />
                </div>
            </>
        );
    }
}
