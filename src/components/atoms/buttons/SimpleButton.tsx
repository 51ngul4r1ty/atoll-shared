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
    draggable?: boolean;
    icon?: any; // TODO: Define type
    iconOnLeft?: boolean;
    suppressSpacing?: boolean;
}

interface SimpleButtonInnerStateProps {
    innerRef: RefObject<SimpleButtonRefType>;
}

export interface SimpleButtonDispatchProps {
    onClick: { () };
}

export type SimpleButtonProps = SimpleButtonStateProps & SimpleButtonDispatchProps;

/**
 * Remove properties that should be overidden in specialized button component.
 */
export const cleanPassthroughProps = (passthroughProps: any): SimpleButtonProps => {
    const result = { ...passthroughProps };
    delete result.onClick;
    delete result.iconOnLeft;
    delete result.icon;
    return result;
};

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
    const className = buildClassName(
        css.button,
        props.className,
        classNameToAdd,
        props.suppressSpacing ? css.suppressSpacing : null
    );
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
    const handleDragStart = () => {
        if (!props.draggable) {
            return false;
        }
    };
    const draggableToUse = !!props.draggable;
    return (
        <div
            draggable={draggableToUse}
            onDragStart={() => {
                return handleDragStart();
            }}
            data-testid="button-container"
            ref={props.innerRef}
            className={className}
            tabIndex={0}
            onClick={props.onClick}
        >
            {contents}
        </div>
    );
};

export const SimpleButton: SimpleButtonType = forwardRef((props: SimpleButtonProps, ref: Ref<SimpleButtonRefType>) => (
    <InnerSimpleButton innerRef={ref as RefObject<SimpleButtonRefType>} {...props} />
));
