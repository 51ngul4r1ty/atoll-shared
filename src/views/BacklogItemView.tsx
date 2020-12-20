// externals
import * as React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// components
import { TopMenuPanelContainer } from "../containers/TopMenuPanelContainer";
import { BacklogItemFullDetailForm } from "../components/organisms/forms/BacklogItemFullDetailForm";

// consts/enums
import { EditMode } from "../components/molecules/buttons/EditButton";
import { BacklogItemType } from "../types/backlogItemTypes";
import {
    resetCurrentBacklogItem,
    saveCurrentBacklogItem,
    updateCurrentBacklogItemFields
} from "../actions/currentBacklogItemActions";

export interface BacklogItemViewStateProps {
    acceptanceCriteria: string;
    backlogItemDisplayId: string;
    editMode: EditMode;
    electronClient: boolean;
    estimate: number;
    externalId: string;
    friendlyId: string;
    id: string;
    projectDisplayId: string;
    reasonPhrase: string;
    rolePhrase: string;
    saved: boolean;
    showWindowTitleBar: boolean;
    storyPhrase: string;
    type: BacklogItemType;
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
    return (
        <>
            {/* <Helmet
                    defaultTitle="Atoll"
                    titleTemplate="Atoll – %s"
                    link={[{ rel: "icon", type: "image/png", href: favicon }]}
                /> */}
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
                type={props.type}
                onDataUpdate={(fields) => {
                    dispatch(updateCurrentBacklogItemFields(fields));
                }}
                onSaveClick={() => {
                    dispatch(saveCurrentBacklogItem());
                }}
                onCancelClick={() => {
                    dispatch(resetCurrentBacklogItem());
                }}
            />
        </>
    );
};
