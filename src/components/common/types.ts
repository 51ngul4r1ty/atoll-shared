export type PropsWithClassName = {
    className?: string;
};

export type PropsWithInvertColors = {
    invertColors?: boolean;
};

export type StandardComponentProps = PropsWithClassName;

export type StandardInvertibleComponentProps = StandardComponentProps & PropsWithInvertColors;

export type ElementAttribute<T = any> = {
    name: string;
    value: T;
};
