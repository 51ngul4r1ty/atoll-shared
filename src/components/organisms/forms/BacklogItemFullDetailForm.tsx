// externals
import React from "react";

// style
import commonCss from "./common/common.module.css";
import css from "./BacklogItemFullDetailForm.module.css";

// interfaces/types
import type { BacklogItemEditableFields } from "./backlogItemFormTypes";
import type { BacklogItemPartForSplitForm } from "../../../selectors/backlogItemPartSelectors";

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
import { isValidStrictStringEstimate } from "../../../utils/validationUtils";
import { backlogItemPartMenuBuilder } from "../../common/itemMenuBuilders";
import { ItemMenuEventHandlers } from "../../molecules/menus/menuBuilderTypes";
import { useDispatch } from "react-redux";
import { editBacklogItemPart } from "../../../actions/backlogItemPartActions";

export type BacklogItemFullDetailFormStateProps = BacklogItemEditableFields & {
    className?: string;
    editable?: boolean;
    openedDetailMenuBacklogItemPartId: string;
    parts: BacklogItemPartForSplitForm[];
    saved: boolean;
    strictMode: boolean;
};

export type BacklogItemFullDetailFormDispatchProps = {
    onSaveClick?: () => void;
    onCancelClick?: () => void;
    onDataUpdate?: (props: BacklogItemEditableFields) => void;
    onPartPointsUpdate: (partId: string, value: string) => void;
    onDetailClick: (partId: string, strictMode: boolean) => void;
};

export type BacklogItemFullDetailFormProps = BacklogItemFullDetailFormStateProps & BacklogItemFullDetailFormDispatchProps;

