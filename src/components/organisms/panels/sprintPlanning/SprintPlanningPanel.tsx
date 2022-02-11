// externals
import * as React from "react";
import { useDispatch } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./SprintPlanningPanel.module.css";

// utils
import { buildClassName } from "../../../../utils/classNameBuilder";

// interfaces/types
import { SprintCardSprint } from "../../../molecules/cards/sprintCard/sprintCardTypes";
import { ItemMenuEventHandlers } from "../../../molecules/cards/BacklogItemCard";
import { OnAddNewSprint, OnArchivedFilterChange } from "./sprintPlanningPanelTypes";

// utils
import { addBottomActionButtons, addTopActionButtons } from "./sprintPlanningPanelJsxUtils";
import { sprintMenuBuilder } from "../../../common/itemMenuBuilders";

// consts/enums
import { EditMode } from "../../../common/componentEnums";

// selectors
import { OpenedOrOpeningDetailMenuInfo } from "../../../../selectors/sprintBacklogSelectors";

// components
import { SprintDetailForm, SprintDetailShowingPicker } from "../../forms/SprintDetailForm";
import { SimpleDivider } from "../../../atoms/dividers/SimpleDivider";
import { SprintCard } from "../../../molecules/cards/sprintCard/SprintCard";

// actions
import {
    cancelEditSprint,
    cancelUnsavedSprint,
    editSprint,
    hideSprintRangeDatePicker,
    saveNewSprint,
    showSprintRangeDatePicker,
    updateSprint,
    updateSprintFields
} from "../../../../actions/sprintActions";
import { apiArchiveSprint, apiDeleteSprint, apiUnarchiveSprint } from "../../../../actions/apiSprints";
import { SprintOpenedDatePickerInfo } from "../../../../reducers/sprintsReducer";

export interface SprintPlanningPanelStateProps {
    busySplittingStory?: boolean;
    className?: string;
    editMode: EditMode;
    includeArchived: boolean;
    openedDatePickerInfo: SprintOpenedDatePickerInfo;
    openedDetailMenuInfo: OpenedOrOpeningDetailMenuInfo;
    openingDetailMenuInfo: OpenedOrOpeningDetailMenuInfo;
    openedDetailMenuSprintId: string | null;
    renderMobile?: boolean;
    selectedProductBacklogItemCount: number;
    showDetailMenuToLeft?: boolean;
    sprints: SprintCardSprint[];
}

export interface SprintPlanningPanelDispatchProps {
    onAddBacklogItem: { (sprintId: string): void };
    onAddNewSprintAfter: OnAddNewSprint;
    onAddNewSprintBefore: OnAddNewSprint;
    onArchivedFilterChange: OnArchivedFilterChange;
    onBacklogItemAcceptedClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemDoneClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemIdClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemInProgressClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemNotStartedClick: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemReleasedClick: { (sprintId: string, backlogItemId: string): void };
    onDetailClick: { (sprintId: string, backlogItemId: string): void };
    onExpandCollapse: { (id: string, expand: boolean): void };
    onMoveItemToBacklogClick: { (sprintId: string, backlogItemId: string): void };
    onSplitBacklogItemClick: { (sprintId: string, backlogItemId: string): void };
    onSprintDetailClick: { (sprintId: string): void };
}

export type SprintPlanningPanelProps = SprintPlanningPanelStateProps & SprintPlanningPanelDispatchProps & WithTranslation;

const buildSprintKey = (sprint: SprintCardSprint) => {
    return `${sprint.id}-${sprint.instanceId}`;
};

