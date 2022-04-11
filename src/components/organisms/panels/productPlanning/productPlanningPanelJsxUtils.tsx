// externals
import * as React from "react";

// components
import { AddButton } from "../../../molecules/buttons/AddButton";

// interfaces/types
import { OnAddedNewBacklogItemForm } from "./productPlanningPanelTypes";

// consts/enums
import { EditMode } from "../../../common/componentEnums";

// utils
import { buildClassName } from "../../../../utils/classNameBuilder";

// style
import css from "./ProductPlanningPanel.module.css";

export const addActionButtons = (
    renderElts: any[],
    editMode: EditMode,
    suppressTopPadding: boolean,
    suppressButtonSpacing: boolean,
    onAddNewBacklogItemForm: OnAddedNewBacklogItemForm
) => {
    if (editMode === EditMode.View) {
        return;
    }
    const actionButtonsClassName = buildClassName(
        css.backlogItemPlanningActionPanel,
        suppressTopPadding ? null : css.embeddedBacklogItemUserStoryFormRow
    );
    renderElts.push(
        <div key="backlogitem-action-buttons" className={actionButtonsClassName}>
            <AddButton
                itemName="story"
                suppressSpacing={suppressButtonSpacing}
                onClick={() => {
                    onAddNewBacklogItemForm("story");
                }}
            />
            <AddButton
                itemName="issue"
                suppressSpacing={suppressButtonSpacing}
                onClick={() => {
                    onAddNewBacklogItemForm("issue");
                }}
            />
        </div>
    );
};
