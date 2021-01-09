// externals
import * as React from "react";
import { buildClassName } from "../../../../utils/classNameBuilder";

// components
import { SpinnerShapePentagon } from "../../../atoms/icons/SpinnerShapePentagon";
import { Spinner } from "../../../atoms/unique/Spinner";

// interfaces/types
import { PropsWithClassName } from "../../../common/types";

// consts/enums
import { SpinnerAction, SpinnerSize } from "./smartSpinnerTypes";

// style
import css from "./SmartSpinner.module.css";
import { buildSpinnerHoverText } from "./spinnerTextUtils";

export interface SmartSpinnerStateProps extends PropsWithClassName {
    metricKey: string; // FUTURE USE
    metricEntityKey: string; // FUTURE USE
    hideActionInMessage?: boolean;
    action: SpinnerAction;
    entityNameTemplate: string;
    quantity: number | null;
    expectedTime: number | null; // FUTURE USE
    size?: SpinnerSize | null;
}

export interface SmartSpinnerDispatchProps {}

export type SmartSpinnerProps = SmartSpinnerStateProps & SmartSpinnerDispatchProps;

/* exported components */

/**
 * An advanced spinner component.
 * @param props
 *   metricKey is the high level categorization of the api request (e.g. "sprint");
 *   metricEntityKey is the exactly entity being retrieved (e.g. "sprint 123");
 *   action is either Loading or Calculating but can also be null to indicate a general busy state;
 *   entityNameTemplate is a template used to format text for the user, it can include the "plural" function;
 *   quantity is the number of items being retrieved, QUANTITY_UNKNOWN can be used;
 *   expectedTime is the time this is expected to take (so a progress bar can be displayed);
 *   size can be either Small or Large;
 */
export const SmartSpinner: React.FC<SmartSpinnerProps> = (props) => {
    const hoverText = buildSpinnerHoverText(props.entityNameTemplate, props.action, props.quantity, props.hideActionInMessage);
    const spinnerIcon = <SpinnerShapePentagon className={css.spinnerShape} />;
    const sizeClass = props.size === SpinnerSize.Large ? css.large : null;
    const text = props.size === SpinnerSize.Large ? hoverText : null;
    const textContainerElts = text ? <div className={css.textContainer}>{text}</div> : null;
    return (
        <div className={css.outerContainer}>
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
