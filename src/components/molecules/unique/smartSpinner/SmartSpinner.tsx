// externals
import * as React from "react";

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

export const QUANTITY_UNKNOWN = null;
export const TIME_UNKNOWN = null;

export interface SmartSpinnerStateProps extends PropsWithClassName {
    metricKey: string; // FUTURE USE
    metricEntityKey: string; // FUTURE USE
    action: SpinnerAction; // FUTURE USE
    entityNameTemplate: string; // FUTURE USE
    quantity: number | null; // FUTURE USE
    expectedTime: number | null; // FUTURE USE
}

export interface SmartSpinnerDispatchProps {}

export type SmartSpinnerProps = SmartSpinnerStateProps & SmartSpinnerDispatchProps;

/* exported components */

export const SmartSpinner: React.FC<SmartSpinnerProps> = (props) => {
    const hoverText = buildSpinnerHoverText(props.entityNameTemplate, props.action, props.quantity);
    const spinnerIcon = <SpinnerShapePentagon className={css.spinnerShape} />;
    return <Spinner className={props.className} icon={spinnerIcon} title={hoverText} />;
};
