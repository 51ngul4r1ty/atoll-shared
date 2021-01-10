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

export interface SprintBacklogItemMenuStateProps {
    renderMobile?: boolean;
    showDetailMenuToLeft?: boolean;
}

export interface SprintBacklogItemMenuDispatchProps {
    onMoveItemToBacklogClick?: { (): void };
    onBacklogItemAcceptedClick?: { (): void };
    onBacklogItemDoneClick?: { (): void };
    onBacklogItemInProgressClick?: { (): void };
    onBacklogItemNotStartedClick?: { (): void };
    onBacklogItemReleasedClick?: { (): void };
}

export type SprintBacklogItemMenuProps = SprintBacklogItemMenuStateProps & SprintBacklogItemMenuDispatchProps;

export type InnerSprintBacklogItemMenuProps = SprintBacklogItemMenuProps & WithTranslation;

export const InnerSprintBacklogItemMenu: React.FC<InnerSprintBacklogItemMenuProps> = (props) => (
    <ItemMenuPanel
        className={css.sprintBacklogItemMenu}
        caretPosition={props.showDetailMenuToLeft || props.renderMobile ? CaretPosition.RightTop : CaretPosition.TopCenter}
    >
        <BacklogItemNotStartedButton
            suppressSpacing
            onClick={() => {
                if (props.onBacklogItemNotStartedClick) {
                    props.onBacklogItemNotStartedClick();
                }
            }}
        />
        <BacklogItemInProgressButton
            suppressSpacing
            onClick={() => {
                if (props.onBacklogItemInProgressClick) {
                    props.onBacklogItemInProgressClick();
                }
            }}
        />
        <BacklogItemDoneButton
            suppressSpacing
            onClick={() => {
                if (props.onBacklogItemDoneClick) {
                    props.onBacklogItemDoneClick();
                }
            }}
        />
        <BacklogItemAcceptedButton
            suppressSpacing
            onClick={() => {
                if (props.onBacklogItemAcceptedClick) {
                    props.onBacklogItemAcceptedClick();
                }
            }}
        />
        <BacklogItemReleasedButton
            suppressSpacing
            onClick={() => {
                if (props.onBacklogItemReleasedClick) {
                    props.onBacklogItemReleasedClick();
                }
            }}
        />
        <MoveToBacklogButton
            suppressSpacing
            onClick={() => {
                if (props.onMoveItemToBacklogClick) {
                    props.onMoveItemToBacklogClick();
                }
            }}
        />
    </ItemMenuPanel>
);

export const SprintBacklogItemMenu = withTranslation()(InnerSprintBacklogItemMenu);
