// externals
import React, { FC } from "react";

// components
import { LabeledInput } from "../../atoms/forms/LabeledInput";
import { CancelButton } from "../../molecules/buttons/CancelButton";
import { DoneButton } from "../../molecules/buttons/DoneButton";

// style
import css from "./UserStoryDetailForm.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

// interfaces/types
import { BacklogItemType } from "../../../types";

export interface UserStoryDetailFormStateProps {
    className?: string;
    estimate: number | null;
    externalId: string;
    storyPhrase: string;
    rolePhrase: string;
    reasonPhrase: string;
    type: BacklogItemType;
    editing: boolean;
}

export interface UserStoryDetailFormDispatchProps {}

export type UserStoryDetailFormProps = UserStoryDetailFormStateProps & UserStoryDetailFormDispatchProps;

export const UserStoryDetailForm: FC<UserStoryDetailFormProps> = (props) => {
    const estimateValue = props.estimate ? `${props.estimate}` : "";
    const issuePlaceholder = "without <issue reason>";
    const storyPlaceholder = "so that I can <derive value>";
    const placeholderText = props.type === "issue" ? issuePlaceholder : storyPlaceholder;
    return (
        <form className={buildClassName(css.form, props.className)}>
            <div className={buildClassName(css.userStoryDescription, css.formRow)}>
                <LabeledInput
                    inputId="userStoryRolePhrase"
                    labelText="Role phrase"
                    placeHolder="As a <role>"
                    inputValue={props.rolePhrase}
                />
                <LabeledInput
                    inputId="userStoryStoryPhrase"
                    labelText="Story phrase"
                    placeHolder="I can <something>"
                    inputValue={props.storyPhrase}
                />
                <LabeledInput
                    inputId="userStoryReasonPhrase"
                    labelText="Reason phrase"
                    placeHolder={placeholderText}
                    inputValue={props.reasonPhrase}
                />
            </div>
            <div className={buildClassName(css.userStoryExtraFields, css.formRow)}>
                <LabeledInput inputId="userStoryEstimate" labelText="Estimate" size={3} inputValue={estimateValue} />
                <LabeledInput inputId="userStoryExternalId" labelText="External ID" inputValue={props.externalId} />
                <div className={css.actionButtonPanel}>
                    <div />
                    <div className={css.centerCell}>
                        <DoneButton onClick={() => {}} />
                    </div>
                    <div className={css.centerCell}>
                        <CancelButton onClick={() => {}} />
                    </div>
                </div>
            </div>
        </form>
    );
};
