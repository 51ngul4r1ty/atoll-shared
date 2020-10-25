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

export interface SprintPlanningPanelStateProps {
    className?: string;
    editMode: EditMode;
    renderMobile?: boolean;
    selectedProductBacklogItemCount: number;
    sprints: SprintPlanningPanelSprint[];
}

export interface SprintPlanningPanelDispatchProps {
    onExpandCollapse: { (id: string, expand: boolean): void };
    onAddNewSprint: { (): void };
    onAddBacklogItem: { (sprintId: string): void };
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
    const classNameToUse = buildClassName(
        css.sprintPlanningPanel,
        css.backlogItemPlanningPanel,
        props.className,
        props.renderMobile ? css.mobile : null
    );
    let renderElts = [];
    addActionButtons(renderElts, props.editMode, false, props.onAddNewSprint, props.renderMobile);
    props.sprints.forEach((sprint) => {
        const sprintItemElt = (
            <div key={sprint.name}>
                <SprintPanel
                    {...sprint}
                    editMode={props.editMode}
                    renderMobile={props.renderMobile}
                    selectedProductBacklogItemCount={props.selectedProductBacklogItemCount}
                    onExpandCollapse={(id, expand) => {
                        onExpandCollapse(id, expand);
                    }}
                    onAddBacklogItem={() => {
                        onAddBacklogItem(sprint.id);
                    }}
                />
            </div>
        );
        renderElts.push(sprintItemElt);
    });
    return <div className={classNameToUse}>{renderElts}</div>;
};

export const SprintPlanningPanel = withTranslation()(InnerSprintPlanningPanel);
