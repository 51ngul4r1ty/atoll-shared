// externals
import * as React from "react";

// style
import baseCss from "../../common/base.module.css";

// interfaces/types
import { StandardInvertibleComponentProps } from "../../common/types";

// utils
import { getFillAndStrokeClassNames } from "../../common/propUtils";
import { buildClassName } from "../../../utils/classNameBuilder";

export type ProjectIconProps = StandardInvertibleComponentProps;

export const ProjectIcon: React.FC<ProjectIconProps> = (props) => {
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
            <g className={fillClass} transform="matrix(1.20471,0,0,1.07637,-670.532,-259.735)">
                <path d="M626.624,411.537L676.493,440.672L676.652,383.038L626.32,352.31L626.624,411.537Z" />
                <path d="M626.624,411.537L676.493,440.672L676.652,383.038L626.32,352.31L626.624,411.537ZM628.141,410.501L627.857,355.189C627.857,355.189 675.127,384.047 675.127,384.047C675.127,384.047 674.979,437.866 674.979,437.866L628.141,410.501Z" />
                <path d="M688.026,384.248L688.666,441.98L735.89,417.485L735.682,358.935L688.026,384.248Z" />
                <path d="M688.026,384.248L688.666,441.98L735.89,417.485L735.682,358.935L688.026,384.248ZM689.559,385.319L734.17,361.624C734.17,361.624 734.365,416.399 734.365,416.399C734.365,416.399 690.159,439.329 690.159,439.329L689.559,385.319Z" />
                <path d="M681.555,374.547L633.754,343.801L679.739,319.346L729.504,349.409L681.555,374.547Z" />
                <path d="M681.555,374.547L633.754,343.801L679.739,319.346L729.504,349.409L681.555,374.547ZM681.627,372.629L637.031,343.945C637.031,343.945 679.696,321.255 679.696,321.255C679.696,321.255 726.122,349.302 726.122,349.302L681.627,372.629Z" />
            </g>
        </svg>
    );
};
