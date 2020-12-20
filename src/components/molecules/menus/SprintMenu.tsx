// externals
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

// components
import { CaretPosition, ItemMenuPanel } from "../../atoms/panels/ItemMenuPanel";
import { ArchiveButton } from "../buttons/ArchiveButton";
import { ArchiveCancelButton } from "../buttons/ArchiveCancelButton";
import { RemoveButton } from "../buttons/RemoveButton";

export interface BacklogItemMenuStateProps {
    renderMobile?: boolean;
    showDetailMenuToLeft?: boolean;
}

export interface BacklogItemMenuDispatchProps {
    onArchiveItemClick?: { (): void };
    onUnarchiveItemClick?: { (): void };
    onEditItemClick?: { (): void };
    onRemoveItemClick?: { (): void };
}

export type SprintMenuProps = BacklogItemMenuStateProps & BacklogItemMenuDispatchProps;

export type InnerSprintMenuProps = SprintMenuProps & WithTranslation;

export const InnerSprintMenu: React.FC<InnerSprintMenuProps> = (props) => (
    <ItemMenuPanel
        caretPosition={props.showDetailMenuToLeft || props.renderMobile ? CaretPosition.RightTop : CaretPosition.TopCenter}
    >
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
