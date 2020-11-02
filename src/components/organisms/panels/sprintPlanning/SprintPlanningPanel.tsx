// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// style
import css from "./SprintPlanningPanel.module.css";

// utils
import { buildClassName } from "../../../../utils/classNameBuilder";

// interfaces/types
import { SprintPlanningPanelSprint } from "./sprintPlanningPanelTypes";
import { SprintPanel } from "./SprintPanel";
import { addActionButtons } from "./sprintPlanningPanelJsxUtils";
import { EditMode } from "../../../molecules/buttons/EditButton";
import { OpenedDetailMenuInfo } from "../../../../selectors/sprintBacklogSelectors";

export interface SprintPlanningPanelStateProps {
    className?: string;
    editMode: EditMode;
    openedDetailMenuInfo: OpenedDetailMenuInfo;
    renderMobile?: boolean;
    selectedProductBacklogItemCount: number;
    sprints: SprintPlanningPanelSprint[];
}

export interface SprintPlanningPanelDispatchProps {
    onExpandCollapse: { (id: string, expand: boolean): void };
    onAddNewSprint: { (): void };
    onAddBacklogItem: { (sprintId: string): void };
    onDetailClicked: { (sprintId: string, backlogItemId: string): void };
    onMoveItemToBacklogClicked: { (sprintId: string, backlogItemId: string): void };
}

export type SprintPlanningPanelProps = SprintPlanningPanelStateProps & SprintPlanningPanelDispatchProps & WithTranslation;

export const InnerSprintPlanningPanel: React.FC<SprintPlanningPanelProps> = (props) => {
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
    const onMoveItemToBacklogClicked = (sprintId: string, backlogItemId: string) => {
        if (props.onMoveItemToBacklogClicked) {
            props.onMoveItemToBacklogClicked(sprintId, backlogItemId);
        }
    };
    const classNameToUse = buildClassName(
        css.sprintPlanningPanel,
        css.backlogItemPlanningPanel,
        props.className,
        props.renderMobile ? css.mobile : null
    );
    let renderElts = [];
    addActionButtons(renderElts, props.editMode, false, props.onAddNewSprint, props.renderMobile);
    props.sprints.forEach((sprint) => {
        const openedDetailMenuBacklogItemId =
            sprint.id && sprint.id === props.openedDetailMenuInfo.sprintId ? props.openedDetailMenuInfo.backlogItemId : null;
        const sprintItemElt = (
            <div key={sprint.name}>
                <SprintPanel
                    {...sprint}
                    editMode={props.editMode}
                    openedDetailMenuBacklogItemId={openedDetailMenuBacklogItemId}
                    renderMobile={props.renderMobile}
                    selectedProductBacklogItemCount={props.selectedProductBacklogItemCount}
                    onExpandCollapse={(id, expand) => {
                        onExpandCollapse(id, expand);
                    }}
                    onAddBacklogItem={() => {
                        onAddBacklogItem(sprint.id);
                    }}
                    onDetailClicked={(backlogItemId: string) => {
                        onDetailClicked(sprint.id, backlogItemId);
                    }}
                    onMoveItemToBacklogClicked={(backlogItemId: string) => {
                        onMoveItemToBacklogClicked(sprint.id, backlogItemId);
                    }}
                />
            </div>
        );
        renderElts.push(sprintItemElt);
    });
    return <div className={classNameToUse}>{renderElts}</div>;
};

export const SprintPlanningPanel = withTranslation()(InnerSprintPlanningPanel);
