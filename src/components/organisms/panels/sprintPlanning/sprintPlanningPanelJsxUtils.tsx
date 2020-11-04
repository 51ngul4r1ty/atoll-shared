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
    key: string,
    className: string,
    editMode: EditMode,
    suppressTopPadding: boolean,
    onAddNewSprint: OnAddNewSprint,
    addSprintButtonSuffix: string,
    renderMobile: boolean,
    buttonsEnabled: boolean
) => {
    if (editMode === EditMode.View) {
        return;
    }
    const actionButtonsClassName = buildClassName(
        css.sprintPlanningActionPanel,
        className,
        //        suppressTopPadding ? null : css.embeddedBacklogItemUserStoryFormRow,
        renderMobile ? css.mobile : null
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
        </div>
    );
};

export const addTopActionButtons = (
    renderElts: any[],
    topPanelClassName: string,
    editMode: EditMode,
    suppressTopPadding: boolean,
    onAddNewSprint: OnAddNewSprint,
    renderMobile: boolean
) =>
    addActionButtons(
        renderElts,
        "sprint-top-action-buttons",
        topPanelClassName,
        editMode,
        suppressTopPadding,
        onAddNewSprint,
        "before",
        renderMobile,
        false
    );

export const addBottomActionButtons = (
    renderElts: any[],
    bottomPanelClassName: string,
    editMode: EditMode,
    suppressTopPadding: boolean,
    onAddNewSprint: OnAddNewSprint,
    renderMobile: boolean
) =>
    addActionButtons(
        renderElts,
        "sprint-bottom-action-buttons",
        bottomPanelClassName,
        editMode,
        suppressTopPadding,
        onAddNewSprint,
        "after",
        renderMobile,
        true
    );
