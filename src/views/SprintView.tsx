// externals
import * as React from "react";
import Helmet from "react-helmet";

// components
import { TopMenuPanelContainer } from "../containers/TopMenuPanelContainer";

// contexts
import { AppConsumer } from "../contexts/appContextUtil";

// consts/enums
import { EditMode } from "../components/common/componentEnums";

export interface SprintViewStateProps {
    editMode: EditMode;
    electronClient: boolean;
    showWindowTitleBar: boolean;
}

export interface SprintViewDispatchProps {}

export type SprintViewProps = SprintViewStateProps & SprintViewDispatchProps;

export const SprintView: React.FC<SprintViewProps> = (props) => {
    return (
        <>
            <Helmet>
                <title>Sprint View</title>
                <meta name="description" content="Allows the team to easily work the items in a sprint." />
            </Helmet>
            <AppConsumer>
                {(appConsumerProps) => {
                    return (
                        <TopMenuPanelContainer
                            activeTabId="sprint"
                            treatAsElectronTitleBar={props.electronClient && !props.showWindowTitleBar}
                        />
                    );
                }}
            </AppConsumer>
        </>
    );
};
