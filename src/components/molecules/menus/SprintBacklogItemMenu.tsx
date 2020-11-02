// externals
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

// components
import { CaretPosition, ItemMenuPanel } from "../../atoms/panels/ItemMenuPanel";
import { MoveToBacklogButton } from "../buttons/MoveToBacklogButton";

export interface BacklogItemMenuStateProps {
    renderMobile?: boolean;
    showDetailMenuToLeft?: boolean;
}

export interface BacklogItemMenuDispatchProps {
    onMoveItemToBacklogClicked?: { (): void };
}

export type SprintBacklogItemMenuProps = BacklogItemMenuStateProps & BacklogItemMenuDispatchProps;

export type InnerSprintBacklogItemMenuProps = SprintBacklogItemMenuProps & WithTranslation;

export const InnerSprintBacklogItemMenu: React.FC<InnerSprintBacklogItemMenuProps> = (props) => (
    <ItemMenuPanel
        caretPosition={props.showDetailMenuToLeft || props.renderMobile ? CaretPosition.RightTop : CaretPosition.TopCenter}
    >
        <MoveToBacklogButton
            suppressSpacing
            onClick={() => {
                if (props.onMoveItemToBacklogClicked) {
                    props.onMoveItemToBacklogClicked();
                }
            }}
        />
    </ItemMenuPanel>
);

export const SprintBacklogItemMenu = withTranslation()(InnerSprintBacklogItemMenu);
