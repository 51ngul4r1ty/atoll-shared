// externals
import * as React from "react";
import { forwardRef, RefObject, Ref, FC } from "react";

// style
import css from "./SimpleButton.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

// interfaces/types
import type { PropsWithClassName } from "../../common/types";
import type { ComponentWithForwardedRef } from "../../../types/reactHelperTypes";

// components
import { Spinner } from "../../atoms/unique/Spinner";
import { SpinnerShapePentagon } from "../../atoms/icons/SpinnerShapePentagon";

export type SimpleButtonRefType = HTMLInputElement;

export type SimpleButtonType = ComponentWithForwardedRef<SimpleButtonProps>;

export interface SimpleButtonStateProps extends PropsWithClassName {
    disabled?: boolean;
    draggable?: boolean;
    icon?: any; // TODO: Define type
    iconOnLeft?: boolean;
    noWrap?: boolean;
    suppressSpacing?: boolean;
    busy?: boolean;
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
    let icon: any;
    if (props.busy) {
        const spinnerIcon = <SpinnerShapePentagon className={css.spinnerShape} />;
        icon = (
            <div className={css.spinner}>
                <Spinner icon={spinnerIcon} />
            </div>
        );
    } else {
        icon = props.icon && <div className={css.buttonIcon}>{props.icon}</div>;
    }
    const hasChildren = !!props.children;
    const captionClassName = buildClassName(css.buttonCaption, props.noWrap ? css.noWrap : null);
    const caption = !hasChildren ? null : <div className={captionClassName}>{props.children}</div>;
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
        props.suppressSpacing ? css.suppressSpacing : null,
        props.disabled ? css.disabled : null
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
        // FIXME: This may be a bug?
        return undefined;
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
            onClick={() => {
                if (!props.busy && !props.disabled) {
                    props.onClick();
                }
            }}
        >
            {contents}
        </div>
    );
};

export const SimpleButton: SimpleButtonType = forwardRef((props: SimpleButtonProps, ref: Ref<SimpleButtonRefType>) => (
    <InnerSimpleButton innerRef={ref as RefObject<SimpleButtonRefType>} {...props} />
));
