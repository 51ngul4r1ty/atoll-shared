// externals
import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { ProjectIcon } from "../../atoms/icons/ProjectIcon";

// style
import css from "./BottomPanel.module.css";

/* exported types */

export type BottomPanelStateProps = {};

export type BottomPanelDispatchProps = {};

export type BottomPanelProps = BottomPanelStateProps & BottomPanelDispatchProps & WithTranslation;

/* exported components */

export const InnerBottomPanel: React.FC<BottomPanelProps> = (props) => {
    return (
        <div className={css.bottomPanel}>
            <div className={css.innerPanel}>
                <ProjectIcon className={css.projectIcon} /> Atoll
            </div>
        </div>
    );
};

export const BottomPanel = withTranslation()(InnerBottomPanel);
