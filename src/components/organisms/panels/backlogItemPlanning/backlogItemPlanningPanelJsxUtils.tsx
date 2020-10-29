// externals
import * as React from "react";

// components
import { AddButton } from "../../../molecules/buttons/AddButton";

// interfaces/types
import { OnAddedNewBacklogItem } from "./backlogItemPlanningPanelTypes";

// consts/enums
import { EditMode } from "../../../molecules/buttons/EditButton";

// utils
import { buildClassName } from "../../../../utils/classNameBuilder";

// style
import css from "./BacklogItemPlanningPanel.module.css";

export const addActionButtons = (
    renderElts: any[],
    editMode: EditMode,
    suppressTopPadding: boolean,
    suppressButtonSpacing: boolean,
    onAddNewBacklogItem: OnAddedNewBacklogItem,
    renderMobile: boolean
) => {
    if (editMode === EditMode.View) {
        return;
    }
    const actionButtonsClassName = buildClassName(
        css.backlogItemPlanningActionPanel,
        suppressTopPadding ? null : css.embeddedBacklogItemUserStoryFormRow,
        renderMobile ? css.mobile : null
    );
    const suppressSpacing = suppressButtonSpacing;
    renderElts.push(
        <div key="backlogitem-action-buttons" className={actionButtonsClassName}>
            <AddButton
                itemName="story"
                suppressSpacing={suppressButtonSpacing}
                onClick={() => {
                    onAddNewBacklogItem("story");
                }}
            />
            <AddButton
                itemName="issue"
                suppressSpacing={suppressButtonSpacing}
                onClick={() => {
                    onAddNewBacklogItem("issue");
                }}
            />
        </div>
    );
};