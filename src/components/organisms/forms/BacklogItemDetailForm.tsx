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
import { isValidStrictStringEstimate } from "../../../utils/validationUtils";
import { getStoryPhrases, isStoryPaste } from "./pasteFormatUtils";

// interfaces/types
import { BacklogItemType } from "../../../types/backlogItemTypes";
import { BacklogItemInstanceEditableFields } from "./backlogItemFormTypes";
import { BacklogItemStatus } from "../../../types/backlogItemEnums";

export type BacklogItemDetailFormStateProps = BacklogItemInstanceEditableFields & {
    /* from BacklogItemInstanceEditableFields */
    rolePhrase: string | null;
    storyPhrase: string;
    reasonPhrase: string | null;
    acceptanceCriteria: string;
    acceptedAt: Date | null;
    estimate: number | null;
    externalId: string;
    finishedAt: Date | null;
    friendlyId: string;
    id: string;
    releasedAt: Date | null;
    startedAt: Date | null;
    type: BacklogItemType;

    /* new in this type */
    className?: string;
    editing: boolean;
    renderMobile?: boolean;
    status: BacklogItemStatus;
    saving: boolean;
};

export interface BacklogItemDetailFormDispatchProps {
    onDoneClick?: { (id: string, instanceId: number) };
    onCancelClick?: { (id: string, instanceId: number) };
    onDataUpdate?: { (props: BacklogItemInstanceEditableFields) };
}

export type BacklogItemDetailFormProps = BacklogItemDetailFormStateProps & BacklogItemDetailFormDispatchProps;

export class BacklogItemDetailForm extends Component<BacklogItemDetailFormProps> {
    constructor(props) {
        super(props);
    }
    handleStoryPaste = (fields: BacklogItemInstanceEditableFields) => {
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
    handleDataUpdate = (fields: BacklogItemInstanceEditableFields) => {
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
        const prevData: BacklogItemInstanceEditableFields = {
            id: this.props.id,
            friendlyId: this.props.friendlyId,
            instanceId: this.props.instanceId,
            estimate: this.props.estimate,
            externalId: this.props.externalId,
            storyPhrase: this.props.storyPhrase,
            rolePhrase: this.props.rolePhrase,
            reasonPhrase: this.props.reasonPhrase,
            type: this.props.type,
            acceptanceCriteria: this.props.acceptanceCriteria,
            startedAt: this.props.startedAt,
            finishedAt: this.props.finishedAt,
            acceptedAt: this.props.acceptedAt,
            releasedAt: this.props.releasedAt
        };
        const rolePhraseInput = (
            <StandardInput
                inputId="userStoryRolePhrase"
                labelText="Role phrase"
                placeHolder="As a <role>"
                inputValue={this.props.rolePhrase}
                disabled={this.props.saving}
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
                disabled={this.props.saving}
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
                disabled={this.props.saving}
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
                disabled={this.props.saving}
                onChange={(value) => {
                    const valueToUse = value.trim();
                    const estimate = valueToUse ? parseFloat(valueToUse) : null;
                    this.handleDataUpdate({ ...prevData, estimate });
                }}
                validator={(value) => {
                    return isValidStrictStringEstimate(value);
                }}
            />
        );
        const externalIdInput = (
            <StandardInput
                inputId="userStoryExternalId"
                labelText="External ID"
                inputValue={this.props.externalId}
                disabled={this.props.saving}
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
                disabled
                onChange={(value) => {
                    this.handleDataUpdate({ ...prevData, friendlyId: value });
                }}
            />
        );
        const actionButtonContainerClassName = buildClassName(css.centerCell, css.actionButtonContainer);
        const actionButtonPanel = (
            <div className={css.actionButtonPanel}>
                <div />
                <div className={actionButtonContainerClassName}>
                    <DoneButton
                        busy={this.props.saving}
                        className={css.actionButton}
                        disabled={this.props.saving}
                        onClick={() => {
                            this.handleDoneClick();
                        }}
                    />
                </div>
                <div className={actionButtonContainerClassName}>
                    <CancelButton
                        className={css.actionButton}
                        disabled={this.props.saving}
                        onClick={() => {
                            this.handleCancelClick();
                        }}
                    />
                </div>
            </div>
        );
        const actionButtonPanelContainerClassName = buildClassName(css.mobileFormRow, css.actionButtonPanelContainer);
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
                    <div className={actionButtonPanelContainerClassName}>{actionButtonPanel}</div>
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
