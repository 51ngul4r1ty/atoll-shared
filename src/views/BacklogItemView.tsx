// externals
import * as React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Helmet from "react-helmet";

// interfaces/types
import type { BacklogItemPartForSplitForm } from "../selectors/backlogItemPartSelectors";

// components
import { TopMenuPanelContainer } from "../containers/TopMenuPanelContainer";
import { BacklogItemFullDetailForm } from "../components/organisms/forms/BacklogItemFullDetailForm";

// actions
import { backlogItemPartDetailClick } from "../actions/backlogItemPartActions";

// consts/enums
import { EditMode } from "../components/common/componentEnums";
import { BacklogItemType } from "../types/backlogItemTypes";
import {
    resetCurrentBacklogItem,
    saveCurrentBacklogItem,
    updateBacklogItemPartPoints,
    updateCurrentBacklogItemFields
} from "../actions/currentBacklogItemActions";

export interface BacklogItemViewStateProps {
    acceptanceCriteria: string;
    acceptedAt: Date | null;
    backlogItemDisplayId: string;
    editMode: EditMode;
    electronClient: boolean;
    estimate: number;
    externalId: string;
    finishedAt: Date | null;
    friendlyId: string;
    id: string;
    openedDetailMenuBacklogItemPartId: string | null;
    parts: BacklogItemPartForSplitForm[];
    projectDisplayId: string;
    reasonPhrase: string;
    releasedAt: Date | null;
    rolePhrase: string;
    saved: boolean;
    showWindowTitleBar: boolean;
    startedAt: Date | null;
    storyPhrase: string;
    type: BacklogItemType;
    strictMode: boolean;
}

export interface BacklogItemViewDispatchProps {
    onLoaded: { (projectDisplayId: string, backlogItemDisplayId: string): void };
}

export type BacklogItemViewProps = BacklogItemViewStateProps & BacklogItemViewDispatchProps;

export const BacklogItemView: React.FC<BacklogItemViewProps> = (props) => {
    const dispatch = useDispatch();
    useEffect(() => {
        props.onLoaded(props.projectDisplayId, props.backlogItemDisplayId);
    }, []);
    const classNameToUse = "";
    const title = `Backlog Item (${props.externalId || props.friendlyId || props.id})`;
    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content="Shows backlog item detailed fields." />
            </Helmet>
            <TopMenuPanelContainer
                activeTabId="backlogitem"
                treatAsElectronTitleBar={props.electronClient && !props.showWindowTitleBar}
            />
            <BacklogItemFullDetailForm
                className={classNameToUse}
                id={props.id}
                friendlyId={props.friendlyId}
                externalId={props.externalId}
                editable={props.editMode === EditMode.Edit}
                saved={props.saved}
                estimate={props.estimate}
                rolePhrase={props.rolePhrase}
                storyPhrase={props.storyPhrase}
                reasonPhrase={props.reasonPhrase}
                acceptanceCriteria={props.acceptanceCriteria}
                startedAt={props.startedAt}
                finishedAt={props.finishedAt}
                acceptedAt={props.acceptedAt}
                releasedAt={props.releasedAt}
                type={props.type}
                parts={props.parts}
                strictMode={props.strictMode}
                openedDetailMenuBacklogItemPartId={props.openedDetailMenuBacklogItemPartId}
                onDataUpdate={(fields) => {
                    dispatch(updateCurrentBacklogItemFields(fields));
                }}
                onSaveClick={() => {
                    dispatch(saveCurrentBacklogItem());
                }}
                onCancelClick={() => {
                    dispatch(resetCurrentBacklogItem());
                }}
                onPartPointsUpdate={(partId: string, value: string) => {
                    dispatch(updateBacklogItemPartPoints(partId, value));
                }}
                onDetailClick={(partId: string, strictMode: boolean) => {
                    dispatch(backlogItemPartDetailClick(partId, strictMode));
                }}
            />
        </>
    );
};
