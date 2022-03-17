// externals
import * as React from "react";
import { withTranslation } from "react-i18next";

// style
import css from "./BacklogItemPartPanel.module.css";
import commonCss from "../../forms/common/common.module.css";

// interfaces/types
import { BacklogItemPartPanelProps } from "./backlogItemPartPanelTypes";
import { StandardInput } from "../../../atoms/inputs/StandardInput";
import { ItemDetailButton } from "../../../molecules/buttons/ItemDetailButton";

// utils
import { buildClassName } from "../../../../utils/classNameBuilder";
import { isValidStringEstimate } from "../../../../utils/validationUtils";

export const InnerBacklogItemPartPanel: React.FC<BacklogItemPartPanelProps> = (props) => {
    const busyButtonName = "";
    const menuDisabled = false;
    const showDetailMenu = props.showDetailMenu && props.buildItemMenu;
    const detailMenu = showDetailMenu
        ? props.buildItemMenu(props.partId, props.showDetailMenuToLeft, menuDisabled, busyButtonName)
        : null;
    const itemDetailMenuElts = !showDetailMenu ? null : (
        <div className={buildClassName(css.partDetailMenu, props.showDetailMenuToLeft ? css.partMenuToLeft : null)}>
            {detailMenu}
        </div>
    );
    const isReadOnly = !props.editable;
    const splitsPanelCollapsedClassName = buildClassName(
        isReadOnly ? commonCss.readOnly : null,
        commonCss.form,
        css.partPanelCollapsed,
        isReadOnly ? css.readOnly : null
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
    const splitsPanelExpandedClassName = buildClassName(
        isReadOnly ? commonCss.readOnly : null,
        commonCss.form,
        isReadOnly ? css.readOnly : null
    );
    const expandedElts = (
        <div className={splitsPanelExpandedClassName}>
            <div className={css.partPanelExpanded}>
                <div className={css.partPanelTitleRow}>
                    <div className={css.splitCaption}>{splitCaption}</div>
                </div>
                <div className={buildClassName(css.partPanelContentRow, css.threeCellRow)}>
                    {sprintNameInput}
                    {pointsInput}
                    {percentageInput}
                </div>
            </div>
            <ItemDetailButton
                itemId={props.partId}
                itemType="backlog-item"
                hasDetails={props.hasDetails}
                isLoading={false}
                className={css.partDetailButton}
                onDetailClick={() => props.onDetailClick()}
            />
            {itemDetailMenuElts}
        </div>
    );
    console.log(`==== showDetailMenu: ${props.showDetailMenu}`);
    if (itemDetailMenuElts && props.expanded) {
        console.log(`**** rendering itemDetailMenuElts for part ID: ${props.partId}`);
    } else if (!itemDetailMenuElts) {
        console.log(`---- NOT rendering itemDetailMenuElts for part ID: ${props.partId} (!itemDetailMenuElts)`);
    } else {
        console.log(`---- NOT rendering itemDetailMenuElts for part ID: ${props.partId}`);
    }
    return props.expanded ? expandedElts : collapsedElts;
};

export const BacklogItemPartPanel = withTranslation()(InnerBacklogItemPartPanel);
