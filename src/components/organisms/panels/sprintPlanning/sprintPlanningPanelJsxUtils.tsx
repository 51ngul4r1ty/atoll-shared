// externals
import * as React from "react";

// components
import { AddButton } from "../../../molecules/buttons/AddButton";

// interfaces/types
import { OnAddNewSprint } from "./sprintPlanningPanelTypes";

// consts/enums
import { EditMode } from "../../../molecules/buttons/EditButton";

// utils
import { buildClassName } from "../../../../utils/classNameBuilder";

// style
import css from "./SprintPlanningPanel.module.css";

export const addActionButtons = (
    renderElts: any[],
    editMode: EditMode,
    suppressTopPadding: boolean,
    onAddNewSprint: OnAddNewSprint,
    renderMobile: boolean
) => {
    if (editMode === EditMode.View) {
        return;
    }
    const actionButtonsClassName = buildClassName(
        css.sprintPlanningActionPanel,
        //        suppressTopPadding ? null : css.embeddedBacklogItemUserStoryFormRow,
        renderMobile ? css.mobile : null
    );
    renderElts.push(
        <div key="sprint-action-buttons" className={actionButtonsClassName}>
            <AddButton
                itemName="sprint"
                onClick={() => {
                    onAddNewSprint();
                }}
            />
        </div>
    );
};
