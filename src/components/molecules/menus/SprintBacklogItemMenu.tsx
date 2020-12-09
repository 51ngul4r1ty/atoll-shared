// externals
// TODO: Look into this... in some places I have "React" instead of "* as React" but the linter prefers the latter
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

// components
import { CaretPosition, ItemMenuPanel } from "../../atoms/panels/ItemMenuPanel";
import { BacklogItemAcceptedButton } from "../buttons/BacklogItemAcceptedButton";
import { BacklogItemDoneButton } from "../buttons/BacklogItemDoneButton";
import { BacklogItemInProgressButton } from "../buttons/BacklogItemInProgressButton";
import { BacklogItemNotStartedButton } from "../buttons/BacklogItemNotStartedButton";
import { BacklogItemReleasedButton } from "../buttons/BacklogItemReleasedButton";
import { MoveToBacklogButton } from "../buttons/MoveToBacklogButton";

// style
import css from "./SprintBacklogItemMenu.module.css";

export interface BacklogItemMenuStateProps {
    renderMobile?: boolean;
    showDetailMenuToLeft?: boolean;
}

export interface BacklogItemMenuDispatchProps {
    onMoveItemToBacklogClicked?: { (): void };
    onBacklogItemAcceptedClicked?: { (): void };
    onBacklogItemDoneClicked?: { (): void };
    onBacklogItemInProgressClicked?: { (): void };
    onBacklogItemNotStartedClicked?: { (): void };
    onBacklogItemReleasedClicked?: { (): void };
}

export type SprintBacklogItemMenuProps = BacklogItemMenuStateProps & BacklogItemMenuDispatchProps;

export type InnerSprintBacklogItemMenuProps = SprintBacklogItemMenuProps & WithTranslation;

export const InnerSprintBacklogItemMenu: React.FC<InnerSprintBacklogItemMenuProps> = (props) => (
    <ItemMenuPanel
        className={css.sprintBacklogItemMenu}
        caretPosition={props.showDetailMenuToLeft || props.renderMobile ? CaretPosition.RightTop : CaretPosition.TopCenter}
    >
        <BacklogItemNotStartedButton
            suppressSpacing
            onClick={() => {
                if (props.onBacklogItemNotStartedClicked) {
                    props.onBacklogItemNotStartedClicked();
                }
            }}
        />
        <BacklogItemInProgressButton
            suppressSpacing
            onClick={() => {
                if (props.onBacklogItemInProgressClicked) {
                    props.onBacklogItemInProgressClicked();
                }
            }}
        />
        <BacklogItemDoneButton
            suppressSpacing
            onClick={() => {
                if (props.onBacklogItemDoneClicked) {
                    props.onBacklogItemDoneClicked();
                }
            }}
        />
        <BacklogItemAcceptedButton
            suppressSpacing
            onClick={() => {
                if (props.onBacklogItemAcceptedClicked) {
                    props.onBacklogItemAcceptedClicked();
                }
            }}
        />
        <BacklogItemReleasedButton
            suppressSpacing
            onClick={() => {
                if (props.onBacklogItemReleasedClicked) {
                    props.onBacklogItemReleasedClicked();
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
