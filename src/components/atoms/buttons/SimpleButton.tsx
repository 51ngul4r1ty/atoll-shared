// externals
import * as React from "react";
import { forwardRef, RefObject, Ref, FC } from "react";

// style
import css from "./SimpleButton.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

// interfaces/types
import { PropsWithClassName } from "../../common/types";
import { ComponentWithForwardedRef } from "../../../types";

export type SimpleButtonRefType = HTMLInputElement;

export type SimpleButtonType = ComponentWithForwardedRef<SimpleButtonProps>;

export interface SimpleButtonStateProps extends PropsWithClassName {
    icon?: any; // TODO: Define type
    iconOnLeft?: boolean;
}

interface SimpleButtonInnerStateProps {
    innerRef: RefObject<SimpleButtonRefType>; // TODO: Define type
}

export interface SimpleButtonDispatchProps {
    onClick: { () };
}

export type SimpleButtonProps = SimpleButtonStateProps & SimpleButtonDispatchProps;

const InnerSimpleButton: FC<SimpleButtonProps & SimpleButtonInnerStateProps> = (props) => {
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
        <div data-testid="button-container" ref={props.innerRef} className={className} tabIndex={0} onClick={props.onClick}>
            {contents}
        </div>
    );
};

export const SimpleButton: SimpleButtonType = forwardRef((props: SimpleButtonProps, ref: Ref<SimpleButtonRefType>) => (
    <InnerSimpleButton innerRef={ref as RefObject<SimpleButtonRefType>} {...props} />
));
