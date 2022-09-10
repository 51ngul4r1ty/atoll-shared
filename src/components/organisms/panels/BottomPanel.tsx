// externals
import * as React from "react";
import { useState } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Project } from "../../../reducers/project/projectReducerTypes";
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
    projectItemsLoading: boolean;
    projects: Project[];
};

export type BottomPanelDispatchProps = {
    onMenuOpened?: () => void;
    onProjectItemClicked?: (itemId: string) => void;
};

export type BottomPanelProps = BottomPanelStateProps & BottomPanelDispatchProps & WithTranslation;

/* exported components */

export const InnerBottomPanel: React.FC<BottomPanelProps> = (props) => {
    const [isOpen, setIsOpen] = useState(props.projectPickerOpen || false);
    const showProjectName = !!props.projectName;
    const MenuCaretIcon = isOpen ? MenuCaretDownIcon : MenuCaretUpIcon;
    const projectItems = props.projects.map((project) => ({
        itemId: project.id,
        itemCaption: project.name
    }));
    const projectPickerMenu = isOpen ? (
        <ProjectPickerMenu
            className={css.projectPickerMenu}
            items={projectItems}
            loading={props.projectItemsLoading}
            onItemClick={(itemId: string) => {
                if (props.onProjectItemClicked) {
                    props.onProjectItemClicked(itemId);
                }
            }}
        />
    ) : null;
    const content = !showProjectName ? null : (
        <div className={css.innerPanel}>
            <div
                className={css.projectPickerPanel}
                onClick={() => {
                    const isNowOpen = !isOpen;
                    setIsOpen(isNowOpen);
                    if (isNowOpen && props.onMenuOpened) {
                        props.onMenuOpened();
                    }
                }}
            >
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
