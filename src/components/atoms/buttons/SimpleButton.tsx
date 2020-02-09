import * as React from "react";

import css from "./SimpleButton.module.css";

export interface SimpleButtonStateProps {
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
    let className = css.button;
    if (hasChildren) {
        className += props.iconOnLeft ? ` ${css.iconOnLeft}` : ` ${css.iconOnRight}`;
    }
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
        <div className={className} tabIndex={0} onClick={props.onClick}>
            {contents}
        </div>
    );
};
