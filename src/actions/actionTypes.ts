// consts/enums
import * as Names from "./apiActionNames";
import { POST_ACTION_JOIN_UNALLOCATED_BACKLOG_ITEM_PARTS } from "./apiActionNames";

// utils
import { buildFailureActionName, buildRequestActionName, buildSuccessActionName } from "./utils/apiActionUtils";

export const INIT_APP = "app/init";
export const APP_CLICK = "app/click";
export const APP_REFRESH_VIEW = "app/refresh-view";
export const APP_KEYUP = "app/keyup";

export const LOCAL_STORE_REFRESH_TOKEN = "app/local-store:refresh-token";

export const SET_LOCALE = "app/set-locale";
export const SET_EDIT_MODE = "app/set-edit-mode";

export const ERROR_PANEL_CLICK = "app/error-panel:click";

// #region User Prefs Resource
export const API_GET_USER_PREFS_REQUEST = buildRequestActionName(Names.GET_USER_PREFS);
export const API_GET_USER_PREFS_SUCCESS = buildSuccessActionName(Names.GET_USER_PREFS);
export const API_GET_USER_PREFS_FAILURE = buildFailureActionName(Names.GET_USER_PREFS);

export const API_PATCH_USER_PREFS_REQUEST = buildRequestActionName(Names.PATCH_USER_PREFS);
export const API_PATCH_USER_PREFS_SUCCESS = buildSuccessActionName(Names.PATCH_USER_PREFS);
export const API_PATCH_USER_PREFS_FAILURE = buildFailureActionName(Names.PATCH_USER_PREFS);
// #endregion

// #region Backlog Items Resource Collection
export const API_GET_BACKLOG_ITEMS_REQUEST = buildRequestActionName(Names.GET_BACKLOG_ITEMS);
export const API_GET_BACKLOG_ITEMS_SUCCESS = buildSuccessActionName(Names.GET_BACKLOG_ITEMS);
export const API_GET_BACKLOG_ITEMS_FAILURE = buildFailureActionName(Names.GET_BACKLOG_ITEMS);
// #endregion

// #region BFF
export const API_GET_BFF_VIEWS_PLAN_REQUEST = buildRequestActionName(Names.GET_BFF_VIEWS_PLAN);
export const API_GET_BFF_VIEWS_PLAN_SUCCESS = buildSuccessActionName(Names.GET_BFF_VIEWS_PLAN);
export const API_GET_BFF_VIEWS_PLAN_FAILURE = buildFailureActionName(Names.GET_BFF_VIEWS_PLAN);

export const API_GET_BFF_VIEWS_BACKLOG_ITEM_REQUEST = buildRequestActionName(Names.GET_BFF_VIEWS_BACKLOG_ITEM);
export const API_GET_BFF_VIEWS_BACKLOG_ITEM_SUCCESS = buildSuccessActionName(Names.GET_BFF_VIEWS_BACKLOG_ITEM);
export const API_GET_BFF_VIEWS_BACKLOG_ITEM_FAILURE = buildFailureActionName(Names.GET_BFF_VIEWS_BACKLOG_ITEM);
//#endregion

// #region Backlog Item Resource
export const API_GET_BACKLOG_ITEM_REQUEST = buildRequestActionName(Names.GET_BACKLOG_ITEM);
export const API_GET_BACKLOG_ITEM_SUCCESS = buildSuccessActionName(Names.GET_BACKLOG_ITEM);
export const API_GET_BACKLOG_ITEM_FAILURE = buildFailureActionName(Names.GET_BACKLOG_ITEM);

export const API_POST_BACKLOG_ITEM_REQUEST = buildRequestActionName(Names.POST_BACKLOG_ITEM);
export const API_POST_BACKLOG_ITEM_SUCCESS = buildSuccessActionName(Names.POST_BACKLOG_ITEM);
export const API_POST_BACKLOG_ITEM_FAILURE = buildFailureActionName(Names.POST_BACKLOG_ITEM);

export const API_PUT_BACKLOG_ITEM_REQUEST = buildRequestActionName(Names.PUT_BACKLOG_ITEM);
export const API_PUT_BACKLOG_ITEM_SUCCESS = buildSuccessActionName(Names.PUT_BACKLOG_ITEM);
export const API_PUT_BACKLOG_ITEM_FAILURE = buildFailureActionName(Names.PUT_BACKLOG_ITEM);

