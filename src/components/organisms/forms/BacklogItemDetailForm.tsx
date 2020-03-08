// externals
import React, { Component } from "react";

// components
import { LabeledInput } from "../../atoms/forms/LabeledInput";
import { CancelButton } from "../../molecules/buttons/CancelButton";
import { DoneButton } from "../../molecules/buttons/DoneButton";

// style
import css from "./BacklogItemDetailForm.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

// interfaces/types
import { BacklogItemType } from "../../../reducers/backlogItemsReducer";

export interface BacklogItemDetailFormEditableFields {
    estimate: number | null;
    externalId: string;
    storyPhrase: string;
    rolePhrase: string;
    reasonPhrase: string;
}

export interface BacklogItemDetailFormEditableFieldsWithInstanceId extends BacklogItemDetailFormEditableFields {
    instanceId: number;
}

export interface BacklogItemDetailFormStateProps extends BacklogItemDetailFormEditableFieldsWithInstanceId {
    className?: string;
    type: BacklogItemType;
    editing: boolean;
}

export interface BacklogItemDetailFormDispatchProps {
    onDoneClick?: { (instanceId: number) };
    onCancelClick?: { (instanceId: number) };
    onDataUpdate?: { (props: BacklogItemDetailFormEditableFieldsWithInstanceId) };
}

export type BacklogItemDetailFormProps = BacklogItemDetailFormStateProps & BacklogItemDetailFormDispatchProps;

export class BacklogItemDetailForm extends Component<BacklogItemDetailFormProps> {
    constructor(props) {
        super(props);
    }
    handleDataUpdate = (fields: BacklogItemDetailFormEditableFieldsWithInstanceId) => {
        if (this.props.onDataUpdate) {
            this.props.onDataUpdate(fields);
        }
    };
    handleDoneClick = () => {
        const matchingForms = document.querySelectorAll(`[data-instance-id="${this.props.instanceId}"]`);
        if (matchingForms.length === 1) {
            const matchingForm = matchingForms[0] as HTMLFormElement;
            if (matchingForm.reportValidity()) {
                if (this.props.onDoneClick) {
                    this.props.onDoneClick(this.props.instanceId);
                }
            }
        }
    };
    handleCancelClick = () => {
        if (this.props.onCancelClick) {
            this.props.onCancelClick(this.props.instanceId);
        }
    };
    render() {
        const estimateValue = this.props.estimate ? `${this.props.estimate}` : "";
        const issuePlaceholder = "without <issue reason>";
        const storyPlaceholder = "so that I can <derive value>";
        const placeholderText = this.props.type === "issue" ? issuePlaceholder : storyPlaceholder;
        const prevData: BacklogItemDetailFormEditableFieldsWithInstanceId = {
            instanceId: this.props.instanceId,
            estimate: this.props.estimate,
            externalId: this.props.externalId,
            storyPhrase: this.props.storyPhrase,
            rolePhrase: this.props.rolePhrase,
            reasonPhrase: this.props.reasonPhrase
        };
        return (
            <form data-instance-id={this.props.instanceId} className={buildClassName(css.form, this.props.className)}>
                <div className={buildClassName(css.userStoryDescription, css.formRow)}>
                    <LabeledInput
                        inputId="userStoryRolePhrase"
                        labelText="Role phrase"
                        placeHolder="As a <role>"
                        inputValue={this.props.rolePhrase}
                    />
                    <LabeledInput
                        inputId="userStoryStoryPhrase"
                        labelText="Story phrase"
                        placeHolder="I can <something>"
                        inputValue={this.props.storyPhrase}
                        required
                    />
                    <LabeledInput
                        inputId="userStoryReasonPhrase"
                        labelText="Reason phrase"
                        placeHolder={placeholderText}
                        inputValue={this.props.reasonPhrase}
                    />
                </div>
                <div className={buildClassName(css.userStoryExtraFields, css.formRow)}>
                    <LabeledInput
                        inputId="userStoryEstimate"
                        labelText="Estimate"
                        size={3}
                        inputValue={estimateValue}
                        onChange={(value) => {
                            const valueToUse = value.trim();
                            const newValue = valueToUse ? parseInt(valueToUse) : null;
                            this.handleDataUpdate({ ...prevData, estimate: newValue });
                        }}
                    />
                    <LabeledInput inputId="userStoryExternalId" labelText="External ID" inputValue={this.props.externalId} />
                    <div className={css.actionButtonPanel}>
                        <div />
                        <div className={css.centerCell}>
                            <DoneButton
                                onClick={() => {
                                    this.handleDoneClick();
                                }}
                            />
                        </div>
                        <div className={css.centerCell}>
                            <CancelButton
                                onClick={() => {
                                    this.handleCancelClick();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
