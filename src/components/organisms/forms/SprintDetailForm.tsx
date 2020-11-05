// externals
import React, { Component } from "react";

// components
import { LabeledInput } from "../../atoms/inputs/LabeledInput";
import { CancelButton } from "../../molecules/buttons/CancelButton";
import { DoneButton } from "../../molecules/buttons/DoneButton";

// style
import commonCss from "./common/common.module.css";
import css from "./SprintDetailForm.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

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
    // const handleStoryPaste = (fields: SprintDetailFormEditableFieldsWithInstanceId) => {
    //     const previousRolePhrase = props.rolePhrase || "";
    //     const newRolePhrase = fields.rolePhrase || "";
    //     const isPaste = previousRolePhrase.length === 0 && newRolePhrase.length > 1;
    //     if (isPaste && isStoryPaste(newRolePhrase)) {
    //         const storyPhrases = getStoryPhrases(newRolePhrase);
    //         fields.rolePhrase = storyPhrases.rolePhrase;
    //         fields.storyPhrase = storyPhrases.storyPhrase;
    //         fields.reasonPhrase = storyPhrases.reasonPhrase || "";
    //     }
    // };
    // const handleDataUpdate = (fields: SprintDetailFormEditableFieldsWithInstanceId) => {
    //     this.handleStoryPaste(fields);
    //     if (props.onDataUpdate) {
    //         props.onDataUpdate(fields);
    //     }
    // };
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
    // const estimateValue = props.estimate ? `${props.estimate}` : "";
    // const issuePlaceholder = "without <issue reason>";
    // const storyPlaceholder = "so that I can <derive value>";
    // const placeholderText = props.type === "issue" ? issuePlaceholder : storyPlaceholder;
    // const prevData: SprintDetailFormEditableFieldsWithInstanceId = {
    //     id: props.id,
    //     friendlyId: props.friendlyId,
    //     friendlyIdDisabled: props.friendlyIdDisabled,
    //     instanceId: props.instanceId,
    //     estimate: props.estimate,
    //     externalId: props.externalId,
    //     storyPhrase: props.storyPhrase,
    //     rolePhrase: props.rolePhrase,
    //     reasonPhrase: props.reasonPhrase
    // };
    // const storyPhraseInput = (
    //     <LabeledInput
    //         inputId="userStoryStoryPhrase"
    //         labelText="Story phrase"
    //         placeHolder="I can <something>"
    //         inputValue={props.storyPhrase}
    //         required
    //         onChange={(value) => {
    //             this.handleDataUpdate({ ...prevData, storyPhrase: value });
    //         }}
    //     />
    // );
    // const reasonPhraseInput = (
    //     <LabeledInput
    //         inputId="userStoryReasonPhrase"
    //         labelText="Reason phrase"
    //         placeHolder={placeholderText}
    //         inputValue={props.reasonPhrase}
    //         onChange={(value) => {
    //             this.handleDataUpdate({ ...prevData, reasonPhrase: value });
    //         }}
    //     />
    // );
    // const estimateInput = (
    //     <LabeledInput
    //         inputId="userStoryEstimate"
    //         labelText="Estimate"
    //         size={3}
    //         inputValue={estimateValue}
    //         onChange={(value) => {
    //             const valueToUse = value.trim();
    //             const estimate = valueToUse ? parseInt(valueToUse) : null;
    //             this.handleDataUpdate({ ...prevData, estimate });
    //         }}
    //     />
    // );
    // const externalIdInput = (
    //     <LabeledInput
    //         inputId="userStoryExternalId"
    //         labelText="External ID"
    //         inputValue={props.externalId}
    //         onChange={(value) => {
    //             this.handleDataUpdate({ ...prevData, externalId: value });
    //         }}
    //     />
    // );
    // const friendlyIdInput = (
    //     <LabeledInput
    //         inputId="userStoryFriendlyId"
    //         labelText="ID"
    //         inputValue={props.friendlyId}
    //         disabled={props.friendlyIdDisabled}
    //         onChange={(value) => {
    //             this.handleDataUpdate({ ...prevData, friendlyId: value });
    //         }}
    //     />
    // );
    const actionButtonPanel = (
        <div className={css.actionButtonPanel}>
            <div />
            <div className={css.centerCell}>
                <DoneButton
                    onClick={() => {
                        handleDoneClick();
                    }}
                />
            </div>
            <div className={css.centerCell}>
                <CancelButton
                    onClick={() => {
                        handleCancelClick();
                    }}
                />
            </div>
        </div>
    );
    // const mobileForm = (
    //     <>
    //         <div className={buildClassName(css.userStoryFormMobile)}>
    //             <div className={css.mobileFormRow}>{rolePhraseInput}</div>
    //             <div className={css.mobileFormRow}>{storyPhraseInput}</div>
    //             <div className={css.mobileFormRow}>{reasonPhraseInput}</div>
    //             <div className={buildClassName(css.mobileFormRow, css.threeCellRow)}>
    //                 {estimateInput}
    //                 {friendlyIdInput}
    //                 {externalIdInput}
    //             </div>
    //             <div className={css.mobileFormRow}>{actionButtonPanel}</div>
    //         </div>
    //     </>
    // );
    const sprintNameInput = (
        <LabeledInput
            inputId="sprintName"
            labelText="Sprint Name"
            placeHolder="New Sprint"
            inputValue={props.sprintName}
            onChange={(value) => {
                // handleDataUpdate({ ...prevData, rolePhrase: value });
            }}
        />
    );
    const mobileForm = null;
    const desktopForm = (
        <>
            <div className={buildClassName(css.userStoryDescription, css.formRow)}>
                {sprintNameInput}
                {/* {sprintStatusPicker} */}
            </div>
            {/* <div className={buildClassName(css.userStoryExtraFields, css.formRow)}>
                {sprintStartDatePicker}
                {sprintFinishDatePicker}
            </div> */}
        </>
    );
    const formContent = props.renderMobile ? mobileForm : desktopForm;
    return (
        <form
            data-instance-id={props.instanceId}
            data-item-id={props.id}
            className={buildClassName(props.className, commonCss.form, css.form, props.className)}
        >
            {formContent}
        </form>
    );
};
