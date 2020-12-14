// externals
import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T): T {
    const ref = useRef();
    useEffect(() => {
        (ref.current as any) = value;
    });
    return ref.current;
}
