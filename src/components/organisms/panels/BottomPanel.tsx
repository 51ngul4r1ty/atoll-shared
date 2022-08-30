// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { ProjectIcon } from "../../atoms/icons/ProjectIcon";

// style
import css from "./BottomPanel.module.css";

/* exported types */

export type BottomPanelStateProps = {
    projectName: string;
    projectDescription: string;
};

export type BottomPanelDispatchProps = {};

export type BottomPanelProps = BottomPanelStateProps & BottomPanelDispatchProps & WithTranslation;

/* exported components */

export const InnerBottomPanel: React.FC<BottomPanelProps> = (props) => {
    const showProjectName = !!props.projectName;
    const content = !showProjectName ? null : (
        <div className={css.innerPanel}>
            <ProjectIcon className={css.projectIcon} /> <span title={props.projectDescription}>{props.projectName}</span>
        </div>
    );

    return <div className={css.bottomPanel}>{content}</div>;
};

export const BottomPanel = withTranslation()(InnerBottomPanel);