export const API_PATCH_BACKLOG_ITEM_REQUEST = buildRequestActionName(Names.PATCH_BACKLOG_ITEM);
export const API_PATCH_BACKLOG_ITEM_SUCCESS = buildSuccessActionName(Names.PATCH_BACKLOG_ITEM);
export const API_PATCH_BACKLOG_ITEM_FAILURE = buildFailureActionName(Names.PATCH_BACKLOG_ITEM);

export const API_DELETE_BACKLOG_ITEM_REQUEST = buildRequestActionName(Names.DELETE_BACKLOG_ITEM);
export const API_DELETE_BACKLOG_ITEM_SUCCESS = buildSuccessActionName(Names.DELETE_BACKLOG_ITEM);
export const API_DELETE_BACKLOG_ITEM_FAILURE = buildFailureActionName(Names.DELETE_BACKLOG_ITEM);
// #endregion

// #region Backlog Item Part Resource
export const API_GET_BACKLOG_ITEM_PART_REQUEST = buildSuccessActionName(Names.GET_BACKLOG_ITEM_PART);
export const API_GET_BACKLOG_ITEM_PART_SUCCESS = buildSuccessActionName(Names.GET_BACKLOG_ITEM_PART);
export const API_GET_BACKLOG_ITEM_PART_FAILURE = buildSuccessActionName(Names.GET_BACKLOG_ITEM_PART);

export const API_PATCH_BACKLOG_ITEM_PART_REQUEST = buildRequestActionName(Names.PATCH_BACKLOG_ITEM_PART);
export const API_PATCH_BACKLOG_ITEM_PART_SUCCESS = buildSuccessActionName(Names.PATCH_BACKLOG_ITEM_PART);
export const API_PATCH_BACKLOG_ITEM_PART_FAILURE = buildFailureActionName(Names.PATCH_BACKLOG_ITEM_PART);
// #endregion

// #region Backlog Item Ranks Resource Collection
export const API_GET_BACKLOG_ITEM_RANKS_REQUEST = buildRequestActionName(Names.GET_PRODUCT_BACKLOG_ITEMS);
export const API_GET_BACKLOG_ITEM_RANKS_SUCCESS = buildSuccessActionName(Names.GET_PRODUCT_BACKLOG_ITEMS);
export const API_GET_BACKLOG_ITEM_RANKS_FAILURE = buildFailureActionName(Names.GET_PRODUCT_BACKLOG_ITEMS);
// #endregion

// #region Project Resource Collection
export const API_GET_PROJECTS_SUCCESS = buildSuccessActionName(Names.GET_PROJECTS);
//#endregion

// #region Project Resource Item
export const API_GET_PROJECT_SUCCESS = buildSuccessActionName(Names.GET_PROJECT);
//#endregion

// #region Sprint Resource Collection
export const API_GET_SPRINTS_REQUEST = buildRequestActionName(Names.GET_SPRINTS);
export const API_GET_SPRINTS_SUCCESS = buildSuccessActionName(Names.GET_SPRINTS);
export const API_GET_SPRINTS_FAILURE = buildFailureActionName(Names.GET_SPRINTS);

export const API_POST_SPRINT_REQUEST = buildRequestActionName(Names.POST_SPRINT);
export const API_POST_SPRINT_SUCCESS = buildSuccessActionName(Names.POST_SPRINT);
export const API_POST_SPRINT_FAILURE = buildFailureActionName(Names.POST_SPRINT);
// #endregion

// #region Sprint Resource Item
export const API_GET_SPRINT_REQUEST = buildRequestActionName(Names.GET_SPRINT);
export const API_GET_SPRINT_SUCCESS = buildSuccessActionName(Names.GET_SPRINT);
export const API_GET_SPRINT_FAILURE = buildFailureActionName(Names.GET_SPRINT);

export const API_DELETE_SPRINT_REQUEST = buildRequestActionName(Names.DELETE_SPRINT);
export const API_DELETE_SPRINT_SUCCESS = buildSuccessActionName(Names.DELETE_SPRINT);
export const API_DELETE_SPRINT_FAILURE = buildFailureActionName(Names.DELETE_SPRINT);

