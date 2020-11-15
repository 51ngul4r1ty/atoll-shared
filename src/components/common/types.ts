export interface PropsWithClassName {
    className?: string;
}

export interface PropsWithInvertColors {
    invertColors?: boolean;
}

export type StandardComponentProps = PropsWithClassName;

export type StandardInvertibleComponentProps = StandardComponentProps & PropsWithInvertColors;

export interface ElementAttribute<T = any> {
    name: string;
    value: T;
}
