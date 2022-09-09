// externals
import * as React from "react";
import { useState } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { MenuCaretDownIcon, MenuCaretUpIcon } from "../../atoms";
import { ProjectIcon } from "../../atoms/icons/ProjectIcon";
import { ProjectPickerMenu, ProjectPickerMenuItem } from "../../molecules";

// style
import css from "./BottomPanel.module.css";

/* exported types */

export type BottomPanelStateProps = {
    projectPickerOpen: boolean;
    projectName: string;
    projectDescription: string;
};

export type BottomPanelDispatchProps = {};

export type BottomPanelProps = BottomPanelStateProps & BottomPanelDispatchProps & WithTranslation;

/* exported components */

export const InnerBottomPanel: React.FC<BottomPanelProps> = (props) => {
    const [isOpen, setIsOpen] = useState(props.projectPickerOpen || false);
    const showProjectName = !!props.projectName;
    const MenuCaretIcon = isOpen ? MenuCaretDownIcon : MenuCaretUpIcon;
    const projectItems: ProjectPickerMenuItem[] = [
        {
            itemId: "test-id-1",
            itemCaption: "Test Project 1"
        },
        {
            itemId: "test-id-2",
            itemCaption: "Test Project 2"
        }
    ];
    const projectPickerMenu = isOpen ? (
        <ProjectPickerMenu
            className={css.projectPickerMenu}
            items={projectItems}
            onItemClick={(itemId: string) => {
                console.log(`ITEM ID "${itemId}" CLICKED`);
            }}
        />
    ) : null;
    const content = !showProjectName ? null : (
        <div className={css.innerPanel}>
            <div className={css.projectPickerPanel} onClick={() => setIsOpen(!isOpen)}>
                <ProjectIcon className={css.projectIcon} />
                <span title={props.projectDescription}>{props.projectName}</span>
                <MenuCaretIcon className={css.menuCaretIcon} />
            </div>
        </div>
    );

    return (
        <div className={css.bottomPanel}>
            {content}
            {projectPickerMenu}
        </div>
    );
};

export const BottomPanel = withTranslation()(InnerBottomPanel);
