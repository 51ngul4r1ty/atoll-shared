// externals
import { WithTranslation } from "react-i18next";

export type BacklogItemPartPanelStateProps = {
    expanded: boolean;
    editable?: boolean;
    partIndex: number;
    totalParts: number;
    sprintName?: string | null;
    points?: number | null;
    percentage?: number | null;
};

export type BacklogItemPartPanelDispatchProps = {
    onPointsUpdate: (value: string) => void;
};

export type BacklogItemPartPanelProps = BacklogItemPartPanelStateProps & BacklogItemPartPanelDispatchProps & WithTranslation;
