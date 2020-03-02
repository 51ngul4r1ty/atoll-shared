// externals
import React, { FC } from "react";

// components
import { LabeledInput } from "../../atoms/forms/LabeledInput";

// style
import css from "./UserStoryDetailForm.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

export interface UserStoryDetailFormStateProps {}

export interface UserStoryDetailFormDispatchProps {}

export const UserStoryDetailForm: FC<{}> = (props) => (
    <form className={css.form}>
        <div className={buildClassName(css.userStoryDescription, css.formRow)}>
            <LabeledInput inputId="userStoryRolePhrase" labelText="Role phrase" placeHolder="As a <role>" />
            <LabeledInput inputId="userStoryStoryPhrase" labelText="Story phrase" placeHolder="I can <something>" />
            <LabeledInput inputId="userStoryReasonPhrase" labelText="Reason phrase" placeHolder="so that I can <derive value>" />
        </div>
        <div className={buildClassName(css.userStoryExtraFields, css.formRow)}>
            <LabeledInput inputId="userStoryEstimate" labelText="Estimate" size={3} />
            <LabeledInput inputId="userStoryExternalId" labelText="External ID" />
        </div>
    </form>
);