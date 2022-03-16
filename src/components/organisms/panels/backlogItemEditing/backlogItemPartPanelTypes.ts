// externals
import { WithTranslation } from "react-i18next";

export type BacklogItemPartPanelStateProps = {
    editable?: boolean;
    expanded: boolean;
    hasDetails: boolean;
    partId: string;
    partIndex: number;
    percentage?: number | null;
    points?: number | null;
    sprintName?: string | null;
    totalParts: number;
};

export type BacklogItemPartPanelDispatchProps = {
    onDetailClick: () => void;
    onPointsUpdate: (value: string) => void;
};

export type BacklogItemPartPanelProps = BacklogItemPartPanelStateProps & BacklogItemPartPanelDispatchProps & WithTranslation;
