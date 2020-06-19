// externals
import * as React from "react";

// style
import css from "./SimpleDivider.module.css";

// utils
import { buildClassName } from "../../../utils/classNameBuilder";

// interfaces/types
import { PropsWithClassName } from "../../common/types";

export interface SimpleDividerStateProps extends PropsWithClassName {
    hidden?: boolean;
    highlighted?: boolean;
}

export interface SimpleDividerDispatchProps {}

export type SimpleDividerProps = SimpleDividerStateProps & SimpleDividerDispatchProps;

export const SimpleDivider: React.FC<SimpleDividerProps> = (props) => {
    const className = buildClassName(
        css.dividerLine,
        props.className,
        props.highlighted ? css.highlighted : "",
        props.hidden ? css.hidden : ""
    );
    return <div className={className}></div>;
};
