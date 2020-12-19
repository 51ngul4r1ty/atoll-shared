// externals
import * as React from "react";

// components
import { TopMenuPanelContainer } from "../containers/TopMenuPanelContainer";
import { BacklogItemFullDetailForm } from "../components/organisms/forms/BacklogItemFullDetailForm";

// consts/enums
import { EditMode } from "../components/molecules/buttons/EditButton";
import { BacklogItemType } from "../types/backlogItemTypes";
import { useEffect } from "react";

export interface BacklogItemViewStateProps {
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
                friendlyIdDisabled={!props.saved}
                externalId={props.externalId}
                editable={false}
                editing={false}
                saved={true}
                estimate={props.estimate}
                rolePhrase={props.rolePhrase}
                storyPhrase={props.storyPhrase}
                reasonPhrase={props.reasonPhrase}
                type={props.type}
                onDataUpdate={(fields) => {
                    //                    dispatch(updateBacklogItemFields(fields));
                }}
                onDoneClick={(id, instanceId) => {
                    // if (id) {
                    //     dispatch(updateBacklogItem(id));
                    // } else {
                    //     dispatch(saveNewBacklogItem(instanceId));
                    // }
                }}
                onCancelClick={(id, instanceId) => {
                    // if (id) {
                    //     dispatch(cancelEditBacklogItem(id));
                    // } else {
                    //     dispatch(cancelUnsavedBacklogItem(instanceId));
                    // }
                }}
            />
        </>
    );
};
