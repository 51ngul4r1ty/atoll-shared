export type ApiActionStage = "request" | "success" | "failure";

export const buildActionName = (apiAction: string, stage: ApiActionStage) => `app/api:${apiAction}:${stage}`;

export const buildRequestActionName = (apiAction: string) => buildActionName(apiAction, "request");
export const buildSuccessActionName = (apiAction: string) => buildActionName(apiAction, "success");
export const buildFailureActionName = (apiAction: string) => buildActionName(apiAction, "failure");

export const buildActionTypes = (apiAction: string) => [
    buildRequestActionName(apiAction),
    buildSuccessActionName(apiAction),
    buildFailureActionName(apiAction)
];