export const BacklogItemFullDetailForm: React.FC<BacklogItemFullDetailFormProps> = (props) => {
    const handleStoryPaste = (fields: BacklogItemEditableFields) => {
        const previousRolePhrase = props.rolePhrase || "";
        const newRolePhrase = fields.rolePhrase || "";
        const isPaste = previousRolePhrase.length === 0 && newRolePhrase.length > 1;
        if (isPaste && isStoryPaste(newRolePhrase)) {
            const storyPhrases = getStoryPhrases(newRolePhrase);
            fields.rolePhrase = storyPhrases.rolePhrase;
            fields.storyPhrase = storyPhrases.storyPhrase;
            fields.reasonPhrase = storyPhrases.reasonPhrase || "";
        }
    };
    const handleDataUpdate = (fields: BacklogItemEditableFields) => {
        handleStoryPaste(fields);
        if (props.onDataUpdate) {
            props.onDataUpdate(fields);
        }
    };
    const handleSaveClick = () => {
        if (props.onSaveClick) {
            props.onSaveClick();
        }
    };
    const handleResetClick = () => {
        if (props.onCancelClick) {
            props.onCancelClick();
        }
    };
    const dispatch = useDispatch();
    const isReadOnly = !props.editable;
    const estimateValue = props.estimate ? `${props.estimate}` : "";
    const issuePlaceholder = "without <issue reason>";
    const storyPlaceholder = "so that I can <derive value>";
    const placeholderText = props.type === "issue" ? issuePlaceholder : storyPlaceholder;
    const prevData: BacklogItemEditableFields = {
        acceptanceCriteria: props.acceptanceCriteria,
        estimate: props.estimate,
        externalId: props.externalId,
        friendlyId: props.friendlyId,
        id: props.id,
        reasonPhrase: props.reasonPhrase,
        rolePhrase: props.rolePhrase,
        storyPhrase: props.storyPhrase,
        type: props.type,
        startedAt: props.startedAt,
        finishedAt: props.finishedAt,
        acceptedAt: props.acceptedAt,
        releasedAt: props.releasedAt
    };
    const rolePhraseInput = (
        <StandardInput
            inputId="userStoryRolePhrase"
            labelText="Role phrase"
            placeHolder="As a <role>"
            readOnly={isReadOnly}
            inputValue={props.rolePhrase}
            onChange={(value) => {
                handleDataUpdate({ ...prevData, rolePhrase: value });
            }}
        />
    );
    const storyPhraseInput = (
        <StandardInput
            inputId="userStoryStoryPhrase"
            labelText="Story phrase"
            placeHolder="I can <something>"
            readOnly={isReadOnly}
            inputValue={props.storyPhrase}
            required
            onChange={(value) => {
                handleDataUpdate({ ...prevData, storyPhrase: value });
            }}
        />
    );
    const reasonPhraseInput = (
        <StandardInput
            inputId="userStoryReasonPhrase"
            labelText="Reason phrase"
            placeHolder={placeholderText}
            readOnly={isReadOnly}
            inputValue={props.reasonPhrase}
            onChange={(value) => {
                handleDataUpdate({ ...prevData, reasonPhrase: value });
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
                handleDataUpdate({ ...prevData, estimate });
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
            readOnly={isReadOnly}
            inputValue={props.externalId}
            onChange={(value) => {
                handleDataUpdate({ ...prevData, externalId: value });
            }}
        />
    );
    const friendlyIdInput = (
        <StandardInput
            inputId="userStoryFriendlyId"
            labelText="ID"
            readOnly={isReadOnly}
            inputValue={props.friendlyId}
            disabled={!isReadOnly}
            onChange={(value) => {
                handleDataUpdate({ ...prevData, friendlyId: value });
            }}
        />
    );
    const acceptanceCriteriaInput = (
        <StandardTextArea
            inputId="acceptanceCriteriaId"
            labelText="Acceptance Criteria"
            readOnly={isReadOnly}
            renderMarkdown={isReadOnly}
            inputValue={props.acceptanceCriteria}
            rows={3}
            onChange={(value) => {
                handleDataUpdate({ ...prevData, acceptanceCriteria: value });
            }}
        />
    );
    const dateStartedInput = (
        <DateTimeInput
            inputId="startedAtId"
            labelText="Date Started"
            readOnly
            showTime
            inputValue={props.startedAt}
            onChange={(value) => {
                // handleDataUpdate({ ...prevData, startedAt: value });
            }}
        />
    );
    const dateFinishedInput = (
        <DateTimeInput
            inputId="finishedAtId"
            labelText="Date Finished"
            readOnly
            showTime
            inputValue={props.finishedAt}
            onChange={(value) => {
                // handleDataUpdate({ ...prevData, finishedAt: value });
            }}
        />
    );
    const dateAcceptedInput = (
        <DateTimeInput
            inputId="acceptedAtId"
            labelText="Date Accepted"
            readOnly
            showTime
            inputValue={props.acceptedAt}
            onChange={(value) => {
                // handleDataUpdate({ ...prevData, acceptedAt: value });
            }}
        />
    );
    const dateReleasedInput = (
        <DateTimeInput
            inputId="releasedAtId"
            labelText="Date Released"
            readOnly
            showTime
            inputValue={props.releasedAt}
            onChange={(value) => {
                // handleDataUpdate({ ...prevData, releasedAt: value });
            }}
        />
    );
    const actionButtonContainerClassName = buildClassName(css.centerCell, css.actionButtonContainer);
    const actionButtonPanelElts = !props.editable ? null : (
        <div className={css.formRow}>
            <div className={css.actionButtonPanel}>
                <div />
                <div className={actionButtonContainerClassName}>
                    <SaveButton
                        className={css.actionButton}
                        onClick={() => {
                            handleSaveClick();
                        }}
                    />
                </div>
                <div className={actionButtonContainerClassName}>
                    <ResetButton
                        className={css.actionButton}
                        onClick={() => {
                            handleResetClick();
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
    const formClassName = buildClassName(props.className, css.pageContent);
    const storyPanelClassName = buildClassName(
        isReadOnly ? commonCss.readOnly : null,
        commonCss.form,
        css.form,
        isReadOnly ? css.readOnly : null,
        css.storyPanel
    );
    let partIndex = 0;
    const totalParts = props.parts.length;
    const backlogItemPartElts = props.parts.map((part) => {
        partIndex++;
        const itemEventHandlers: ItemMenuEventHandlers = {
            handleEvent: (eventName: string, itemId: string) => {
                if (eventName === "onEditItemClick") {
                    dispatch(editBacklogItemPart(part.id));
                } else {
                    throw Error(`${eventName} is not handled`);
                }
            }
        };
        const showDetailMenu = part.id === props.openedDetailMenuBacklogItemPartId;
        return (
            <BacklogItemPartPanel
                key={partIndex}
                editable={part.editable}
                expanded={part.expanded}
                partId={part.id}
                partIndex={partIndex}
                totalParts={totalParts}
                sprintName={part.allocatedSprintName}
                points={part.points}
                percentage={part.percentage}
                onPointsUpdate={(value: string) => props.onPartPointsUpdate(part.id, value)}
                hasDetails={props.editable}
                showDetailMenu={showDetailMenu}
                showDetailMenuToLeft={true}
                buildItemMenu={backlogItemPartMenuBuilder(itemEventHandlers)}
                onDetailClick={() => props.onDetailClick(part.id, props.strictMode)}
            />
        );
    });
    return (
        <form data-item-id={props.id} className={formClassName}>
            <div className={storyPanelClassName}>{formContent}</div>
            <div className={css.splitsPanel}>{backlogItemPartElts}</div>
        </form>
    );
};
