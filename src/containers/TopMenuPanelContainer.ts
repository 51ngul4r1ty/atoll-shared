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
import { TopMenuPanel } from "../components/organisms/panels/TopMenuPanel";

// consts/enums
import { EditMode } from "../components/molecules/buttons/EditButton";

// interfaces/types
import { TopMenuPanelStateProps, TopMenuPanelDispatchProps } from "../components/organisms/panels/TopMenuPanel";

// selectors
import * as appSelectors from "../selectors/appSelectors";
import * as backlogItemSelectors from "../selectors/backlogItemSelectors";

export interface TopMenuPanelContainerProps {
    activeTabId: string;
    treatAsElectronTitleBar: boolean;
    showEditViewButton?: boolean;
}

const mapStateToProps = (state: StateTree, ownProps: TopMenuPanelContainerProps): TopMenuPanelStateProps => {
    let result: TopMenuPanelStateProps = {
        activeTabId: ownProps.activeTabId,
        editMode: appSelectors.getAppEditMode(state),
        showRefreshButton: backlogItemSelectors.hasPushedBacklogItems(state),
        treatAsElectronTitleBar: ownProps.treatAsElectronTitleBar,
        message: appSelectors.getAppMessage(state),
        showEditViewButton: ownProps.showEditViewButton
    };
    return result;
};

const mapDispatchToProps = (dispatch: Dispatch): TopMenuPanelDispatchProps => {
    return {
        onErrorPanelClick: () => {
            dispatch(errorPanelClick());
        },
        onChangeTab: (tabId: string) => {
            switch (tabId) {
                case "plan":
                    dispatch(push("/plan"));
                    break;
                case "sprint":
                    dispatch(push("/sprint"));
                    break;
                case "review":
                    dispatch(push("/review"));
                    break;
            }
        },
        setEditMode: (editMode: EditMode) => {
            dispatch(setEditMode(editMode));
        },
        refreshData: () => {
            dispatch(apiGetBacklogItems());
        }
    };
};

export const TopMenuPanelContainer = connect(mapStateToProps, mapDispatchToProps)(TopMenuPanel);
