// externals
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

// consts/enums
import { EditMode } from "../../common/componentEnums";

// components
import { ItemMenuPanelCaretPosition, ItemMenuPanel } from "../../atoms/panels/ItemMenuPanel";
import { EditButton } from "../buttons/EditButton";

export interface BacklogItemPartMenuStateProps {
    renderMobile?: boolean;
    showDetailMenuToLeft?: boolean;
}

export interface BacklogItemPartMenuDispatchProps {
    onEditItemClick?: { (): void };
}

export type BacklogItemPartMenuProps = BacklogItemPartMenuStateProps & BacklogItemPartMenuDispatchProps;

export type InnerBacklogItemPartMenuProps = BacklogItemPartMenuProps & WithTranslation;

export const InnerBacklogItemPartMenu: React.FC<InnerBacklogItemPartMenuProps> = (props) => (
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
    </ItemMenuPanel>
);

export const BacklogItemPartMenu = withTranslation()(InnerBacklogItemPartMenu);
