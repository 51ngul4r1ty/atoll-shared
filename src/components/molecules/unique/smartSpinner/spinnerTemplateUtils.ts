export enum TemplatePartType {
    Text,
    TemplateLiteral
}

export interface SpinnerTemplatePart {
    partType: TemplatePartType;
    textValue?: string;
    functionName?: string;
    functionArgs?: string[];
}

export type SpinnerTemplateParts = SpinnerTemplatePart[];

export const parseTemplateParts = (templateText: string): SpinnerTemplateParts => {
    if (!templateText) {
        return [];
    }
    const rawParts = templateText.split("`");
    let insideTemplateLiteral = false;
    const result: SpinnerTemplateParts = [];
    rawParts.forEach((rawPart) => {
        if (rawPart) {
            if (!insideTemplateLiteral) {
                result.push({
                    partType: TemplatePartType.Text,
                    textValue: rawPart
                });
            } else {
                // e.g. {plural('item','items'}
                if (!rawPart.startsWith("${")) {
                    throw new Error(`Unexpected template literal string inside Template: "${rawPart}" - should start with "\${"}`);
                }
                if (!rawPart.endsWith("}")) {
                    throw new Error(`Unexpected template literal string inside Template: "${rawPart}" - should end with "}"}`);
                }
                const rawTemplateLiteral = rawPart.substr(2, rawPart.length - 3);
                const parenOpenIdx = rawTemplateLiteral.indexOf("(");
                if (parenOpenIdx < 0) {
                    throw new Error(
                        `Unexpected template literal string inside Template: "${rawTemplateLiteral}" - function name expected`
                    );
                } else {
                    const functionName = rawTemplateLiteral.substr(0, parenOpenIdx);
                    if (!rawTemplateLiteral.endsWith(")")) {
                        throw new Error(
                            `Unexpected template literal string inside Template: "${rawTemplateLiteral}"` +
                                ` - opening "(" found, but no closing ")"`
                        );
                    } else {
                        const rawFunctionArgs = rawTemplateLiteral.substring(
                            functionName.length + 1,
                            rawTemplateLiteral.length - 1
                        );
                        const functionArgs = rawFunctionArgs.split(",");
                        result.push({
                            partType: TemplatePartType.TemplateLiteral,
                            functionName,
                            functionArgs
                        });
                    }
                }
            }
        }
        insideTemplateLiteral = !insideTemplateLiteral;
    });
    return result;
};

export const formatFunctionArg = (arg: string): string => {
    if (!arg) {
        return "";
    }
    if (arg.startsWith("'") && arg.endsWith("'")) {
        return arg.substring(1, arg.length - 1);
    } else {
        return `${arg}`;
    }
};
