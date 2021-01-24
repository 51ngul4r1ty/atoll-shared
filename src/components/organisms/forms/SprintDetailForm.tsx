// externals
import * as React from "react";

// components
import { StandardInput } from "../../atoms/inputs/StandardInput";
import { CancelButton } from "../../molecules/buttons/CancelButton";
import { DoneButton } from "../../molecules/buttons/DoneButton";

// style
import commonCss from "./common/common.module.css";
import css from "./SprintDetailForm.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";
import { DateInput, DateInputPickerMode } from "../../atoms/inputs/DateInput";

export interface SprintDetailFormEditableFields {
    sprintName: string;
    startDate: Date;
    finishDate: Date;
    id: string;
}

export interface SprintDetailFormEditableFieldsWithInstanceId extends SprintDetailFormEditableFields {
    instanceId: number;
}

export interface SprintDetailFormStateProps extends SprintDetailFormEditableFieldsWithInstanceId {
    className?: string;
    editing: boolean;
    renderMobile?: boolean;
}

export interface SprintDetailFormDispatchProps {
    onDoneClick?: { (id: string, instanceId: number) };
    onCancelClick?: { (id: string, instanceId: number) };
    onDataUpdate?: { (props: SprintDetailFormEditableFieldsWithInstanceId) };
}

export type SprintDetailFormProps = SprintDetailFormStateProps & SprintDetailFormDispatchProps;

export const SprintDetailForm: React.FC<SprintDetailFormProps> = (props) => {
    const handleDataUpdate = (fields: SprintDetailFormEditableFieldsWithInstanceId) => {
        if (props.onDataUpdate) {
            props.onDataUpdate(fields);
        }
    };
    const handleDoneClick = () => {
        const matchingForms = document.querySelectorAll(`[data-instance-id="${props.instanceId}"]`);
        let matchingForm: HTMLFormElement;
        if (matchingForms.length === 1) {
            matchingForm = matchingForms[0] as HTMLFormElement;
        } else {
            const matchingForms = document.querySelectorAll(`[data-item-id="${props.id}"]`);
            if (matchingForms.length === 1) {
                matchingForm = matchingForms[0] as HTMLFormElement;
            }
        }
        if (matchingForm && matchingForm.reportValidity()) {
            if (props.onDoneClick) {
                props.onDoneClick(props.id, props.instanceId);
            }
        }
    };
    const handleCancelClick = () => {
        if (props.onCancelClick) {
            props.onCancelClick(props.id, props.instanceId);
        }
    };
    const actionButtonPanel = (
        <div className={css.actionButtonPanel}>
            <div />
            <div className={css.centerCell}>
                <DoneButton
                    className={css.doneButton}
                    onClick={() => {
                        handleDoneClick();
                    }}
                />
            </div>
            <div className={css.centerCell}>
                <CancelButton
                    className={css.cancelButton}
                    onClick={() => {
                        handleCancelClick();
                    }}
                />
            </div>
        </div>
    );
    const prevData: SprintDetailFormEditableFieldsWithInstanceId = {
        id: props.id,
        sprintName: props.sprintName,
        startDate: props.startDate,
        instanceId: props.instanceId,
        finishDate: props.finishDate
    };
    const formContent = (
        <>
            <div className={buildClassName(css.sprintName, css.formRow)}>
                <StandardInput
                    inputId="sprintName"
                    labelText="Sprint Name"
                    placeHolder="New Sprint"
                    inputValue={props.sprintName}
                    onChange={(value) => {
                        handleDataUpdate({ ...prevData, sprintName: value });
                    }}
                />
                <DateInput
                    inputId="startDateInput"
                    labelText="Start"
                    inputValue={props.startDate}
                    pickerMode={DateInputPickerMode.RangeAltIsFinishDate}
                    rangeAltValue={props.finishDate}
                />
                <DateInput
                    inputId="finishDateInput"
                    labelText="Finish"
                    inputValue={props.finishDate}
                    pickerMode={DateInputPickerMode.RangeAltIsStartDate}
                    rangeAltValue={props.startDate}
                />
            </div>
            {actionButtonPanel}
        </>
    );
    return (
        <form
            data-instance-id={props.instanceId}
            data-item-id={props.id}
            className={buildClassName(props.className, commonCss.form, css.form)}
        >
            {formContent}
        </form>
    );
};