export const API_SET_SPRINT_ARCHIVE_FLAG_REQUEST = buildRequestActionName(Names.SET_SPRINT_ARCHIVE_FLAG);
export const API_SET_SPRINT_ARCHIVE_FLAG_SUCCESS = buildSuccessActionName(Names.SET_SPRINT_ARCHIVE_FLAG);
export const API_SET_SPRINT_ARCHIVE_FLAG_FAILURE = buildFailureActionName(Names.SET_SPRINT_ARCHIVE_FLAG);

export const API_PUT_SPRINT_REQUEST = buildRequestActionName(Names.PUT_SPRINT);
export const API_PUT_SPRINT_SUCCESS = buildSuccessActionName(Names.PUT_SPRINT);
export const API_PUT_SPRINT_FAILURE = buildFailureActionName(Names.PUT_SPRINT);
// #endregion

// #region Sprint Backlog Resource
export const API_GET_SPRINT_BACKLOG_ITEMS_REQUEST = buildRequestActionName(Names.GET_SPRINT_BACKLOG_ITEMS);
export const API_GET_SPRINT_BACKLOG_ITEMS_SUCCESS = buildSuccessActionName(Names.GET_SPRINT_BACKLOG_ITEMS);
export const API_GET_SPRINT_BACKLOG_ITEMS_FAILURE = buildFailureActionName(Names.GET_SPRINT_BACKLOG_ITEMS);

export const API_POST_SPRINT_BACKLOG_ITEM_REQUEST = buildRequestActionName(Names.POST_SPRINT_BACKLOG_ITEM);
export const API_POST_SPRINT_BACKLOG_ITEM_SUCCESS = buildSuccessActionName(Names.POST_SPRINT_BACKLOG_ITEM);
export const API_POST_SPRINT_BACKLOG_ITEM_FAILURE = buildFailureActionName(Names.POST_SPRINT_BACKLOG_ITEM);

export const API_DELETE_SPRINT_BACKLOG_ITEM_REQUEST = buildRequestActionName(Names.DELETE_SPRINT_BACKLOG_ITEM);
export const API_DELETE_SPRINT_BACKLOG_ITEM_SUCCESS = buildSuccessActionName(Names.DELETE_SPRINT_BACKLOG_ITEM);
export const API_DELETE_SPRINT_BACKLOG_ITEM_FAILURE = buildFailureActionName(Names.DELETE_SPRINT_BACKLOG_ITEM);
// #endregion

// #region Sprint Backlog Item Parts Resource
export const API_POST_SPRINT_BACKLOG_ITEM_PART_REQUEST = buildRequestActionName(Names.POST_SPRINT_BACKLOG_ITEM_PART);
export const API_POST_SPRINT_BACKLOG_ITEM_PART_SUCCESS = buildSuccessActionName(Names.POST_SPRINT_BACKLOG_ITEM_PART);
export const API_POST_SPRINT_BACKLOG_ITEM_PART_FAILURE = buildFailureActionName(Names.POST_SPRINT_BACKLOG_ITEM_PART);
// #endregion

// #region Post Actions
export const API_POST_ACTION_REORDER_BACKLOG_ITEM_REQUEST = buildRequestActionName(Names.POST_ACTION_REORDER_BACKLOG_ITEM);
export const API_POST_ACTION_REORDER_BACKLOG_ITEM_SUCCESS = buildSuccessActionName(Names.POST_ACTION_REORDER_BACKLOG_ITEM);
export const API_POST_ACTION_REORDER_BACKLOG_ITEM_FAILURE = buildFailureActionName(Names.POST_ACTION_REORDER_BACKLOG_ITEM);

export const API_POST_ACTION_LOGIN_REQUEST = buildRequestActionName(Names.POST_ACTION_LOGIN);
export const API_POST_ACTION_LOGIN_SUCCESS = buildSuccessActionName(Names.POST_ACTION_LOGIN);
export const API_POST_ACTION_LOGIN_FAILURE = buildFailureActionName(Names.POST_ACTION_LOGIN);

