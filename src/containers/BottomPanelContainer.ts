// externals
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { push } from "connected-react-router";

// actions
import { errorPanelClick, setEditMode } from "../actions/appActions";
import { apiGetBacklogItems } from "../actions/apiBacklogItems";

// state
import { StateTree } from "../reducers/rootReducer";

// components
import { BottomPanel } from "../components/organisms/panels/BottomPanel";

// consts/enums
// import { EditMode } from "../components/common/componentEnums";

// interfaces/types
import { BottomPanelStateProps, BottomPanelDispatchProps } from "../components/organisms/panels/BottomPanel";

// selectors
// import * as appSelectors from "../selectors/appSelectors";
// import * as backlogItemSelectors from "../selectors/backlogItemSelectors";

export interface BottomPanelContainerProps {
    // activeTabId: string;
    // treatAsElectronTitleBar: boolean;
    // hideEditViewButton?: boolean;
}

const mapStateToProps = (state: StateTree, ownProps: BottomPanelContainerProps): BottomPanelStateProps => {
    let result: BottomPanelStateProps = {
        // activeTabId: ownProps.activeTabId,
        // editMode: appSelectors.getAppEditMode(state),
        // showRefreshButton: backlogItemSelectors.hasPushedBacklogItems(state),
        // treatAsElectronTitleBar: ownProps.treatAsElectronTitleBar,
        // message: appSelectors.getAppMessage(state),
        // hideEditViewButton: ownProps.hideEditViewButton
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): BottomPanelDispatchProps => {
    return {
        // onErrorPanelClick: () => {
        //     dispatch(errorPanelClick());
        // },
        // onChangeTab: (tabId: string) => {
        //     switch (tabId) {
        //         case "plan":
        //             dispatch(push("/plan"));
        //             break;
        //         case "sprint":
        //             dispatch(push("/sprint"));
        //             break;
        //         case "review":
        //             dispatch(push("/review"));
        //             break;
        //     }
        // },
        // setEditMode: (editMode: EditMode) => {
        //     dispatch(setEditMode(editMode));
        // },
        // refreshData: () => {
        //     dispatch(apiGetBacklogItems());
        // }
    };
};

export const BottomPanelContainer = connect(mapStateToProps, mapDispatchToProps)(BottomPanel);
