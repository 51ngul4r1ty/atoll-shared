// externals
import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { buildClassName } from "../../../utils";
import { ProjectIcon } from "../../atoms/icons/ProjectIcon";

// components
import { ItemMenuPanelCaretPosition, ItemMenuPanel } from "../../atoms/panels/ItemMenuPanel";
import { SimpleButton } from "../buttons/SimpleButton";

// style
import css from "./ProjectPickerMenu.module.css";

export type ProjectPickerMenuItem = {
    itemId: string;
    itemCaption: string;
};

export type ProjectPickerMenuStateProps = {
    className?: string;
    items: ProjectPickerMenuItem[];
    loading?: boolean;
};

export type ProjectPickerMenuDispatchProps = {
    onItemClick?: { (itemId: string): void };
};

export type ProjectPickerMenuProps = ProjectPickerMenuStateProps & ProjectPickerMenuDispatchProps;

export type InnerProjectPickerMenuProps = ProjectPickerMenuProps & WithTranslation;

export const InnerProjectPickerMenu: React.FC<InnerProjectPickerMenuProps> = (props) => {
    const buttons = props.items.map((item) => {
        return (
            <SimpleButton
                key={item.itemId}
                iconOnLeft
                icon={<ProjectIcon />}
                onClick={() => {
                    if (props.onItemClick) {
                        props.onItemClick(item.itemId);
                    }
                }}
                suppressSpacing
                noWrap
            >
                {item.itemCaption}
            </SimpleButton>
        );
    });
    const className = buildClassName(css.projectPickerMenu, props.className);
    return (
        <ItemMenuPanel className={className} caretPosition={ItemMenuPanelCaretPosition.BottomLeft} loading={props.loading}>
            {buttons}
        </ItemMenuPanel>
    );
};

export const ProjectPickerMenu = withTranslation()(InnerProjectPickerMenu);
