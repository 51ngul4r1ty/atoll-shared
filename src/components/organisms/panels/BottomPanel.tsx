// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

// interfaces/types
import type { Project } from "../../../reducers/project/projectReducerTypes";

// components
import { MenuCaretDownIcon, MenuCaretUpIcon } from "../../atoms";
import { ProjectIcon } from "../../atoms/icons/ProjectIcon";
import { ProjectPickerMenu } from "../../molecules";

// consts/enums
import { ITEM_MENU_OPENER_DATA_CLASS } from "../../common";

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
    onMenuClosed?: () => void;
    onProjectItemClicked?: (itemId: string) => void;
};

export type BottomPanelProps = BottomPanelStateProps & BottomPanelDispatchProps & WithTranslation;

/* exported components */

export const InnerBottomPanel: React.FC<BottomPanelProps> = (props) => {
    const showProjectName = !!props.projectName;
    const isOpen = props.projectPickerOpen;
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
                data-class={ITEM_MENU_OPENER_DATA_CLASS}
                onClick={() => {
                    const isNowOpen = !isOpen;
                    if (isNowOpen && props.onMenuOpened) {
                        props.onMenuOpened();
                    }
                    if (!isNowOpen && props.onMenuClosed) {
                        props.onMenuClosed();
                    }
                }}
            >
                <ProjectIcon className={css.projectIcon} />
                <span title={props.projectDescription}>{props.projectName}</span>
                <MenuCaretIcon className={css.menuCaretIcon} />
            </div>
            <div>{projectPickerMenu}</div>
        </div>
    );

    return <div className={css.bottomPanel}>{content}</div>;
};

export const BottomPanel = withTranslation()(InnerBottomPanel);
