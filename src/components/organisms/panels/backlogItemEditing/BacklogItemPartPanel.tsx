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
import { StandardInput } from "../../../atoms/inputs/StandardInput";
import { isValidStringEstimate } from "../../../../utils/validationUtils";

export const InnerBacklogItemPartPanel: React.FC<BacklogItemPartPanelProps> = (props) => {
    const isReadOnly = !props.editable;
    const splitsPanelCollapsedClassName = buildClassName(
        isReadOnly ? commonCss.readOnly : null,
        commonCss.form,
        css.partPanelCollapsed,
        isReadOnly ? css.readOnly : null,
        css.splitPanel
    );
    const splitsPanelExpandedClassName = buildClassName(
        isReadOnly ? commonCss.readOnly : null,
        commonCss.form,
        css.partPanelExpanded,
        isReadOnly ? css.readOnly : null,
        css.splitPanel
    );
    const splitCaption = `Split ${props.partIndex}/${props.totalParts}`;
    const assignedSprintName = props.sprintName || "(unallocated)";
    const collapsedElts = (
        <div className={splitsPanelCollapsedClassName}>
            <div className={css.splitCaption}>{splitCaption}</div>
            <div>{assignedSprintName}</div>
        </div>
    );
    const sprintNameInput = (
        <StandardInput
            inputId="partSprintName"
            labelText="Sprint"
            placeHolder=""
            readOnly={true}
            disabled={!isReadOnly}
            inputValue={props.sprintName}
        />
    );
    const pointsInput = (
        <StandardInput
            inputId="partPoints"
            labelText="Points"
            placeHolder=""
            readOnly={isReadOnly}
            inputValue={props.points}
            required
            onChange={(value) => {
                if (props.onPointsUpdate) {
                    props.onPointsUpdate(value);
                }
            }}
            validator={(value) => {
                return isValidStringEstimate(value);
            }}
        />
    );
    const percentageInput = (
        <StandardInput
            inputId="percentage"
            labelText="Percentage"
            placeHolder=""
            readOnly={true}
            disabled={!isReadOnly}
            inputValue={`${props.percentage}`}
        />
    );
    const expandedElts = (
        <div className={splitsPanelExpandedClassName}>
            <div className={css.partPanelTitleRow}>
                <div className={css.splitCaption}>{splitCaption}</div>
            </div>
            <div className={buildClassName(css.partPanelContentRow, css.threeCellRow)}>
                {sprintNameInput}
                {pointsInput}
                {percentageInput}
            </div>
        </div>
    );
    return props.expanded ? expandedElts : collapsedElts;
};

export const BacklogItemPartPanel = withTranslation()(InnerBacklogItemPartPanel);
