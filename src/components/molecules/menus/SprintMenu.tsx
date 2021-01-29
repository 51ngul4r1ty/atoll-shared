// externals
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

// consts/enums
import { EditMode } from "../../common/componentEnums";

// components
import { ItemMenuPanelCaretPosition, ItemMenuPanel } from "../../atoms/panels/ItemMenuPanel";
import { ArchiveButton } from "../buttons/ArchiveButton";
import { ArchiveCancelButton } from "../buttons/ArchiveCancelButton";
import { EditButton } from "../buttons/EditButton";
import { RemoveButton } from "../buttons/RemoveButton";

export interface SprintMenuStateProps {
    renderMobile?: boolean;
    showDetailMenuToLeft?: boolean;
}

export interface SprintMenuDispatchProps {
    onArchiveItemClick?: { (): void };
    onUnarchiveItemClick?: { (): void };
    onEditItemClick?: { (): void };
    onRemoveItemClick?: { (): void };
}

export type SprintMenuProps = SprintMenuStateProps & SprintMenuDispatchProps;

export type InnerSprintMenuProps = SprintMenuProps & WithTranslation;

export const InnerSprintMenu: React.FC<InnerSprintMenuProps> = (props) => (
    <ItemMenuPanel
        caretPosition={
            props.showDetailMenuToLeft || props.renderMobile
                ? ItemMenuPanelCaretPosition.RightTop
                : ItemMenuPanelCaretPosition.TopCenter
        }
    >
        <EditButton
            mode={EditMode.View}
            suppressSpacing
            onClick={() => {
                if (props.onEditItemClick) {
                    props.onEditItemClick();
                }
            }}
        />
        <RemoveButton
            suppressSpacing
            onClick={() => {
                if (props.onRemoveItemClick) {
                    props.onRemoveItemClick();
                }
            }}
        />
        <ArchiveButton
            suppressSpacing
            onClick={() => {
                if (props.onArchiveItemClick) {
                    props.onArchiveItemClick();
                }
            }}
        />
        <ArchiveCancelButton
            suppressSpacing
            onClick={() => {
                if (props.onUnarchiveItemClick) {
                    props.onUnarchiveItemClick();
                }
            }}
        />
    </ItemMenuPanel>
);

export const SprintMenu = withTranslation()(InnerSprintMenu);
