// externals
// TODO: Look into this... in some places I have "React" instead of "* as React" but the linter prefers the latter
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

// components
import { ItemMenuPanelCaretPosition, ItemMenuPanel } from "../../atoms/panels/ItemMenuPanel";
import { BacklogItemAcceptedButton } from "../buttons/BacklogItemAcceptedButton";
import { BacklogItemDoneButton } from "../buttons/BacklogItemDoneButton";
import { BacklogItemInProgressButton } from "../buttons/BacklogItemInProgressButton";
import { BacklogItemNotStartedButton } from "../buttons/BacklogItemNotStartedButton";
import { BacklogItemReleasedButton } from "../buttons/BacklogItemReleasedButton";
import { MoveToBacklogButton } from "../buttons/MoveToBacklogButton";
import { SplitToNextSprintButton } from "../buttons/SplitToNextSprintButton";

// style
import css from "./SprintBacklogItemMenu.module.css";

export interface SprintBacklogItemMenuStateProps {
    busySplittingStory?: boolean;
    menuDisabled?: boolean;
    renderMobile?: boolean;
    showDetailMenuToLeft?: boolean;
    splitToNextSprintAvailable: boolean;
}

export interface SprintBacklogItemMenuDispatchProps {
    onMoveItemToBacklogClick?: { (): void };
    onSplitBacklogItemClick?: { (): void };
    onBacklogItemAcceptedClick?: { (): void };
    onBacklogItemDoneClick?: { (): void };
    onBacklogItemInProgressClick?: { (): void };
    onBacklogItemNotStartedClick?: { (): void };
    onBacklogItemReleasedClick?: { (): void };
}

export type SprintBacklogItemMenuProps = SprintBacklogItemMenuStateProps & SprintBacklogItemMenuDispatchProps;

export type InnerSprintBacklogItemMenuProps = SprintBacklogItemMenuProps & WithTranslation;

export const InnerSprintBacklogItemMenu: React.FC<InnerSprintBacklogItemMenuProps> = (props) => {
    const menuDisabled = props.menuDisabled;
    return (
        <ItemMenuPanel
            className={css.sprintBacklogItemMenu}
            caretPosition={
                props.showDetailMenuToLeft || props.renderMobile
                    ? ItemMenuPanelCaretPosition.RightTop
                    : ItemMenuPanelCaretPosition.TopCenter
            }
        >
            <BacklogItemNotStartedButton
                disabled={menuDisabled}
                suppressSpacing
                onClick={() => {
                    if (props.onBacklogItemNotStartedClick) {
                        props.onBacklogItemNotStartedClick();
                    }
                }}
            />
            <BacklogItemInProgressButton
                disabled={menuDisabled}
                suppressSpacing
                onClick={() => {
                    if (props.onBacklogItemInProgressClick) {
                        props.onBacklogItemInProgressClick();
                    }
                }}
            />
            <BacklogItemDoneButton
                disabled={menuDisabled}
                suppressSpacing
                onClick={() => {
                    if (props.onBacklogItemDoneClick) {
                        props.onBacklogItemDoneClick();
                    }
                }}
            />
            <BacklogItemAcceptedButton
                disabled={menuDisabled}
                suppressSpacing
                onClick={() => {
                    if (props.onBacklogItemAcceptedClick) {
                        props.onBacklogItemAcceptedClick();
                    }
                }}
            />
            <BacklogItemReleasedButton
                disabled={menuDisabled}
                suppressSpacing
                onClick={() => {
                    if (props.onBacklogItemReleasedClick) {
                        props.onBacklogItemReleasedClick();
                    }
                }}
            />
            <SplitToNextSprintButton
                disabled={menuDisabled || !props.splitToNextSprintAvailable}
                busy={props.busySplittingStory}
                suppressSpacing
                onClick={() => {
                    if (props.onSplitBacklogItemClick) {
                        props.onSplitBacklogItemClick();
                    }
                }}
            />
            <MoveToBacklogButton
                disabled={menuDisabled}
                suppressSpacing
                onClick={() => {
                    if (props.onMoveItemToBacklogClick) {
                        props.onMoveItemToBacklogClick();
                    }
                }}
            />
        </ItemMenuPanel>
    );
};

export const SprintBacklogItemMenu = withTranslation()(InnerSprintBacklogItemMenu);
