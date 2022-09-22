// externals
import * as React from "react";

// components
import { StandardInput } from "../../atoms/inputs/StandardInput";
import { CancelButton } from "../../molecules/buttons/CancelButton";
import { DoneButton } from "../../molecules/buttons/DoneButton";

// const/enums
import { ItemMenuPanelCaretPosition } from "../../atoms/panels/ItemMenuPanel";

// style
import commonCss from "./common/common.module.css";
import css from "./SprintDetailForm.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

// consts/enums
import { DateInputPickerMode } from "../../atoms/inputs/dateInput/DateInput";

// components
import { DateInput } from "../../atoms/inputs/dateInput/DateInput";

// interfaces/types
import { DateOnly } from "../../../types/dateTypes";
import { SprintDatePicker, SprintDatePickerMode } from "../../molecules/pickers/SprintDatePicker";

export interface SprintDetailFormEditableFields {
    sprintName: string;
    startDate: DateOnly;
    finishDate: DateOnly;
    id: string;
}

export interface SprintDetailFormEditableFieldsWithInstanceId extends SprintDetailFormEditableFields {
    instanceId: number;
}

export enum SprintDetailShowingPicker {
    None = 0,
    StartDate = 1,
    FinishDate = 2
}

export interface SprintDetailFormStateProps extends SprintDetailFormEditableFieldsWithInstanceId {
    className?: string;
    editing: boolean;
    renderMobile?: boolean;
    showPicker?: SprintDetailShowingPicker;
}

export interface SprintDetailFormDispatchProps {
    onDoneClick?: { (id: string, instanceId: number): void };
    onCancelClick?: { (id: string, instanceId: number): void };
    onDataUpdate?: { (props: SprintDetailFormEditableFieldsWithInstanceId): void };
    onShowPicker?: { (showingPicker: SprintDetailShowingPicker): void };
    onHidePicker?: { (): void };
}

export type SprintDetailFormProps = SprintDetailFormStateProps & SprintDetailFormDispatchProps;

export const SprintDetailForm: React.FC<SprintDetailFormProps> = (props) => {
    const showDatePicker = (showingPicker: SprintDetailShowingPicker) => {
        if (props.onShowPicker) {
            props.onShowPicker(showingPicker);
        }
    };
    const hideDatePicker = () => {
        if (props.onHidePicker) {
            props.onHidePicker();
        }
    };
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
            <div className={buildClassName(css.sprintForm, css.formRow)}>
                <StandardInput
                    inputId="sprintName"
                    className={css.sprintNameInput}
                    labelText="Sprint Name"
                    placeHolder="New Sprint"
                    inputValue={props.sprintName}
                    onChange={(value) => {
                        handleDataUpdate({ ...prevData, sprintName: value });
                    }}
                />
                <DateInput
                    inputId={`sprint${props.id}StartDateInput`}
                    itemType="startDate"
                    className={css.startDateInput}
                    caretPosition={props.renderMobile ? ItemMenuPanelCaretPosition.TopRight : ItemMenuPanelCaretPosition.TopLeft}
                    labelText="Start"
                    inputValue={props.startDate}
                    pickerMode={DateInputPickerMode.RangeAltIsFinishDate}
                    buildDatePicker={(
                        startDate: DateOnly | null | undefined,
                        finishDate: DateOnly | null | undefined,
                        pickingStartDate: boolean,
                        onDateChange: (date: DateOnly) => void
                    ) => (
                        <SprintDatePicker
                            startDate={startDate}
                            finishDate={finishDate}
                            pickerMode={pickingStartDate ? SprintDatePickerMode.StartDate : SprintDatePickerMode.FinishDate}
                            suppressPadding
                            onStartDateChange={onDateChange}
                            onFinishDateChange={onDateChange}
                        />
                    )}
                    showPicker={props.showPicker === SprintDetailShowingPicker.StartDate}
                    rangeAltValue={props.finishDate}
                    onChange={(value) => {
                        const startDate = DateOnly.fromString(value);
                        if (startDate !== null) {
                            handleDataUpdate({ ...prevData, startDate });
                        }
                    }}
                    onInputFocus={() => {
                        showDatePicker(SprintDetailShowingPicker.StartDate);
                    }}
                    onInputFocusLost={(e, notLostToDatePicker) => {
                        if (notLostToDatePicker) {
                            hideDatePicker();
                        }
                    }}
                />
                <DateInput
                    inputId={`sprint${props.id}FinishDateInput`}
                    itemType="finishDate"
                    className={css.finishDateInput}
                    caretPosition={ItemMenuPanelCaretPosition.TopRight}
                    labelText="Finish"
                    inputValue={props.finishDate}
                    pickerMode={DateInputPickerMode.RangeAltIsStartDate}
                    buildDatePicker={(
                        startDate: DateOnly | null | undefined,
                        finishDate: DateOnly | null | undefined,
                        pickingStartDate: boolean,
                        onDateChange: (date: DateOnly) => void
                    ) => (
                        <SprintDatePicker
                            startDate={startDate}
                            finishDate={finishDate}
                            pickerMode={pickingStartDate ? SprintDatePickerMode.StartDate : SprintDatePickerMode.FinishDate}
                            suppressPadding
                            onStartDateChange={onDateChange}
                            onFinishDateChange={onDateChange}
                        />
                    )}
                    showPicker={props.showPicker === SprintDetailShowingPicker.FinishDate}
                    rangeAltValue={props.startDate}
                    onChange={(value) => {
                        const finishDate = DateOnly.fromString(value);
                        if (finishDate !== null) {
                            handleDataUpdate({ ...prevData, finishDate });
                        }
                    }}
                    onInputFocus={() => {
                        showDatePicker(SprintDetailShowingPicker.FinishDate);
                    }}
                    onInputFocusLost={(e, notLostToDatePicker) => {
                        if (notLostToDatePicker) {
                            hideDatePicker();
                        }
                    }}
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
