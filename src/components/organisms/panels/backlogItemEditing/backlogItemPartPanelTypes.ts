// externals
import { WithTranslation } from "react-i18next";

export type BacklogItemPartPanelStateProps = {
    editable?: boolean;
    partIndex: number;
    totalParts: number;
    sprintName?: string | null;
};

export type BacklogItemPartPanelDispatchProps = {};

export type BacklogItemPartPanelProps = BacklogItemPartPanelStateProps & BacklogItemPartPanelDispatchProps & WithTranslation;
