// externals
import * as React from "react";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

// interfaces/types
import { PropsWithClassName } from "../../common/types";

// style
import css from "./Spinner.module.css";

/* exported interfaces/types */

export interface SpinnerStateProps extends PropsWithClassName {
    icon: JSX.Element;
    title?: string;
}

export interface SpinnerDispatchProps {}

export type SpinnerProps = SpinnerStateProps & SpinnerDispatchProps;

/* exported components */

export const Spinner: React.FC<SpinnerProps> = (props) => {
    return (
        <div title={props.title} className={buildClassName(props.className, css.animate, css.iconContainer)}>
            {props.icon}
        </div>
    );
};
