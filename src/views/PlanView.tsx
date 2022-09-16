// externals
import * as React from "react";
import { Action } from "redux";
import Helmet from "react-helmet";

// components
import { ProductPlanningPanel } from "../components/organisms/panels/productPlanning/ProductPlanningPanel";
import { TopMenuPanelContainer } from "../containers/TopMenuPanelContainer";
import { SprintPlanningPanel } from "../components/organisms/panels/sprintPlanning/SprintPlanningPanel";
import { SmartSpinner } from "../components/molecules/unique/smartSpinner/SmartSpinner";
import { BottomPanelContainer } from "../containers/BottomPanelContainer";
import { ContentPanel } from "../components/organisms/panels/ContentPanel";

// contexts
import { AppContext } from "../contexts/appContextUtil";

// style
import css from "./PlanView.module.css";

// consts/enums
import { NewSprintPosition } from "../actions/sprintActions";
import { QUANTITY_UNKNOWN, TIME_UNKNOWN } from "../components/molecules/unique/smartSpinner/smartSpinnerConsts";
import { SpinnerAction, SpinnerSize, SpinnerTextPosition } from "../components/molecules/unique/smartSpinner/smartSpinnerEnums";
import { EditMode } from "../components/common/componentEnums";

// interfaces/types
import type { BacklogItemWithSource } from "../reducers/backlogItems/backlogItemsReducerTypes";
import type { BacklogItemType } from "../types/backlogItemTypes";
import type { SprintCardSprint } from "../components/molecules/cards/sprintCard/sprintCardTypes";
import type { OpenedOrOpeningDetailMenuInfo } from "../selectors/sprintBacklogSelectors";
import type { SprintOpenedDatePickerInfo } from "../reducers/sprints/sprintsReducerTypes";

// images
// TODO: Fix this issue - getting "Image is not defined" for SSR webpack build
// import favicon from "./assets/favicon.png";

/* exported interface */

export interface PlanViewStateProps {
    allItems: BacklogItemWithSource[];
    archivedSprintCount: number | null;
    busyJoiningUnallocatedParts: boolean;
    busySplittingStory: boolean;
    editMode: EditMode;
    electronClient: boolean;
    errorMessage: string;
    includeArchivedSprints: boolean;
    initAction: Action;
    loading: boolean;
    openedDatePickerInfo: SprintOpenedDatePickerInfo;
    openedDetailMenuBacklogItemId: string | null;
    openedDetailMenuSprintBacklogInfo: OpenedOrOpeningDetailMenuInfo;
    openedDetailMenuSprintId: string | null;
    openingDetailMenuSprintBacklogInfo: OpenedOrOpeningDetailMenuInfo;
    projectId: string;
    selectedProductBacklogItemCount: number;
    showWindowTitleBar: boolean;
    splitToNextSprintAvailable?: boolean;
    sprints: SprintCardSprint[];
    sprintsToDisableAddItemAction: string[];
    strictMode: boolean;
}

export interface PlanViewDispatchProps {
    onAddBacklogItemToSprint: { (sprintId: string): void };
    onAddNewBacklogItemForm: { (type: BacklogItemType, projectId: string): void };
    onAddNewSprintForm: { (position: NewSprintPosition): void };
    onArchivedFilterChange: { (checked: boolean): void };
    onBacklogItemAcceptedClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemDoneClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemIdClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemInProgressClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemNotStartedClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemReleasedClick: { (sprintId: string, backlogItemId: string): void };
    onExpandCollapse: { (sprintId: string, expand: boolean): void };
    onItemDetailClick: { (sprintId: string, backlogItemId: string, strictMode: boolean): void };
    onLoaded: { (initAction: Action): void };
    onMoveItemToBacklogClick: { (sprintId: string, backlogItemId: string): void };
    onReorderBacklogItems: { (sourceItemId: string, targetItemId: string): void };
    onSplitBacklogItemClick: { (sprintId: string, backlogItemId: string): void };
    onSprintDetailClick: { (sprintId: string, strictMode: boolean): void };
}

