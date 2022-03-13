// externals
import * as React from "react";
import { withTranslation } from "react-i18next";
// import { useState } from "react";

// style
import css from "./BacklogItemPartPanel.module.css";
import commonCss from "../../forms/common/common.module.css";

// utils
import { buildClassName } from "../../../../utils/classNameBuilder";

// interfaces/types
import { BacklogItemPartPanelProps } from "./backlogItemPartPanelTypes";

export const InnerBacklogItemPartPanel: React.FC<BacklogItemPartPanelProps> = (props) => {
    // logger.info("render(InnerBacklogItemPlanningPanel)", [loggingTags.DRAG_BACKLOGITEM]);
    const isReadOnly = !props.editable;
    const splitsPanelClassName = buildClassName(
        isReadOnly ? commonCss.readOnly : null,
        commonCss.form,
        css.partPanel,
        isReadOnly ? css.readOnly : null,
        css.splitPanel
    );
    const splitCaption = `Split ${props.partIndex}/${props.totalParts}`;
    const assignedSprintName = props.sprintName || "(unallocated)";
    return (
        <div className={splitsPanelClassName}>
            <div className={css.splitCaption}>{splitCaption}</div>
            <div>{assignedSprintName}</div>
        </div>
    );
};

export const BacklogItemPartPanel = withTranslation()(InnerBacklogItemPartPanel);
