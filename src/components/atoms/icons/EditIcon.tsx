// externals
import * as React from "react";

// style
import css from "../../common/base.module.css";

/* exported components */

export const EditIcon: React.FC<{}> = () => (
    <svg
        strokeWidth="0.501"
        strokeLinejoin="bevel"
        fillRule="evenodd"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        overflow="visible"
        width="75px"
        height="75px"
        viewBox="0 -75 75 75"
    >
        <defs />
        <g id="Document" className={css.stroke} fill="none" stroke="black" transform="scale(1 -1)">
            <path
                d="M 30.407,23.788 L 32.389,25.77 L 27.27,30.889 L 25.288,28.907 L 25.288,26.576 L 28.076,26.576 L 28.076,23.788 L 30.407,23.788 Z M 41.799,44.002 C 41.799,44.321 41.639,44.481 41.319,44.481 C 41.174,44.481 41.051,44.43 40.949,44.328 L 29.143,32.523 C 29.042,32.421 28.991,32.298 28.991,32.153 C 28.991,31.833 29.151,31.673 29.47,31.673 C 29.615,31.673 29.739,31.724 29.84,31.826 L 41.646,43.632 C 41.748,43.733 41.799,43.857 41.799,44.002 Z M 40.623,48.184 L 49.684,39.123 L 31.561,21 L 22.5,21 L 22.5,30.061 L 40.623,48.184 Z M 55.5,46.093 C 55.499,45.323 55.231,44.67 54.694,44.132 L 51.078,40.516 L 42.017,49.578 L 45.633,53.172 C 46.155,53.724 46.809,54 47.593,54 C 48.363,54 49.023,53.724 49.575,53.172 L 54.694,48.075 C 55.231,47.508 55.499,46.847 55.5,46.093 Z"
                className={css.fill}
                fill="#0d2644"
                fillRule="nonzero"
                strokeLinejoin="round"
                strokeLinecap="round"
                stroke="none"
                strokeWidth="1.464"
                markerStart="none"
                markerEnd="none"
            />
        </g>
    </svg>
);