export const API_POST_ACTION_RETRY_TOKEN_REQUEST = buildRequestActionName(Names.POST_ACTION_REFRESH_TOKEN);
export const API_POST_ACTION_RETRY_TOKEN_SUCCESS = buildSuccessActionName(Names.POST_ACTION_REFRESH_TOKEN);
export const API_POST_ACTION_RETRY_TOKEN_FAILURE = buildFailureActionName(Names.POST_ACTION_REFRESH_TOKEN);

export const API_POST_ACTION_JOIN_UNALLOCATED_BACKLOG_ITEM_PARTS_REQUEST = buildRequestActionName(
    POST_ACTION_JOIN_UNALLOCATED_BACKLOG_ITEM_PARTS
);
export const API_POST_ACTION_JOIN_UNALLOCATED_BACKLOG_ITEM_PARTS_SUCCESS = buildSuccessActionName(
    POST_ACTION_JOIN_UNALLOCATED_BACKLOG_ITEM_PARTS
);
export const API_POST_ACTION_JOIN_UNALLOCATED_BACKLOG_ITEM_PARTS_FAILURE = buildFailureActionName(
    POST_ACTION_JOIN_UNALLOCATED_BACKLOG_ITEM_PARTS
);
// #endregion

// #region API Batch actions
export const API_BATCH = "API_BATCH";
export const API_BATCH_PROCESS_QUEUE = "app/api-batch:process-queue";
export const API_BATCH_LAST_ITEM_SUCCESS = "app/api-batch:last-item-success";
export const API_BATCH_LAST_ITEM_FAILURE = "app/api-batch:last-item-failure";
export const API_BATCH_COMPLETED = "app/api-batch:completed";
// #endregion

export const ROUTE_PLAN_VIEW = "app/route:plan-view";
export const ROUTE_SPRINT_VIEW = "app/route:sprint-view";
export const ROUTE_REVIEW_VIEW = "app/route:review-view";
export const ROUTE_LOGIN_PAGE = "app/route:login-page";
export const ROUTE_TO = "app/route-to";

export const ADD_BACKLOG_ITEM_FORM = "app/add:backlog-item-form";
export const SAVE_NEW_BACKLOG_ITEM = "app/save:backlog-item";
export const UPDATE_BACKLOG_ITEM = "app/update:backlog-item";
export const CANCEL_UNSAVED_BACKLOG_ITEM = "app/cancel-unsaved:backlog-item";
export const CANCEL_EDIT_BACKLOG_ITEM = "app/cancel-edit:backlog-item";

export const UPDATE_BACKLOG_ITEM_FIELDS = "app/update:backlog-item-fields";

export const UPDATE_CURRENT_BACKLOG_ITEM_FIELDS = "app/update:current-backlog-item-fields";
export const RESET_CURRENT_BACKLOG_ITEM = "app/reset:current-backlog-item";
export const SAVE_CURRENT_BACKLOG_ITEM = "app/save:current-backlog-item";

export const RECEIVE_WEBSOCKET_MESSAGE = "app/ws:receive-message";

export const RECEIVE_PUSHED_BACKLOG_ITEM = "app/receive:pushed-backlog-item";

export const REORDER_BACKLOG_ITEM = "app/reorder:backlog-item";

export const TOGGLE_BACKLOG_ITEM_DETAIL = "app/toggle:backlog-item-detail";
export const EDIT_BACKLOG_ITEM = "app/edit:backlog-item";

export const TOGGLE_BACKLOG_ITEM_PART_DETAIL = "app/toggle:backlog-item-part-detail";
export const EDIT_BACKLOG_ITEM_PART = "app/edit:backlog-item-part";

export const CANCEL_EDIT_BACKLOG_ITEM_PART = "app/cancel-edit:backlog-item-part";
export const UPDATE_BACKLOG_ITEM_PART = "app/update:backlog-item-part";

export const BACKLOG_ITEM_ID_CLICK = "app/click:backlog-item-id";

export const SELECT_PRODUCT_BACKLOG_ITEM = "app/select:product-backlog-item";
export const UNSELECT_PRODUCT_BACKLOG_ITEM = "app/unselect:product-backlog-item";

