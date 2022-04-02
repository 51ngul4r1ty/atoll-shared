// externals
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

// components
import { ItemMenuPanelCaretPosition, ItemMenuPanel } from "../../atoms/panels/ItemMenuPanel";
import { JoinButton } from "../buttons/JoinButton";
import { EditButton } from "../buttons/EditButton";
import { RemoveButton } from "../buttons/RemoveButton";

// consts/enums
import { EditMode } from "../../common/componentEnums";

export interface BacklogItemMenuStateProps {
    isJoinItemClickAvailable: () => boolean;
    renderMobile?: boolean;
    showDetailMenuToLeft?: boolean;
}

export interface BacklogItemMenuDispatchProps {
    onEditItemClick?: { (): void };
    onJoinItemClick?: { (): void };
    onRemoveItemClick?: { (): void };
}

export type ProductBacklogItemMenuProps = BacklogItemMenuStateProps & BacklogItemMenuDispatchProps;

export type InnerProductBacklogItemMenuProps = ProductBacklogItemMenuProps & WithTranslation;

export const InnerProductBacklogItemMenu: React.FC<InnerProductBacklogItemMenuProps> = (props) => (
    <ItemMenuPanel
        caretPosition={
            props.showDetailMenuToLeft || props.renderMobile
                ? ItemMenuPanelCaretPosition.RightTop
                : ItemMenuPanelCaretPosition.TopCenter
        }
    >
        <JoinButton
            suppressSpacing
            disabled={!props.isJoinItemClickAvailable()}
            onClick={() => {
                if (props.onJoinItemClick) {
                    props.onJoinItemClick();
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
        <EditButton
            mode={EditMode.View}
            suppressSpacing
            onClick={() => {
                if (props.onEditItemClick) {
                    props.onEditItemClick();
                }
            }}
        />
    </ItemMenuPanel>
);

export const ProductBacklogItemMenu = withTranslation()(InnerProductBacklogItemMenu);
