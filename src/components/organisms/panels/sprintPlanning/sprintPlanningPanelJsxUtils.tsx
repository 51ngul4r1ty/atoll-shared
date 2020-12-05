// externals
import * as React from "react";

// style
import css from "./SprintPlanningPanel.module.css";

// components
import { AddButton } from "../../../molecules/buttons/AddButton";
import { Checkbox } from "../../../atoms/inputs/Checkbox";

// interfaces/types
import { OnAddNewSprint, OnArchivedFilterChange } from "./sprintPlanningPanelTypes";

// consts/enums
import { EditMode } from "../../../molecules/buttons/EditButton";

// utils
import { buildClassName } from "../../../../utils/classNameBuilder";

export const addActionButtons = (
    renderElts: any[],
    key: string,
    className: string,
    editMode: EditMode,
    onAddNewSprint: OnAddNewSprint,
    onArchivedFilterChange: OnArchivedFilterChange,
    addSprintButtonSuffix: string,
    renderMobile: boolean,
    buttonsEnabled: boolean
) => {
    if (editMode === EditMode.View) {
        return;
    }
    const actionButtonsClassName = buildClassName(css.sprintPlanningActionPanel, className, renderMobile ? css.mobile : null);
    const archivedFilterUiElts = !onArchivedFilterChange ? null : (
        <Checkbox
            className={css.includeArchivedCheckbox}
            inputId="sprintPlanningIncludeArchived"
            labelText="Include Archived Sprints"
            onChange={(checked) => onArchivedFilterChange(checked)}
        />
    );
    renderElts.push(
        <div key={key} className={actionButtonsClassName}>
            <AddButton
                disabled={!buttonsEnabled}
                itemName={`sprint ${addSprintButtonSuffix}`}
                onClick={() => {
                    onAddNewSprint();
                }}
            />
            {archivedFilterUiElts}
        </div>
    );
};

export const addTopActionButtons = (
    renderElts: any[],
    topPanelClassName: string,
    editMode: EditMode,
    onAddNewSprint: OnAddNewSprint,
    onArchivedFilterChanged: OnArchivedFilterChange,
    renderMobile: boolean
) =>
    addActionButtons(
        renderElts,
        "sprint-top-action-buttons",
        topPanelClassName,
        editMode,
        onAddNewSprint,
        onArchivedFilterChanged,
        "before",
        renderMobile,
        false
    );

export const addBottomActionButtons = (
    renderElts: any[],
    bottomPanelClassName: string,
    editMode: EditMode,
    onAddNewSprint: OnAddNewSprint,
    renderMobile: boolean
) =>
    addActionButtons(
        renderElts,
        "sprint-bottom-action-buttons",
        bottomPanelClassName,
        editMode,
        onAddNewSprint,
        null,
        "after",
        renderMobile,
        true
    );
