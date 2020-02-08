import * as React from "react";

import css from "./SimpleButton.module.css";

export interface SimpleButtonAttributeProps {
    icon?: any; // TODO: Define type
    iconOnLeft?: boolean;
    tabIndex: number;
}

export interface SimpleButtonEventProps {
    onClick: { () };
}

export type SimpleButtonProps = SimpleButtonAttributeProps & SimpleButtonEventProps;

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
        <div className={className} tabIndex={props.tabIndex} onClick={props.onClick}>
            {contents}
        </div>
    );
};