export const InnerSprintPlanningPanel: React.FC<SprintPlanningPanelProps> = (props) => {
    const dispatch = useDispatch();
    const onExpandCollapse = (id: string, expand: boolean) => {
        if (props.onExpandCollapse) {
            props.onExpandCollapse(id, expand);
        }
    };
    const onAddBacklogItem = (sprintId: string) => {
        if (props.onAddBacklogItem) {
            props.onAddBacklogItem(sprintId);
        }
    };
    const onDetailClick = (sprintId: string, backlogItemId: string) => {
        if (props.onDetailClick) {
            props.onDetailClick(sprintId, backlogItemId);
        }
    };
    const onBacklogItemIdClick = (sprintId: string, backlogItemId: string) => {
        if (props.onBacklogItemIdClick) {
            props.onBacklogItemIdClick(sprintId, backlogItemId);
        }
    };
    const onSprintDetailClick = (sprintId: string) => {
        if (props.onSprintDetailClick) {
            props.onSprintDetailClick(sprintId);
        }
    };
    const onMoveItemToBacklogClick = (sprintId: string, backlogItemId: string) => {
        if (props.onMoveItemToBacklogClick) {
            props.onMoveItemToBacklogClick(sprintId, backlogItemId);
        }
    };
    const onSplitBacklogItemClick = (sprintId: string, backlogItemId: string) => {
        if (props.onSplitBacklogItemClick) {
            props.onSplitBacklogItemClick(sprintId, backlogItemId);
        }
    };
    const onBacklogItemAcceptedClick = (sprintId: string, backlogItemId: string) => {
        if (props.onBacklogItemAcceptedClick) {
            props.onBacklogItemAcceptedClick(sprintId, backlogItemId);
        }
    };
    const onBacklogItemDoneClick = (sprintId: string, backlogItemId: string) => {
        if (props.onBacklogItemDoneClick) {
            props.onBacklogItemDoneClick(sprintId, backlogItemId);
        }
    };
    const onBacklogItemInProgressClick = (sprintId: string, backlogItemId: string) => {
        if (props.onBacklogItemInProgressClick) {
            props.onBacklogItemInProgressClick(sprintId, backlogItemId);
        }
    };
    const onBacklogItemNotStartedClick = (sprintId: string, backlogItemId: string) => {
        if (props.onBacklogItemNotStartedClick) {
            props.onBacklogItemNotStartedClick(sprintId, backlogItemId);
        }
    };
    const onBacklogItemReleasedClick = (sprintId: string, backlogItemId: string) => {
        if (props.onBacklogItemReleasedClick) {
            props.onBacklogItemReleasedClick(sprintId, backlogItemId);
        }
    };
    const classNameToUse = buildClassName(css.sprintPlanningPanel, css.backlogItemPlanningPanel, props.className);
    let renderElts = [];
    addTopActionButtons(
        renderElts,
        css.topPanel,
        props.editMode,
        props.includeArchived,
        props.onAddNewSprintBefore,
        props.onArchivedFilterChange
    );
    let firstElt = true;
    props.sprints.forEach((sprint) => {
        const openedDetailMenuBacklogItemId =
            sprint.id && sprint.id === props.openedDetailMenuInfo?.sprintId ? props.openedDetailMenuInfo.backlogItemId : null;
        const openingDetailMenuBacklogItemId =
            sprint.id && sprint.id === props.openingDetailMenuInfo?.sprintId ? props.openingDetailMenuInfo.backlogItemId : null;
        const showPicker: SprintDetailShowingPicker =
            sprint?.id === props.openedDatePickerInfo?.sprintId
                ? props.openedDatePickerInfo?.showPicker
                : SprintDetailShowingPicker.None;
        let sprintItemElt;
        if (sprint.saved && !sprint.editing) {
            const itemEventHandlers: ItemMenuEventHandlers = {
                handleEvent: (eventName: string, itemId: string) => {
                    if (eventName === "onEditItemClick") {
                        dispatch(editSprint(itemId));
                    } else if (eventName === "onRemoveItemClick") {
                        dispatch(apiDeleteSprint(itemId));
                    } else if (eventName === "onArchiveItemClick") {
                        dispatch(apiArchiveSprint(itemId));
                    } else if (eventName === "onUnarchiveItemClick") {
                        dispatch(apiUnarchiveSprint(itemId));
                    } else {
                        throw Error(`${eventName} is not handled`);
                    }
                }
            };
            sprintItemElt = (
                <div key={buildSprintKey(sprint)}>
                    <SimpleDivider />
                    <SprintCard
                        {...sprint}
                        editMode={props.editMode}
                        busySplittingStory={props.busySplittingStory}
                        showDetailMenuToLeft={props.showDetailMenuToLeft}
                        showDetailMenu={props.openedDetailMenuSprintId === sprint.id}
                        buildItemMenu={sprintMenuBuilder(itemEventHandlers)}
                        openedDetailMenuBacklogItemId={openedDetailMenuBacklogItemId}
                        openingDetailMenuBacklogItemId={openingDetailMenuBacklogItemId}
                        renderMobile={props.renderMobile}
                        selectedProductBacklogItemCount={props.selectedProductBacklogItemCount}
                        onExpandCollapse={(id, expand) => {
                            onExpandCollapse(id, expand);
                        }}
                        onAddBacklogItem={() => {
                            onAddBacklogItem(sprint.id);
                        }}
                        onBacklogItemDetailClick={(backlogItemId: string) => {
                            onDetailClick(sprint.id, backlogItemId);
                        }}
                        onBacklogItemIdClick={(backlogItemId: string) => {
                            onBacklogItemIdClick(sprint.id, backlogItemId);
                        }}
                        onSprintDetailClick={() => {
                            onSprintDetailClick(sprint.id);
                        }}
                        onMoveItemToBacklogClick={(backlogItemId: string) => {
                            onMoveItemToBacklogClick(sprint.id, backlogItemId);
                        }}
                        onSplitBacklogItemClick={(backlogItemId: string) => {
                            onSplitBacklogItemClick(sprint.id, backlogItemId);
                        }}
                        onBacklogItemAcceptedClick={(backlogItemId: string) => {
                            onBacklogItemAcceptedClick(sprint.id, backlogItemId);
                        }}
                        onBacklogItemDoneClick={(backlogItemId: string) => {
                            onBacklogItemDoneClick(sprint.id, backlogItemId);
                        }}
                        onBacklogItemInProgressClick={(backlogItemId: string) => {
                            onBacklogItemInProgressClick(sprint.id, backlogItemId);
                        }}
                        onBacklogItemNotStartedClick={(backlogItemId: string) => {
                            onBacklogItemNotStartedClick(sprint.id, backlogItemId);
                        }}
                        onBacklogItemReleasedClick={(backlogItemId: string) => {
                            onBacklogItemReleasedClick(sprint.id, backlogItemId);
                        }}
                    />
                </div>
            );
        } else {
            const classNameToUse = buildClassName(!firstElt ? css.topSpacingAboveForm : null);
            sprintItemElt = (
                <div key={buildSprintKey(sprint)}>
                    <SprintDetailForm
                        id={sprint.id}
                        className={classNameToUse}
                        instanceId={sprint.instanceId}
                        sprintName={sprint.name}
                        startDate={sprint.startDate}
                        finishDate={sprint.finishDate}
                        editing={sprint.editing}
                        renderMobile={props.renderMobile}
                        showPicker={showPicker}
                        onDataUpdate={(fields) => {
                            dispatch(updateSprintFields(fields));
                        }}
                        onCancelClick={(id, instanceId) => {
                            if (id) {
                                dispatch(cancelEditSprint(id));
                            } else {
                                dispatch(cancelUnsavedSprint(instanceId));
                            }
                        }}
                        onDoneClick={(id, instanceId) => {
                            if (id) {
                                dispatch(updateSprint(id));
                            } else {
                                dispatch(saveNewSprint(instanceId));
                            }
                        }}
                        onShowPicker={(showPicker: SprintDetailShowingPicker) => {
                            dispatch(showSprintRangeDatePicker(sprint.id, showPicker));
                        }}
                        onHidePicker={() => {
                            dispatch(hideSprintRangeDatePicker());
                        }}
                    />
                </div>
            );
        }
        firstElt = false;
        renderElts.push(sprintItemElt);
    });
    addBottomActionButtons(renderElts, css.bottomPanel, props.editMode, props.onAddNewSprintAfter);
    return <div className={classNameToUse}>{renderElts}</div>;
};

export const SprintPlanningPanel = withTranslation()(InnerSprintPlanningPanel);
