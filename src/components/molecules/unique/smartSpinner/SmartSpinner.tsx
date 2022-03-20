// externals
import * as React from "react";
import { buildClassName } from "../../../../utils/classNameBuilder";

// components
import { SpinnerShapePentagon } from "../../../atoms/icons/SpinnerShapePentagon";
import { Spinner } from "../../../atoms/unique/Spinner";

// interfaces/types
import { PropsWithClassName } from "../../../common/types";

// consts/enums
import { SpinnerAction, SpinnerSize, SpinnerTextPosition } from "./smartSpinnerEnums";

// style
import css from "./SmartSpinner.module.css";
import { buildSpinnerHoverText } from "./spinnerTextUtils";

export interface SmartSpinnerStateProps extends PropsWithClassName {
    action: SpinnerAction;
    entityNameTemplate: string;
    expectedTime: number | null; // FUTURE USE
    hideActionInMessage?: boolean;
    metricEntityKey: string; // FUTURE USE
    metricKey: string; // FUTURE USE
    quantity: number | null;
    showSpinnerImmediately?: boolean;
    size?: SpinnerSize | null;
    textPosition?: SpinnerTextPosition | null;
    outerContainerClassName?: string;
}

export interface SmartSpinnerDispatchProps {}

export type SmartSpinnerProps = SmartSpinnerStateProps & SmartSpinnerDispatchProps;

/* exported components */

/**
 * An advanced spinner component.
 * @param props
 *   action is either Loading or Calculating but can also be null to indicate a general busy state;
 *   entityNameTemplate is a template used to format text for the user, it can include the "plural" function;
 *   expectedTime is the time this is expected to take (so a progress bar can be displayed);
 *   metricEntityKey is the exactly entity being retrieved (e.g. "sprint 123");
 *   metricKey is the high level categorization of the api request (e.g. "sprint");
 *   quantity is the number of items being retrieved, QUANTITY_UNKNOWN can be used;
 *   showSpinnerImmediately will prevent the usual half second delay that prevents flicker for very brief delays
 *   size can be either Default, Small, Medium or Large;  Default will not apply CSS styling; Medium & Large show hover text.
 */
export const SmartSpinner: React.FC<SmartSpinnerProps> = (props) => {
    const hoverText = buildSpinnerHoverText(props.entityNameTemplate, props.action, props.quantity, props.hideActionInMessage);
    const spinnerIcon = <SpinnerShapePentagon className={css.spinnerShape} />;
    let sizeClass: string;
    switch (props.size) {
        case SpinnerSize.Default: {
            sizeClass = null;
            break;
        }
        case SpinnerSize.Small: {
            sizeClass = css.small;
            break;
        }
        case SpinnerSize.Medium: {
            sizeClass = css.medium;
            break;
        }
        case SpinnerSize.Large: {
            sizeClass = css.large;
            break;
        }
        default: {
            if (props.size) {
                throw new Error(`spinnerSize is an invalid value: ${props.size}`);
            }
            break;
        }
    }
    const text = props.size === SpinnerSize.Large || props.size === SpinnerSize.Medium ? hoverText : null;
    const textContainerElts = text ? (
        <div
            className={buildClassName(
                css.textContainer,
                props.textPosition === SpinnerTextPosition.BelowSpinner ? css.textBelowSpinner : null
            )}
        >
            {text}
        </div>
    ) : null;
    const animateCssClassName = props.showSpinnerImmediately ? css.animateFastShow : css.animateShow;
    return (
        <div className={buildClassName(css.outerContainer, animateCssClassName, props.outerContainerClassName)}>
            <div className={css.innerContainer}>
                <div className={css.spinnerContainer}>
                    <Spinner
                        className={buildClassName(props.className, css.container, sizeClass)}
                        icon={spinnerIcon}
                        title={hoverText}
                    />
                </div>
            </div>
            {textContainerElts}
        </div>
    );
};
