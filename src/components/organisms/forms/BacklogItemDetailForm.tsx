// externals
import React, { Component } from "react";

// components
import { CancelButton } from "../../molecules/buttons/CancelButton";
import { DoneButton } from "../../molecules/buttons/DoneButton";
import { StandardInput } from "../../atoms/inputs/StandardInput";

// style
import commonCss from "./common/common.module.css";
import css from "./BacklogItemDetailForm.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";
import { isNumber } from "../../../utils/validationUtils";
import { getStoryPhrases, isStoryPaste } from "./pasteFormatUtils";

// interfaces/types
import { BacklogItemType } from "../../../types/backlogItemTypes";
import { StoryPhrases } from "../../../types";

export interface BacklogItemDetailFormEditableFields extends StoryPhrases {
    estimate: number | null;
    id: string;
    friendlyId: string;
    friendlyIdDisabled: boolean;
    externalId: string;
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
    onDoneClick?: { (id: string, instanceId: number) };
    onCancelClick?: { (id: string, instanceId: number) };
    onDataUpdate?: { (props: BacklogItemDetailFormEditableFieldsWithInstanceId) };
}

export type BacklogItemDetailFormProps = BacklogItemDetailFormStateProps & BacklogItemDetailFormDispatchProps;

export class BacklogItemDetailForm extends Component<BacklogItemDetailFormProps> {
    constructor(props) {
        super(props);
    }
    handleStoryPaste = (fields: BacklogItemDetailFormEditableFieldsWithInstanceId) => {
        const previousRolePhrase = this.props.rolePhrase || "";
        const newRolePhrase = fields.rolePhrase || "";
        const isPaste = previousRolePhrase.length === 0 && newRolePhrase.length > 1;
        if (isPaste && isStoryPaste(newRolePhrase)) {
            const storyPhrases = getStoryPhrases(newRolePhrase);
            fields.rolePhrase = storyPhrases.rolePhrase;
            fields.storyPhrase = storyPhrases.storyPhrase;
            fields.reasonPhrase = storyPhrases.reasonPhrase || "";
        }
    };
    handleDataUpdate = (fields: BacklogItemDetailFormEditableFieldsWithInstanceId) => {
        this.handleStoryPaste(fields);
        if (this.props.onDataUpdate) {
            this.props.onDataUpdate(fields);
        }
    };
    handleDoneClick = () => {
        const matchingForms = document.querySelectorAll(`[data-instance-id="${this.props.instanceId}"]`);
        let matchingForm: HTMLFormElement;
        if (matchingForms.length === 1) {
            matchingForm = matchingForms[0] as HTMLFormElement;
        } else {
            const matchingForms = document.querySelectorAll(`[data-item-id="${this.props.id}"]`);
            if (matchingForms.length === 1) {
                matchingForm = matchingForms[0] as HTMLFormElement;
            }
        }
        if (matchingForm && matchingForm.reportValidity()) {
            if (this.props.onDoneClick) {
                this.props.onDoneClick(this.props.id, this.props.instanceId);
            }
        }
    };
    handleCancelClick = () => {
        if (this.props.onCancelClick) {
            this.props.onCancelClick(this.props.id, this.props.instanceId);
        }
    };
    render() {
        const estimateValue = this.props.estimate ? `${this.props.estimate}` : "";
        const issuePlaceholder = "without <issue reason>";
        const storyPlaceholder = "so that I can <derive value>";
        const placeholderText = this.props.type === "issue" ? issuePlaceholder : storyPlaceholder;
        const prevData: BacklogItemDetailFormEditableFieldsWithInstanceId = {
            id: this.props.id,
            friendlyId: this.props.friendlyId,
            friendlyIdDisabled: this.props.friendlyIdDisabled,
            instanceId: this.props.instanceId,
            estimate: this.props.estimate,
            externalId: this.props.externalId,
            storyPhrase: this.props.storyPhrase,
            rolePhrase: this.props.rolePhrase,
            reasonPhrase: this.props.reasonPhrase
        };
        const rolePhraseInput = (
            <StandardInput
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
            <StandardInput
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
            <StandardInput
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
            <StandardInput
                inputId="userStoryEstimate"
                labelText="Estimate"
                size={3}
                inputValue={estimateValue}
                onChange={(value) => {
                    const valueToUse = value.trim();
                    const estimate = valueToUse ? parseFloat(valueToUse) : null;
                    this.handleDataUpdate({ ...prevData, estimate });
                }}
                validator={(value) => {
                    return isNumber(value);
                }}
            />
        );
        const externalIdInput = (
            <StandardInput
                inputId="userStoryExternalId"
                labelText="External ID"
                inputValue={this.props.externalId}
                onChange={(value) => {
                    this.handleDataUpdate({ ...prevData, externalId: value });
                }}
            />
        );
        const friendlyIdInput = (
            <StandardInput
                inputId="userStoryFriendlyId"
                labelText="ID"
                inputValue={this.props.friendlyId}
                disabled={this.props.friendlyIdDisabled}
                onChange={(value) => {
                    this.handleDataUpdate({ ...prevData, friendlyId: value });
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
                    <div className={buildClassName(css.mobileFormRow, css.threeCellRow)}>
                        {estimateInput}
                        {friendlyIdInput}
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
                    {friendlyIdInput}
                    {externalIdInput}
                    {actionButtonPanel}
                </div>
            </>
        );
        return (
            <form
                data-instance-id={this.props.instanceId}
                data-item-id={this.props.id}
                className={buildClassName(commonCss.form, css.form, this.props.className)}
            >
                {formContent}
            </form>
        );
    }
}
