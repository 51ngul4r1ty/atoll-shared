// externals
import * as React from "react";
import { buildClassName } from "../../../../utils/classNameBuilder";

// components
import { SpinnerShapePentagon } from "../../../atoms/icons/SpinnerShapePentagon";
import { Spinner } from "../../../atoms/unique/Spinner";

// interfaces/types
import { PropsWithClassName } from "../../../common/types";

// style
import css from "./SmartSpinner.module.css";
import { buildSpinnerHoverText } from "./spinnerTextUtils";

/* exported interfaces/types */

export enum SpinnerAction {
    Loading = 1,
    Calculating = 2
}

export enum SpinnerSize {
    Small = 1,
    Large = 2
}

export const QUANTITY_UNKNOWN = null;
export const TIME_UNKNOWN = null;

export interface SmartSpinnerStateProps extends PropsWithClassName {
    metricKey: string; // FUTURE USE
    metricEntityKey: string; // FUTURE USE
    action: SpinnerAction;
    entityNameTemplate: string;
    quantity: number | null;
    expectedTime: number | null; // FUTURE USE
    size?: SpinnerSize | null;
}

export interface SmartSpinnerDispatchProps {}

export type SmartSpinnerProps = SmartSpinnerStateProps & SmartSpinnerDispatchProps;

/* exported components */

export const SmartSpinner: React.FC<SmartSpinnerProps> = (props) => {
    const hoverText = buildSpinnerHoverText(props.entityNameTemplate, props.action, props.quantity);
    const spinnerIcon = <SpinnerShapePentagon className={css.spinnerShape} />;
    const sizeClass = props.size === SpinnerSize.Large ? css.large : null;
    return <Spinner className={buildClassName(props.className, css.container, sizeClass)} icon={spinnerIcon} title={hoverText} />;
};
