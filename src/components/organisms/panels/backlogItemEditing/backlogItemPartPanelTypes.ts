// externals
import { WithTranslation } from "react-i18next";

// interfaces/types
import type { ItemMenuBuilder } from "../../../molecules/menus/menuBuilderTypes";

export type BacklogItemPartPanelStateProps = {
    buildItemMenu?: ItemMenuBuilder;
    editable?: boolean;
    expanded: boolean;
    hasDetails: boolean;
    partId: string;
    partIndex: number;
    percentage?: number | null;
    points?: number | null;
    showDetailMenu?: boolean;
    showDetailMenuToLeft?: boolean;
    sprintName?: string | null;
    totalParts: number;
};

export type BacklogItemPartPanelDispatchProps = {
    onDetailClick: () => void;
    onPointsUpdate: (value: string) => void;
};

export type BacklogItemPartPanelProps = BacklogItemPartPanelStateProps & BacklogItemPartPanelDispatchProps & WithTranslation;
