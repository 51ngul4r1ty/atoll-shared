// interfaces/types
import { PropsWithInvertColors } from "./types";

export const getFillClassName = (props: PropsWithInvertColors, cssFillInverted: string, cssFill: string): string =>
    props.invertColors ? cssFillInverted : cssFill;

export const getStrokeClassName = (props: PropsWithInvertColors, cssStrokeInverted: string, cssStroke: string): string =>
    props.invertColors ? cssStrokeInverted : cssStroke;

export const getFillAndStrokeClassNames = (
    props: PropsWithInvertColors,
    cssFillInverted: string,
    cssFill: string,
    cssStrokeInverted: string,
    cssStroke: string
) => ({
    fillClass: getFillClassName(props, cssFillInverted, cssFill),
    strokeClass: getStrokeClassName(props, cssStrokeInverted, cssStroke)
});
