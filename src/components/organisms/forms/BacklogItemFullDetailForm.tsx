// externals
import React, { Component } from "react";

// style
import commonCss from "./common/common.module.css";
import css from "./BacklogItemFullDetailForm.module.css";

// interfaces/types
import type { BacklogItemEditableFields } from "./backlogItemFormTypes";
import type { BacklogItemStatus } from "../../../types/backlogItemEnums";

// components
import { BacklogItemPartPanel } from "../panels/backlogItemEditing/BacklogItemPartPanel";
import { DateTimeInput } from "../../atoms/inputs/DateTimeInput";
import { ResetButton } from "../../molecules/buttons/ResetButton";
import { SaveButton } from "../../molecules/buttons/SaveButton";
import { StandardInput } from "../../atoms/inputs/StandardInput";
import { StandardTextArea } from "../../atoms/inputs/StandardTextArea";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";
import { getStoryPhrases, isStoryPaste } from "./pasteFormatUtils";
import { isNumber } from "../../../utils/validationUtils";

export type BacklogItemDetailFormSplitItem = {
    allocatedToSprintId: string | null;
    allocatedToSprintName: string | null;
    plannedPoints: number | null;
    partId: string;
    percentage: number | null;
    startedAt: Date | null;
    finishedAt: Date | null;
    status: BacklogItemStatus;
    expanded: boolean;
};

export interface BacklogItemFullDetailFormStateProps extends BacklogItemEditableFields {
    saved: boolean;
    className?: string;
    editable?: boolean;
    splits: BacklogItemDetailFormSplitItem[];
}

export interface BacklogItemFullDetailFormDispatchProps {
    onSaveClick?: { () };
    onCancelClick?: { () };
    onDataUpdate?: { (props: BacklogItemEditableFields) };
}

export type BacklogItemFullDetailFormProps = BacklogItemFullDetailFormStateProps & BacklogItemFullDetailFormDispatchProps;

