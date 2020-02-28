// externals
import React, { FC } from "react";

// components
import { LabeledInput } from "../../atoms/forms/LabeledInput";

import css from "./UserStoryDetailForm.module.css";

export interface UserStoryDetailFormStateProps {}

export interface UserStoryDetailFormDispatchProps {}

export const UserStoryDetailForm: FC<{}> = (props) => (
    <form className={css.form}>
        <LabeledInput inputId="userStoryRolePhrase" labelText="Role phrase" placeHolder="As a <role>" size={25} />
        <LabeledInput inputId="userStoryStoryPhrase" labelText="Story phrase" placeHolder="I can <something>" size={50} />
        <LabeledInput
            inputId="userStoryReasonPhrase"
            labelText="Reason phrase"
            placeHolder="so that I can <derive value>"
            size={50}
        />
        <LabeledInput inputId="userStoryEstimate" labelText="Estimate" size={3} />
        <LabeledInput inputId="userStoryType" labelText="Type" size={20} />
        <LabeledInput inputId="userStoryExternalId" labelText="External ID" size={20} />
    </form>
);
