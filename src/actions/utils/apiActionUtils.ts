export type ApiActionStage = "request" | "success" | "failure";

export const buildActionName = (apiAction: string, stage: ApiActionStage) => `app/api:${apiAction}:${stage}`;

export const buildActionTypes = (apiAction: string) => [
    buildActionName(apiAction, "request"),
    buildActionName(apiAction, "success"),
    buildActionName(apiAction, "failure")
];