export class BacklogItemFullDetailForm extends Component<BacklogItemFullDetailFormProps> {
    constructor(props) {
        super(props);
    }
    handleStoryPaste = (fields: BacklogItemEditableFields) => {
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
    handleDataUpdate = (fields: BacklogItemEditableFields) => {
        this.handleStoryPaste(fields);
        if (this.props.onDataUpdate) {
            this.props.onDataUpdate(fields);
        }
    };
    handleSaveClick = () => {
        if (this.props.onSaveClick) {
            this.props.onSaveClick();
        }
    };
    handleResetClick = () => {
        if (this.props.onCancelClick) {
            this.props.onCancelClick();
        }
    };
    render() {
        const isReadOnly = !this.props.editable;
        const estimateValue = this.props.estimate ? `${this.props.estimate}` : "";
        const issuePlaceholder = "without <issue reason>";
        const storyPlaceholder = "so that I can <derive value>";
        const placeholderText = this.props.type === "issue" ? issuePlaceholder : storyPlaceholder;
        const prevData: BacklogItemEditableFields = {
            acceptanceCriteria: this.props.acceptanceCriteria,
            estimate: this.props.estimate,
            externalId: this.props.externalId,
            friendlyId: this.props.friendlyId,
            id: this.props.id,
            reasonPhrase: this.props.reasonPhrase,
            rolePhrase: this.props.rolePhrase,
            storyPhrase: this.props.storyPhrase,
            type: this.props.type,
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
                readOnly={isReadOnly}
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
                readOnly={isReadOnly}
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
                readOnly={isReadOnly}
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
                readOnly={isReadOnly}
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
                readOnly={isReadOnly}
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
                readOnly={isReadOnly}
                inputValue={this.props.friendlyId}
                disabled={!isReadOnly}
                onChange={(value) => {
                    this.handleDataUpdate({ ...prevData, friendlyId: value });
                }}
            />
        );
        const acceptanceCriteriaInput = (
            <StandardTextArea
                inputId="acceptanceCriteriaId"
                labelText="Acceptance Criteria"
                readOnly={isReadOnly}
                renderMarkdown={isReadOnly}
                inputValue={this.props.acceptanceCriteria}
                rows={3}
                onChange={(value) => {
                    this.handleDataUpdate({ ...prevData, acceptanceCriteria: value });
                }}
            />
        );
        const dateStartedInput = (
            <DateTimeInput
                inputId="startedAtId"
                labelText="Date Started"
                readOnly
                showTime
                inputValue={this.props.startedAt}
                onChange={(value) => {
                    // this.handleDataUpdate({ ...prevData, startedAt: value });
                }}
            />
        );
        const dateFinishedInput = (
            <DateTimeInput
                inputId="finishedAtId"
                labelText="Date Finished"
                readOnly
                showTime
                inputValue={this.props.finishedAt}
                onChange={(value) => {
                    // this.handleDataUpdate({ ...prevData, finishedAt: value });
                }}
            />
        );
        const dateAcceptedInput = (
            <DateTimeInput
                inputId="acceptedAtId"
                labelText="Date Accepted"
                readOnly
                showTime
                inputValue={this.props.acceptedAt}
                onChange={(value) => {
                    // this.handleDataUpdate({ ...prevData, acceptedAt: value });
                }}
            />
        );
        const dateReleasedInput = (
            <DateTimeInput
                inputId="releasedAtId"
                labelText="Date Released"
                readOnly
                showTime
                inputValue={this.props.releasedAt}
                onChange={(value) => {
                    // this.handleDataUpdate({ ...prevData, releasedAt: value });
                }}
            />
        );
        const actionButtonContainerClassName = buildClassName(css.centerCell, css.actionButtonContainer);
        const actionButtonPanelElts = !this.props.editable ? null : (
            <div className={css.formRow}>
                <div className={css.actionButtonPanel}>
                    <div />
                    <div className={actionButtonContainerClassName}>
                        <SaveButton
                            className={css.actionButton}
                            onClick={() => {
                                this.handleSaveClick();
                            }}
                        />
                    </div>
                    <div className={actionButtonContainerClassName}>
                        <ResetButton
                            className={css.actionButton}
                            onClick={() => {
                                this.handleResetClick();
                            }}
                        />
                    </div>
                </div>
            </div>
        );
        const formContent = (
            <>
                <div className={buildClassName(css.formRow, css.idAndEstimateRow)}>
                    {friendlyIdInput}
                    {externalIdInput}
                    {estimateInput}
                </div>
                <div className={css.formRow}>{rolePhraseInput}</div>
                <div className={css.formRow}>{storyPhraseInput}</div>
                <div className={css.formRow}>{reasonPhraseInput}</div>
                <div className={buildClassName(css.formRow, css.dateFieldsRow)}>
                    {dateStartedInput}
                    {dateFinishedInput}
                    {dateAcceptedInput}
                    {dateReleasedInput}
                </div>
                <div className={css.formRow}>{acceptanceCriteriaInput}</div>
                {actionButtonPanelElts}
            </>
        );
        const formClassName = buildClassName(this.props.className, css.pageContent);
        const storyPanelClassName = buildClassName(
            isReadOnly ? commonCss.readOnly : null,
            commonCss.form,
            css.form,
            isReadOnly ? css.readOnly : null,
            css.storyPanel
        );
        let partIndex = 0;
        const totalParts = this.props.splits.length;
        const backlogItemPartElts = this.props.splits.map((split) => {
            partIndex++;
            return (
                <BacklogItemPartPanel
                    key={partIndex}
                    partIndex={partIndex}
                    totalParts={totalParts}
                    sprintName={split.allocatedToSprintName}
                />
            );
        });
        return (
            <form data-item-id={this.props.id} className={formClassName}>
                <div className={storyPanelClassName}>{formContent}</div>
                <div className={css.splitsPanel}>{backlogItemPartElts}</div>
            </form>
        );
    }
}
