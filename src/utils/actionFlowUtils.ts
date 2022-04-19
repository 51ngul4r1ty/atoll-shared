export type FlowActionBase = {
    type: string;
    meta: FlowActionMeta;
};

export type ActionFlowInfo = {
    triggerAction: string | null;
    stepName: string | null;
};

export type FlowActionMeta = {
    passthrough?: {
        triggerAction: string;
        stepName: string;
    };
};

export const getFlowInfoFromAction = <T extends FlowActionBase>(action: T): ActionFlowInfo => {
    const meta = action.meta;
    const triggerAction = meta?.passthrough?.triggerAction ?? null;
    const stepName = meta?.passthrough?.stepName ?? null;
    return {
        triggerAction,
        stepName
    };
};
