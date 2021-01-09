// externals
import * as React from "react";
import Helmet from "react-helmet";

// components
import { BacklogItemPlanningPanel } from "../components/organisms/panels/backlogItemPlanning/BacklogItemPlanningPanel";
import { TopMenuPanelContainer } from "../containers/TopMenuPanelContainer";

// contexts
import { AppContext } from "../contexts/appContextUtil";

// style
import css from "./PlanView.module.css";

// interfaces/types
import { EditMode } from "../components/common/componentEnums";
import { BacklogItemWithSource } from "../reducers/backlogItems/backlogItemsReducerTypes";
import { BacklogItemType } from "../types/backlogItemTypes";
import { SprintCardSprint } from "../components/molecules/cards/sprintCard/sprintCardTypes";
import { OpenedDetailMenuInfo } from "../selectors/sprintBacklogSelectors";

// components
import { NewSprintPosition } from "../actions/sprintActions";
import { SprintPlanningPanel } from "../components/organisms/panels/sprintPlanning/SprintPlanningPanel";
import { SmartSpinner } from "../components/molecules/unique/smartSpinner/SmartSpinner";

// consts/enums
import { SpinnerSize, QUANTITY_UNKNOWN, TIME_UNKNOWN } from "../components/molecules/unique/smartSpinner/smartSpinnerTypes";

// images
// TODO: Fix this issue - getting "Image is not defined" for SSR webpack build
// import favicon from "./assets/favicon.png";

/* exported interface */

export interface PlanViewStateProps {
    allItems: BacklogItemWithSource[];
    editMode: EditMode;
    electronClient: boolean;
    includeArchivedSprints: boolean;
    loading: boolean;
    openedDetailMenuBacklogItemId: string | null;
    openedDetailMenuSprintBacklogInfo: OpenedDetailMenuInfo;
    openedDetailMenuSprintId: string | null;
    projectId: string;
    selectedProductBacklogItemCount: number;
    showWindowTitleBar: boolean;
    sprints: SprintCardSprint[];
}

