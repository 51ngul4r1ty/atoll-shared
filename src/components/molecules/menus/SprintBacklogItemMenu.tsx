// externals
// TODO: Look into this... in some places I have "React" instead of "* as React" but the linter prefers the latter
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

// components
import { CaretPosition, ItemMenuPanel } from "../../atoms/panels/ItemMenuPanel";
import { BacklogItemDoneButton } from "../buttons/BacklogItemDoneButton";
import { MoveToBacklogButton } from "../buttons/MoveToBacklogButton";

// style
import css from "./SprintBacklogItemMenu.module.css";

export interface BacklogItemMenuStateProps {
    renderMobile?: boolean;
    showDetailMenuToLeft?: boolean;
}

export interface BacklogItemMenuDispatchProps {
    onMoveItemToBacklogClicked?: { (): void };
    onBacklogItemDoneClicked?: { (): void };
}

export type SprintBacklogItemMenuProps = BacklogItemMenuStateProps & BacklogItemMenuDispatchProps;

export type InnerSprintBacklogItemMenuProps = SprintBacklogItemMenuProps & WithTranslation;

export const InnerSprintBacklogItemMenu: React.FC<InnerSprintBacklogItemMenuProps> = (props) => (
    <ItemMenuPanel
        className={css.sprintBacklogItemMenu}
        caretPosition={props.showDetailMenuToLeft || props.renderMobile ? CaretPosition.RightTop : CaretPosition.TopCenter}
    >
        <BacklogItemDoneButton
            suppressSpacing
            onClick={() => {
                if (props.onBacklogItemDoneClicked) {
                    props.onBacklogItemDoneClicked();
                }
            }}
        />
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
