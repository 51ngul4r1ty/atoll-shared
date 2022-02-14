// interfaces/types
import type { ApiActionMetaData } from "../../middleware/apiTypes";
import { cloneWithNested } from "../../utils/cloneUtils";

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

export const buildStandardMeta = <P>(actionParams: Record<string, any>, passthrough?: P) => {
    const actionParamsClone = cloneWithNested(actionParams);
    const metaOptions = actionParamsClone.options;
    if (metaOptions) {
        delete metaOptions.passthroughData;
        if (Object.keys(metaOptions).length === 0) {
            delete actionParamsClone.options;
        }
    }
    const meta: ApiActionMetaData<any, P> = { actionParams: actionParamsClone };
    if (passthrough) {
        meta.passthrough = passthrough;
    }
    return meta;
};
