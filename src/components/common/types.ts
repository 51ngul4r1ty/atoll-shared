export interface PropsWithClassName {
    className?: string;
}

export interface PropsWithInvertColors {
    invertColors?: boolean;
}

export type StandardComponentProps = PropsWithClassName;

export type StandardInvertibleComponentProps = StandardComponentProps & PropsWithInvertColors;