export const SET_USERNAME = "app/user:set-username";
export const SET_PASSWORD = "app/user:set-password";
export const STORE_RETURN_ROUTE = "app/store:return-route";
export const CLEAR_RETURN_ROUTE = "app/clear:return-route";

export const LOGIN_USER = "app/user:login-user";

export const EXPAND_SPRINT_PANEL = "app/expand:sprint-panel";
export const COLLAPSE_SPRINT_PANEL = "app/collapse:sprint-panel";

export const ADD_SPRINT_FORM = "app/add:sprint-form";
export const SAVE_NEW_SPRINT = "app/save:sprint";
export const UPDATE_SPRINT = "app/update:sprint";
export const CANCEL_UNSAVED_SPRINT = "app/cancel-unsaved:sprint";
export const CANCEL_EDIT_SPRINT = "app/cancel-edit:sprint";

export const UPDATE_SPRINT_FIELDS = "app/update:sprint-fields";

export const ADD_SPRINT = "app/add:sprint";
export const EDIT_SPRINT = "app/edit:sprint";
export const UPDATE_SPRINT_STATS = "app/update:sprint-stats";

export const SHOW_SPRINT_RANGE_DATE_PICKER = "app/show:sprint-range-date-picker";
export const HIDE_SPRINT_RANGE_DATE_PICKER = "app/hide:sprint-range-date-picker";

export const MOVE_SELECTED_BACKLOG_ITEMS_TO_SPRINT = "app/add:selected-sprint-backlog-items";
export const MOVE_BACKLOG_ITEM_TO_SPRINT = "app/move:sprint-backlog-item";
export const ADD_BACKLOG_ITEM_TO_SPRINT = "app/add:sprint-backlog-item";
export const PATCH_BACKLOG_ITEM_IN_SPRINT = "app/patch:sprint-backlog-item";

export const SHOW_SPRINT_BACKLOG_ITEM_DETAIL = "app/show:sprint-backlog-item";
export const HIDE_SPRINT_BACKLOG_ITEM_DETAIL = "app/hide:sprint-backlog-item";
export const TOGGLE_SPRINT_ITEM_DETAIL = "app/toggle:sprint";

export const MOVE_SPRINT_ITEM_TO_PRODUCT_BACKLOG_CLICK = "app/move-to-backlog:sprint-backlog-item";
export const SPLIT_SPRINT_BACKLOG_ITEM_CLICK = "app/split:sprint-backlog-item";

export const SPRINT_BACKLOG_ITEM_ID_CLICK = "app/click:sprint-backlog-item-id";

export const SPRINT_BACKLOG_ITEM_DETAIL_CLICK = "app/click:sprint-backlog-item-detail";

export const SPRINT_BACKLOG_ITEM_ACCEPTED_CLICK = "app/status-accepted:sprint-backlog-item";
export const SPRINT_BACKLOG_ITEM_DONE_CLICK = "app/status-done:sprint-backlog-item";
export const SPRINT_BACKLOG_ITEM_IN_PROGRESS_CLICK = "app/status-in-progress:sprint-backlog-item";
export const SPRINT_BACKLOG_ITEM_NOT_STARTED_CLICK = "app/status-not-started:sprint-backlog-item";
export const SPRINT_BACKLOG_ITEM_RELEASED_CLICK = "app/status-released:sprint-backlog-item";

export const ADD_PRODUCT_BACKLOG_ITEM = "app/add:product-backlog-item";
export const REMOVE_PRODUCT_BACKLOG_ITEM = "app/remove:product-backlog-item";
export const REMOVE_SPRINT_BACKLOG_ITEM = "app/remove:sprint-backlog-item";

export const SET_SPRINT_PLANNING_ARCHIVED_FILTER = "app/set-filter:sprint-planning-archived";

export const UPDATE_BACKLOG_ITEM_PART_FIELD = "app/update:backlog-item-part-field";

export const PROJECT_PICKER_OPENED = "app/opened:project-picker";
export const PROJECT_PICKER_CLOSED = "app/closed:project-picker";
export const SWITCH_PROJECT = "app/select:project";

export const SET_CURRENT_PROJECT_ID = "app/set-prefs:current-project-id";
