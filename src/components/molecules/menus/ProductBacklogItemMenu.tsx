// externals
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

// components
import { EditButton } from "../buttons/EditButton";
import { CaretPosition, ItemMenuPanel } from "../../atoms/panels/ItemMenuPanel";
import { RemoveButton } from "../buttons/RemoveButton";

// consts/enums
import { EditMode } from "../../common/componentEnums";

export interface BacklogItemMenuStateProps {
    renderMobile?: boolean;
    showDetailMenuToLeft?: boolean;
}

export interface BacklogItemMenuDispatchProps {
    onEditItemClick?: { (): void };
    onRemoveItemClick?: { (): void };
}

export type ProductBacklogItemMenuProps = BacklogItemMenuStateProps & BacklogItemMenuDispatchProps;

export type InnerProductBacklogItemMenuProps = ProductBacklogItemMenuProps & WithTranslation;

export const InnerProductBacklogItemMenu: React.FC<InnerProductBacklogItemMenuProps> = (props) => (
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