export interface PlanViewDispatchProps {
    onAddBacklogItemToSprint: { (sprintId: string): void };
    onAddNewBacklogItemForm: { (type: BacklogItemType, projectId: string): void };
    onAddNewSprintForm: { (position: NewSprintPosition): void };
    onArchivedFilterChange: { (checked: boolean): void };
    onExpandCollapse: { (sprintId: string, expand: boolean): void };
    onItemDetailClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemIdClick: { (sprintId: string, backlogItemId: string): void };
    onSprintDetailClick: { (sprintId: string): void };
    onMoveItemToBacklogClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemAcceptedClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemDoneClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemInProgressClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemNotStartedClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemReleasedClick: { (sprintId: string, backlogItemId: string): void };
    onLoaded: { (): void };
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
        this.props.onLoaded();
    }
    render() {
        const pageContentsElts = (
            <div className={css.content}>
                <BacklogItemPlanningPanel
                    className={css.backlog}
                    allItems={this.props.allItems}
                    editMode={this.props.editMode}
                    openedDetailMenuBacklogItemId={this.props.openedDetailMenuBacklogItemId}
                    renderMobile={this.context.state?.isMobile}
                    onAddNewBacklogItemForm={(type: BacklogItemType) => {
                        this.props.onAddNewBacklogItemForm(type, this.props.projectId);
                    }}
                    onReorderBacklogItems={(sourceItemId: string, targetItemId: string) => {
                        this.props.onReorderBacklogItems(sourceItemId, targetItemId);
                    }}
                />
                <SprintPlanningPanel
                    className={css.sprints}
                    editMode={this.props.editMode}
                    includeArchived={this.props.includeArchivedSprints}
                    sprints={this.props.sprints}
                    showDetailMenuToLeft
                    renderMobile={this.context.state?.isMobile}
                    selectedProductBacklogItemCount={this.props.selectedProductBacklogItemCount}
                    openedDetailMenuSprintId={this.props.openedDetailMenuSprintId}
                    openedDetailMenuInfo={this.props.openedDetailMenuSprintBacklogInfo}
                    onAddBacklogItem={(sprintId: string) => {
                        if (this.props.onAddBacklogItemToSprint) {
                            this.props.onAddBacklogItemToSprint(sprintId);
                        }
                    }}
                    onAddNewSprintBefore={() => {
                        if (this.props.onAddNewSprintForm) {
                            this.props.onAddNewSprintForm(NewSprintPosition.Before);
                        }
                    }}
                    onAddNewSprintAfter={() => {
                        if (this.props.onAddNewSprintForm) {
                            this.props.onAddNewSprintForm(NewSprintPosition.After);
                        }
                    }}
                    onArchivedFilterChange={(checked: boolean) => {
                        if (this.props.onArchivedFilterChange) {
                            this.props.onArchivedFilterChange(checked);
                        }
                    }}
                    onBacklogItemAcceptedClick={(sprintId: string, backlogItemId: string) => {
                        if (this.props.onBacklogItemAcceptedClick) {
                            this.props.onBacklogItemAcceptedClick(sprintId, backlogItemId);
                        }
                    }}
                    onBacklogItemDoneClick={(sprintId: string, backlogItemId: string) => {
                        if (this.props.onBacklogItemDoneClick) {
                            this.props.onBacklogItemDoneClick(sprintId, backlogItemId);
                        }
                    }}
                    onBacklogItemInProgressClick={(sprintId: string, backlogItemId: string) => {
                        if (this.props.onBacklogItemInProgressClick) {
                            this.props.onBacklogItemInProgressClick(sprintId, backlogItemId);
                        }
                    }}
                    onBacklogItemNotStartedClick={(sprintId: string, backlogItemId: string) => {
                        if (this.props.onBacklogItemNotStartedClick) {
                            this.props.onBacklogItemNotStartedClick(sprintId, backlogItemId);
                        }
                    }}
                    onBacklogItemReleasedClick={(sprintId: string, backlogItemId: string) => {
                        if (this.props.onBacklogItemReleasedClick) {
                            this.props.onBacklogItemReleasedClick(sprintId, backlogItemId);
                        }
                    }}
                    onDetailClick={(sprintId: string, backlogItemId: string) => {
                        if (this.props.onItemDetailClick) {
                            this.props.onItemDetailClick(sprintId, backlogItemId);
                        }
                    }}
                    onBacklogItemIdClick={(sprintId: string, backlogItemId: string) => {
                        if (this.props.onBacklogItemIdClick) {
                            this.props.onBacklogItemIdClick(sprintId, backlogItemId);
                        }
                    }}
                    onExpandCollapse={(sprintId: string, expand: boolean) => {
                        if (this.props.onExpandCollapse) {
                            this.props.onExpandCollapse(sprintId, expand);
                        }
                    }}
                    onMoveItemToBacklogClick={(sprintId: string, backlogItemId: string) => {
                        if (this.props.onMoveItemToBacklogClick) {
                            this.props.onMoveItemToBacklogClick(sprintId, backlogItemId);
                        }
                    }}
                    onSprintDetailClick={(sprintId: string) => {
                        if (this.props.onSprintDetailClick) {
                            this.props.onSprintDetailClick(sprintId);
                        }
                    }}
                />
            </div>
        );
        const spinnerElts = (
            <div className={css.fullPage}>
                <SmartSpinner
                    metricKey="plan-view-bff-init"
                    metricEntityKey={null}
                    action={null}
                    entityNameTemplate="Loading Atoll..."
                    size={SpinnerSize.Large}
                    quantity={QUANTITY_UNKNOWN}
                    expectedTime={TIME_UNKNOWN}
                />
            </div>
        );
        return (
            <>
                <Helmet>
                    <title>Planning View</title>
                    <meta name="description" content="Allows a PO to perform sprint backlog and backlog item management." />
                </Helmet>
                <TopMenuPanelContainer
                    activeTabId="plan"
                    treatAsElectronTitleBar={this.props.electronClient && !this.props.showWindowTitleBar}
                />
                {this.props.loading ? spinnerElts : pageContentsElts}
            </>
        );
    }
}
