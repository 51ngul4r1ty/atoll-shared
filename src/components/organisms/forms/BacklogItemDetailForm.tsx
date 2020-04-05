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
    renderMobile?: boolean;
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
        const rolePhraseInput = (
            <LabeledInput
                inputId="userStoryRolePhrase"
                labelText="Role phrase"
                placeHolder="As a <role>"
                inputValue={this.props.rolePhrase}
                onChange={(value) => {
                    this.handleDataUpdate({ ...prevData, rolePhrase: value });
                }}
            />
        );
        const storyPhraseInput = (
            <LabeledInput
                inputId="userStoryStoryPhrase"
                labelText="Story phrase"
                placeHolder="I can <something>"
                inputValue={this.props.storyPhrase}
                required
                onChange={(value) => {
                    this.handleDataUpdate({ ...prevData, storyPhrase: value });
                }}
            />
        );
        const reasonPhraseInput = (
            <LabeledInput
                inputId="userStoryReasonPhrase"
                labelText="Reason phrase"
                placeHolder={placeholderText}
                inputValue={this.props.reasonPhrase}
                onChange={(value) => {
                    this.handleDataUpdate({ ...prevData, reasonPhrase: value });
                }}
            />
        );
        const estimateInput = (
            <LabeledInput
                inputId="userStoryEstimate"
                labelText="Estimate"
                size={3}
                inputValue={estimateValue}
                onChange={(value) => {
                    const valueToUse = value.trim();
                    const estimate = valueToUse ? parseInt(valueToUse) : null;
                    this.handleDataUpdate({ ...prevData, estimate });
                }}
            />
        );
        const externalIdInput = (
            <LabeledInput
                inputId="userStoryExternalId"
                labelText="External ID"
                inputValue={this.props.externalId}
                onChange={(value) => {
                    this.handleDataUpdate({ ...prevData, externalId: value });
                }}
            />
        );
        const actionButtonPanel = (
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
        );
        const formContent = this.props.renderMobile ? (
            <>
                <div className={buildClassName(css.userStoryFormMobile)}>
                    <div className={css.mobileFormRow}>{rolePhraseInput}</div>
                    <div className={css.mobileFormRow}>{storyPhraseInput}</div>
                    <div className={css.mobileFormRow}>{reasonPhraseInput}</div>
                    <div className={buildClassName(css.mobileFormRow, css.halfAndHalfRow)}>
                        {estimateInput}
                        {externalIdInput}
                    </div>
                    <div className={css.mobileFormRow}>{actionButtonPanel}</div>
                </div>
            </>
        ) : (
            <>
                <div className={buildClassName(css.userStoryDescription, css.formRow)}>
                    {rolePhraseInput}
                    {storyPhraseInput}
                    {reasonPhraseInput}
                </div>
                <div className={buildClassName(css.userStoryExtraFields, css.formRow)}>
                    {estimateInput}
                    {externalIdInput}
                    {actionButtonPanel}
                </div>
            </>
        );
        return (
            <form data-instance-id={this.props.instanceId} className={buildClassName(css.form, this.props.className)}>
                {formContent}
            </form>
        );
    }
}
