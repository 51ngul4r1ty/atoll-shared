// externals
import * as React from "react";

// components
import { TopMenuPanelContainer } from "../containers/TopMenuPanelContainer";
import { BacklogItemFullDetailForm } from "../components/organisms/forms/BacklogItemFullDetailForm";

// consts/enums
import { EditMode } from "../components/molecules/buttons/EditButton";
import { BacklogItemType } from "../types/backlogItemTypes";

export interface BacklogItemViewStateProps {
    editMode: EditMode;
    electronClient: boolean;
    showWindowTitleBar: boolean;
    id: string;
    friendlyId: string;
    externalId: string;
    saved: boolean;
    estimate: number;
    rolePhrase: string;
    storyPhrase: string;
    reasonPhrase: string;
    type: BacklogItemType;
}

export interface BacklogItemViewDispatchProps {}

export type BacklogItemViewProps = BacklogItemViewStateProps & BacklogItemViewDispatchProps;

export const BacklogItemView: React.FC<BacklogItemViewProps> = (props) => {
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
                editing
                saved
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
