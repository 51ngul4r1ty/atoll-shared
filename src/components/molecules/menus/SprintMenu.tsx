// externals
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";

// components
import { CaretPosition, ItemMenuPanel } from "../../atoms/panels/ItemMenuPanel";
import { RemoveButton } from "../buttons/RemoveButton";

export interface BacklogItemMenuStateProps {
    renderMobile?: boolean;
    showDetailMenuToLeft?: boolean;
}

export interface BacklogItemMenuDispatchProps {
    onEditItemClicked?: { (): void };
    onRemoveItemClicked?: { (): void };
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
                if (props.onRemoveItemClicked) {
                    props.onRemoveItemClicked();
                }
            }}
        />
        {/* <EditButton
            mode={EditMode.View}
            suppressSpacing
            onClick={() => {
                if (props.onEditItemClicked) {
                    props.onEditItemClicked();
                }
            }}
        /> */}
    </ItemMenuPanel>
);

export const SprintMenu = withTranslation()(InnerSprintMenu);
