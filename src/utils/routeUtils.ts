import { ALL_ROUTES } from "../constants/routes";

export enum RoutePartType {
    STRING,
    VARIABLE
}

export type RoutePart = {
    type: RoutePartType;
    value: string;
};

export const getRouteParts = (currentRoute: string): RoutePart[] => {
    const result: RoutePart[] = [];
    const parts = currentRoute.split("/");
    parts.forEach((part) => {
        const isVariable = part.startsWith(":");
        const value = isVariable ? part.substring(1) : part;
        const type = isVariable ? RoutePartType.VARIABLE : RoutePartType.STRING;
        result.push({
            type,
            value
        });
    });
    return result;
};

export type ParseCompareRoutePartsResult = {
    matches: boolean;
    variables: Record<string, string> | null;
};

export const parseCompareRouteParts = (currentRoute: string, route: string): ParseCompareRoutePartsResult => {
    const variables: Record<string, string> = {};
    const currentRouteParts = getRouteParts(currentRoute);
    const routeParts = getRouteParts(route);
    if (currentRouteParts.length !== routeParts.length) {
        return {
            matches: false,
            variables: null
        };
    }
    let matches = true;
    for (let idx = 0; idx < currentRouteParts.length; idx++) {
        const currentRoutePart = currentRouteParts[idx];
        const routePart = routeParts[idx];
        if (routePart.type === RoutePartType.VARIABLE) {
            variables[routePart.value] = currentRoutePart.value;
        } else if (routePart.value !== currentRoutePart.value) {
            matches = false;
        }
    }
    return {
        matches,
        variables
    };
};

export const routeMatches = (currentRoute: string, route: string) => {
    if (route === currentRoute) {
        return true;
    }
    const parseComparePartsResult = parseCompareRouteParts(currentRoute, route);
    return parseComparePartsResult.matches;
};

export const mapToRouteTemplate = (currentRoute: string): string | null => {
    const matchingRoutes = ALL_ROUTES.filter((route) => routeMatches(currentRoute, route));
    return matchingRoutes.length >= 1 ? matchingRoutes[0] : null;
};