export type PlanViewProps = PlanViewStateProps & PlanViewDispatchProps;

/* exported component */

export class PlanView extends React.Component<PlanViewProps, {}> {
    static contextType = AppContext;
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.onLoaded(this.props.initAction);
    }
    render() {
        const strictMode = this.props.strictMode;
        const hasContent = this.props.allItems.length > 0 || this.props.sprints.length > 0;
        const pageContentsElts = (
            <div className={css.content}>
                <ProductPlanningPanel
                    className={css.backlog}
                    allItems={this.props.allItems}
                    editMode={this.props.editMode}
                    busyJoiningUnallocatedParts={this.props.busyJoiningUnallocatedParts}
                    busySplittingStory={this.props.busySplittingStory}
                    openedDetailMenuBacklogItemId={this.props.openedDetailMenuBacklogItemId}
                    renderMobile={this.context.state?.isMobile}
                    strictMode={this.props.strictMode}
                    onAddNewBacklogItemForm={(type: BacklogItemType) => {
                        this.props.onAddNewBacklogItemForm(type, this.props.projectId);
                    }}
                    onReorderBacklogItems={(sourceItemId: string, targetItemId: string) => {
                        this.props.onReorderBacklogItems(sourceItemId, targetItemId);
                    }}
                />
                <SprintPlanningPanel
                    archivedSprintCount={this.props.archivedSprintCount}
                    className={css.sprints}
                    editMode={this.props.editMode}
                    busySplittingStory={this.props.busySplittingStory}
                    includeArchived={this.props.includeArchivedSprints}
                    sprints={this.props.sprints}
                    showDetailMenuToLeft
                    renderMobile={this.context.state?.isMobile}
                    selectedProductBacklogItemCount={this.props.selectedProductBacklogItemCount}
                    openedDetailMenuSprintId={this.props.openedDetailMenuSprintId}
                    openedDetailMenuInfo={this.props.openedDetailMenuSprintBacklogInfo}
                    openingDetailMenuInfo={this.props.openingDetailMenuSprintBacklogInfo}
                    openedDatePickerInfo={this.props.openedDatePickerInfo}
                    splitToNextSprintAvailable={this.props.splitToNextSprintAvailable}
                    sprintsToDisableAddItemAction={this.props.sprintsToDisableAddItemAction}
                    strictMode={this.props.strictMode}
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
                            this.props.onItemDetailClick(sprintId, backlogItemId, strictMode);
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
                    onSplitBacklogItemClick={(sprintId: string, backlogItemId: string) => {
                        if (this.props.onSplitBacklogItemClick) {
                            this.props.onSplitBacklogItemClick(sprintId, backlogItemId);
                        }
                    }}
                    onSprintDetailClick={(sprintId: string, strictMode: boolean) => {
                        if (this.props.onSprintDetailClick) {
                            this.props.onSprintDetailClick(sprintId, strictMode);
                        }
                    }}
                />
            </div>
        );
        const spinnerElts = (
            <div className={css.fullPage}>
                <SmartSpinner
                    action={SpinnerAction.Loading}
                    entityNameTemplate="plan view"
                    expectedTime={TIME_UNKNOWN}
                    hideActionInMessage={false}
                    metricEntityKey={null}
                    metricKey="plan-view-bff-init"
                    quantity={QUANTITY_UNKNOWN}
                    size={SpinnerSize.Medium}
                    textPosition={SpinnerTextPosition.BelowSpinner}
                />
            </div>
        );
        let pageContent;
        if (this.props.loading) {
            pageContent = spinnerElts;
        } else if (this.props.errorMessage) {
            pageContent = this.props.errorMessage;
        } else if (hasContent || this.props.editMode === EditMode.Edit) {
            pageContent = pageContentsElts;
        } else {
            pageContent = <div className={css.noContentMsg}>This project is empty. To add content click the Edit button!</div>;
        }
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
                <ContentPanel>{pageContent}</ContentPanel>
                <BottomPanelContainer />
            </>
        );
    }
}
