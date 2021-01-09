// utils
import { SpinnerAction } from "./SmartSpinner";
import { formatFunctionArg, parseTemplateParts, TemplatePartType } from "./spinnerTemplateUtils";

export const buildSpinnerHoverText = (template: string, action: SpinnerAction, itemCount: number): string => {
    const templateParts = parseTemplateParts(template);
    let actionText: string;
    if (action === SpinnerAction.Loading) {
        actionText = "loading";
    } else if (action === SpinnerAction.Calculating) {
        actionText = "calculating";
    } else {
        return;
    }
    let formattedTemplate = "";
    templateParts.forEach((templatePart) => {
        if (templatePart.partType === TemplatePartType.Text) {
            formattedTemplate += templatePart.textValue;
        } else if (templatePart.partType === TemplatePartType.TemplateLiteral) {
            if (templatePart.functionName === "plural") {
                const plural = itemCount !== 1;
                const singleValue = formatFunctionArg(templatePart.functionArgs[0]);
                const multipleValue = formatFunctionArg(templatePart.functionArgs[1]);
                formattedTemplate += plural ? multipleValue : singleValue;
            }
        }
    });
    return `${actionText} ${formattedTemplate}`;
};
