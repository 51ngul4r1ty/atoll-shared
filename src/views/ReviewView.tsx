// externals
import * as React from "react";
import Helmet from "react-helmet";

// components
import { TopMenuPanelContainer } from "../containers/TopMenuPanelContainer";

// consts/enums
import { EditMode } from "../components/common/componentEnums";

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
            <Helmet>
                <title>Sprint Review View</title>
                <meta
                    name="description"
                    content="Allows a ScrumMaster to easily access all information required for a sprint review."
                />
            </Helmet>
            <TopMenuPanelContainer
                activeTabId="review"
                treatAsElectronTitleBar={props.electronClient && !props.showWindowTitleBar}
            />
        </>
    );
};
