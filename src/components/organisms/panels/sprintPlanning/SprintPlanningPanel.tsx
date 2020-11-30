// externals
import * as React from "react";
import { useDispatch } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";

// utils
import { buildClassName } from "../../../../utils/classNameBuilder";

// interfaces/types
import { SprintCardSprint } from "../../../molecules/cards/sprintCard/sprintCardTypes";
import { ItemMenuEventHandlers } from "../../../molecules/cards/BacklogItemCard";

// utils
import { addBottomActionButtons, addTopActionButtons } from "./sprintPlanningPanelJsxUtils";
import { sprintMenuBuilder } from "../../../common/itemMenuBuilders";

// consts/enums
import { EditMode } from "../../../molecules/buttons/EditButton";

// selectors
import { OpenedDetailMenuInfo } from "../../../../selectors/sprintBacklogSelectors";

// components
import { SprintDetailForm } from "../../forms/SprintDetailForm";
import { SimpleDivider } from "../../../atoms/dividers/SimpleDivider";
import { SprintCard } from "../../../molecules/cards/sprintCard/SprintCard";

// actions
import {
    cancelEditSprint,
    cancelUnsavedSprint,
    saveNewSprint,
    updateSprint,
    updateSprintFields
} from "../../../../actions/sprintActions";
import { apiDeleteSprint } from "../../../../actions/apiSprints";

// style
import css from "./SprintPlanningPanel.module.css";

export interface SprintPlanningPanelStateProps {
    className?: string;
    editMode: EditMode;
    openedDetailMenuInfo: OpenedDetailMenuInfo;
    openedDetailMenuSprintId: string | null;
    renderMobile?: boolean;
    selectedProductBacklogItemCount: number;
    showDetailMenuToLeft?: boolean;
    sprints: SprintCardSprint[];
}

export interface SprintPlanningPanelDispatchProps {
    onExpandCollapse: { (id: string, expand: boolean): void };
    onAddNewSprintBefore: { (): void };
    onAddNewSprintAfter: { (): void };
    onAddBacklogItem: { (sprintId: string): void };
    onDetailClicked: { (sprintId: string, backlogItemId: string): void };
    onSprintDetailClicked: { (sprintId: string): void };
    onMoveItemToBacklogClicked: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemDoneClicked: { (sprintId: string, backlogItemId: string): void };
    onBacklogItemInProgressClicked: { (sprintId: string, backlogItemId: string): void };
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
    const onDetailClicked = (sprintId: string, backlogItemId: string) => {
        if (props.onDetailClicked) {
            props.onDetailClicked(sprintId, backlogItemId);
        }
    };
    const onSprintDetailClicked = (sprintId: string) => {
        if (props.onSprintDetailClicked) {
            props.onSprintDetailClicked(sprintId);
        }
    };
    const onMoveItemToBacklogClicked = (sprintId: string, backlogItemId: string) => {
        if (props.onMoveItemToBacklogClicked) {
            props.onMoveItemToBacklogClicked(sprintId, backlogItemId);
        }
    };
    const onBacklogItemDoneClicked = (sprintId: string, backlogItemId: string) => {
        if (props.onBacklogItemDoneClicked) {
            props.onBacklogItemDoneClicked(sprintId, backlogItemId);
        }
    };
    const onBacklogItemInProgressClicked = (sprintId: string, backlogItemId: string) => {
        if (props.onBacklogItemInProgressClicked) {
            props.onBacklogItemInProgressClicked(sprintId, backlogItemId);
        }
    };
    const classNameToUse = buildClassName(
        css.sprintPlanningPanel,
        css.backlogItemPlanningPanel,
        props.className,
        props.renderMobile ? css.mobile : null
    );
    let renderElts = [];
    addTopActionButtons(renderElts, css.topPanel, props.editMode, props.onAddNewSprintBefore, props.renderMobile);
    let firstElt = true;
    props.sprints.forEach((sprint) => {
        const openedDetailMenuBacklogItemId =
            sprint.id && sprint.id === props.openedDetailMenuInfo?.sprintId ? props.openedDetailMenuInfo.backlogItemId : null;
        let sprintItemElt;
        if (sprint.saved && !sprint.editing) {
            const itemEventHandlers: ItemMenuEventHandlers = {
                handleEvent: (eventName: string, itemId: string) => {
                    if (eventName === "onEditItemClicked") {
                        // TODO: Implement this
                        // dispatch(editBacklogItem(props.id));
                    } else if (eventName === "onRemoveItemClicked") {
                        dispatch(apiDeleteSprint(itemId));
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
                        showDetailMenuToLeft={props.showDetailMenuToLeft}
                        showDetailMenu={props.openedDetailMenuSprintId === sprint.id}
                        buildItemMenu={sprintMenuBuilder(itemEventHandlers)}
                        openedDetailMenuBacklogItemId={openedDetailMenuBacklogItemId}
                        renderMobile={props.renderMobile}
                        selectedProductBacklogItemCount={props.selectedProductBacklogItemCount}
                        onExpandCollapse={(id, expand) => {
                            onExpandCollapse(id, expand);
                        }}
                        onAddBacklogItem={() => {
                            onAddBacklogItem(sprint.id);
                        }}
                        onBacklogItemDetailClicked={(backlogItemId: string) => {
                            onDetailClicked(sprint.id, backlogItemId);
                        }}
                        onSprintDetailClicked={() => {
                            onSprintDetailClicked(sprint.id);
                        }}
                        onMoveItemToBacklogClicked={(backlogItemId: string) => {
                            onMoveItemToBacklogClicked(sprint.id, backlogItemId);
                        }}
                        onBacklogItemDoneClicked={(backlogItemId: string) => {
                            onBacklogItemDoneClicked(sprint.id, backlogItemId);
                        }}
                        onBacklogItemInProgressClicked={(backlogItemId: string) => {
                            onBacklogItemInProgressClicked(sprint.id, backlogItemId);
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
                    />
                </div>
            );
        }
        firstElt = false;
        renderElts.push(sprintItemElt);
    });
    addBottomActionButtons(renderElts, css.bottomPanel, props.editMode, props.onAddNewSprintAfter, props.renderMobile);
    return <div className={classNameToUse}>{renderElts}</div>;
};

export const SprintPlanningPanel = withTranslation()(InnerSprintPlanningPanel);
