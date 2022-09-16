// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";
import { buildClassName } from "../../../utils/classNameBuilder";

export type MenuCaretUpIconProps = StandardInvertibleComponentProps;

export const MenuCaretUpIcon: React.FC<MenuCaretUpIconProps> = (props) => {
    const { fillClass, strokeClass } = getFillAndStrokeClassNames(
        props,
        baseCss.fillInverted,
        baseCss.fill,
        baseCss.strokeInverted,
        baseCss.stroke
    );

    const classNameToUse = buildClassName(strokeClass, props.className);

    return (
        <svg
            fill="none"
            className={classNameToUse}
            width="100%"
            height="100%"
            viewBox="0 0 300 300"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            xmlSpace="preserve"
        >
            <g className={fillClass} transform="matrix(0.523939,-1.24668e-19,1.24668e-19,-0.524957,-68.9174,286.972)">
                <path d="M317.619,223.112C316.374,224.339 316.358,225.684 317.571,227.148L416.412,325.143C417.98,325.99 419.42,325.808 420.768,324.888L518.094,227.347C519.309,225.437 519.266,223.814 518.077,222.451L493.892,197.566C491.864,195.534 490.019,195.827 488.291,197.598L418.091,266.349L348.808,197.769C346.508,195.864 344.455,195.967 342.61,197.776L317.619,223.112Z" />
            </g>
        </svg>
    );
};
