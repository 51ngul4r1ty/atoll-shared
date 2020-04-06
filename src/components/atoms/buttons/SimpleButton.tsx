// externals
import * as React from "react";

// style
import css from "./SimpleButton.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

// interfaces/types
import { PropsWithClassName } from "../../common/types";

export interface SimpleButtonStateProps extends PropsWithClassName {
    icon?: any; // TODO: Define type
    iconOnLeft?: boolean;
}

export interface SimpleButtonDispatchProps {
    onClick: { () };
}

export type SimpleButtonProps = SimpleButtonStateProps & SimpleButtonDispatchProps;

export const SimpleButton: React.FC<SimpleButtonProps> = (props) => {
    const icon = props.icon && <div className={css.buttonIcon}>{props.icon}</div>;
    const hasChildren = !!props.children;
    const caption = !hasChildren ? null : <div className={css.buttonCaption}>{props.children}</div>;
    let classNameToAdd: string;
    if (hasChildren) {
        classNameToAdd = props.iconOnLeft ? css.iconOnLeft : css.iconOnRight;
    } else {
        classNameToAdd = "";
    }
    const className = buildClassName(css.button, props.className, classNameToAdd);
    const contents = props.iconOnLeft ? (
        <>
            {icon}
            {caption}
        </>
    ) : (
        <>
            {caption}
            {icon}
        </>
    );
    return (
        <div data-testid="button-container" className={className} tabIndex={0} onClick={props.onClick}>
            {contents}
        </div>
    );
};
