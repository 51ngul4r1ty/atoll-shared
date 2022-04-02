// externals
import * as React from "react";
import { useDispatch } from "react-redux";
import { withTranslation } from "react-i18next";

// style
import css from "./BacklogItemPartPanel.module.css";
import commonCss from "../../forms/common/common.module.css";

// interfaces/types
import type { BacklogItemPartPanelProps } from "./backlogItemPartPanelTypes";

// utils
import { buildClassName } from "../../../../utils/classNameBuilder";
import { isValidStringEstimate } from "../../../../utils/validationUtils";

// components
import { CancelButton } from "../../../molecules/buttons/CancelButton";
import { DoneButton } from "../../../molecules/buttons/DoneButton";
import { ItemDetailButton } from "../../../molecules/buttons/ItemDetailButton";
import { StandardInput } from "../../../atoms/inputs/StandardInput";

// actions
import { cancelEditBacklogItemPart, updateBacklogItemPart } from "../../../../actions/backlogItemPartActions";

export const InnerBacklogItemPartPanel: React.FC<BacklogItemPartPanelProps> = (props) => {
    const dispatch = useDispatch();
    const showDetailMenu = props.showDetailMenu && props.buildItemMenu;
    const detailMenu = showDetailMenu ? props.buildItemMenu(props.partId, props.showDetailMenuToLeft) : null;
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
    const actionButtonContainerClassName = buildClassName(css.centerCell, css.actionButtonContainer);
    const handleDoneClick = () => {
        dispatch(updateBacklogItemPart(props.partId));
    };
    const handleCancelClick = () => {
        dispatch(cancelEditBacklogItemPart(props.partId));
    };
    const actionButtonPanel = (
        <div className={css.actionButtonPanel}>
            <div />
            <div className={actionButtonContainerClassName}>
                <DoneButton
                    className={css.actionButton}
                    onClick={() => {
                        handleDoneClick();
                    }}
                />
            </div>
            <div className={actionButtonContainerClassName}>
                <CancelButton
                    className={css.actionButton}
                    onClick={() => {
                        handleCancelClick();
                    }}
                />
            </div>
        </div>
    );
    const inputRow = props.editable ? (
        <div className={buildClassName(css.partPanelContentRow, css.fourCellRow)}>
            {sprintNameInput}
            {pointsInput}
            {percentageInput}
            {actionButtonPanel}
        </div>
    ) : (
        <div className={buildClassName(css.partPanelContentRow, css.threeCellRow)}>
            {sprintNameInput}
            {pointsInput}
            {percentageInput}
        </div>
    );

    const expandedElts = (
        <div className={splitsPanelExpandedClassName}>
            <div className={css.partPanelExpanded}>
                <div className={css.partPanelTitleRow}>
                    <div className={css.splitCaption}>{splitCaption}</div>
                </div>
                {inputRow}
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
    return props.expanded ? expandedElts : collapsedElts;
};

export const BacklogItemPartPanel = withTranslation()(InnerBacklogItemPartPanel);
