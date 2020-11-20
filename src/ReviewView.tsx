// externals
import * as React from "react";

// components
import { TopMenuPanelContainer } from "./containers/TopMenuPanelContainer";

// consts/enums
import { EditMode } from "./components/molecules/buttons/EditButton";

export interface ReviewViewStateProps {
    editMode: EditMode;
    electronClient: boolean;
    showWindowTitleBar: boolean;
}

export interface ReviewViewDispatchProps {}

export type ReviewViewProps = ReviewViewStateProps & ReviewViewDispatchProps;

export const ReviewView: React.FC<ReviewViewProps> = (props) => {
    return (
        <>
            {/* <Helmet
                    defaultTitle="Atoll"
                    titleTemplate="Atoll – %s"
                    link={[{ rel: "icon", type: "image/png", href: favicon }]}
                /> */}
            <TopMenuPanelContainer
                activeTabId="review"
                treatAsElectronTitleBar={props.electronClient && !props.showWindowTitleBar}
            />
        </>
    );
};
