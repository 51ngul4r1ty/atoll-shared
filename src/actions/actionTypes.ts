import { buildActionName } from "./utils/apiActionUtils";
import * as Names from "./apiActionNames";

export const INIT_APP = "app/init";
export const APP_CLICK = "app/click";
export const APP_KEYUP = "app/keyup";

export const LOCAL_STORE_REFRESH_TOKEN = "app/local-store:refresh-token";

export const SET_LOCALE = "app/set-locale";
export const SET_EDIT_MODE = "app/set-edit-mode";

export const ERROR_PANEL_CLICK = "app/error-panel:click";

// #region User Prefs Resource
export const API_GET_USER_PREFS_REQUEST = buildActionName(Names.GET_USER_PREFS, "request");
export const API_GET_USER_PREFS_SUCCESS = buildActionName(Names.GET_USER_PREFS, "success");
export const API_GET_USER_PREFS_FAILURE = buildActionName(Names.GET_USER_PREFS, "failure");
// #endregion

// #region Backlog Items Resource Collection
export const API_GET_BACKLOG_ITEMS_REQUEST = buildActionName(Names.GET_BACKLOG_ITEMS, "request");
export const API_GET_BACKLOG_ITEMS_SUCCESS = buildActionName(Names.GET_BACKLOG_ITEMS, "success");
export const API_GET_BACKLOG_ITEMS_FAILURE = buildActionName(Names.GET_BACKLOG_ITEMS, "failure");
// #endregion

// #region BFF
export const API_GET_BFF_VIEWS_PLAN_REQUEST = buildActionName(Names.GET_BFF_VIEWS_PLAN, "request");
export const API_GET_BFF_VIEWS_PLAN_SUCCESS = buildActionName(Names.GET_BFF_VIEWS_PLAN, "success");
export const API_GET_BFF_VIEWS_PLAN_FAILURE = buildActionName(Names.GET_BFF_VIEWS_PLAN, "failure");
//#endregion

// #region Backlog Item Resource
export const API_GET_BACKLOG_ITEM_REQUEST = buildActionName(Names.GET_BACKLOG_ITEM, "request");
export const API_GET_BACKLOG_ITEM_SUCCESS = buildActionName(Names.GET_BACKLOG_ITEM, "success");
export const API_GET_BACKLOG_ITEM_FAILURE = buildActionName(Names.GET_BACKLOG_ITEM, "failure");

export const API_POST_BACKLOG_ITEM_REQUEST = buildActionName(Names.POST_BACKLOG_ITEM, "request");
export const API_POST_BACKLOG_ITEM_SUCCESS = buildActionName(Names.POST_BACKLOG_ITEM, "success");
export const API_POST_BACKLOG_ITEM_FAILURE = buildActionName(Names.POST_BACKLOG_ITEM, "failure");

export const API_PUT_BACKLOG_ITEM_REQUEST = buildActionName(Names.PUT_BACKLOG_ITEM, "request");
export const API_PUT_BACKLOG_ITEM_SUCCESS = buildActionName(Names.PUT_BACKLOG_ITEM, "success");
export const API_PUT_BACKLOG_ITEM_FAILURE = buildActionName(Names.PUT_BACKLOG_ITEM, "failure");

export const API_DELETE_BACKLOG_ITEM_REQUEST = buildActionName(Names.DELETE_BACKLOG_ITEM, "request");
export const API_DELETE_BACKLOG_ITEM_SUCCESS = buildActionName(Names.DELETE_BACKLOG_ITEM, "success");
export const API_DELETE_BACKLOG_ITEM_FAILURE = buildActionName(Names.DELETE_BACKLOG_ITEM, "failure");
// #endregion

// #region Backlog Item Ranks Resource Collection
export const API_GET_BACKLOG_ITEM_RANKS_REQUEST = buildActionName(Names.GET_BACKLOG_ITEM_RANKS, "request");
export const API_GET_BACKLOG_ITEM_RANKS_SUCCESS = buildActionName(Names.GET_BACKLOG_ITEM_RANKS, "success");
export const API_GET_BACKLOG_ITEM_RANKS_FAILURE = buildActionName(Names.GET_BACKLOG_ITEM_RANKS, "failure");
// #endregion

// #region Sprint Resource Collection
export const API_GET_SPRINTS_REQUEST = buildActionName(Names.GET_SPRINTS, "request");
export const API_GET_SPRINTS_SUCCESS = buildActionName(Names.GET_SPRINTS, "success");
export const API_GET_SPRINTS_FAILURE = buildActionName(Names.GET_SPRINTS, "failure");
// #endregion

// #region Sprint Backlog Resource
export const API_GET_SPRINT_BACKLOG_ITEMS_REQUEST = buildActionName(Names.GET_SPRINT_BACKLOG_ITEMS, "request");
export const API_GET_SPRINT_BACKLOG_ITEMS_SUCCESS = buildActionName(Names.GET_SPRINT_BACKLOG_ITEMS, "success");
export const API_GET_SPRINT_BACKLOG_ITEMS_FAILURE = buildActionName(Names.GET_SPRINT_BACKLOG_ITEMS, "failure");
// #endregion

// #region Sprint Backlog Resource
export const API_POST_SPRINT_BACKLOG_ITEM_REQUEST = buildActionName(Names.POST_SPRINT_BACKLOG_ITEM, "request");
export const API_POST_SPRINT_BACKLOG_ITEM_SUCCESS = buildActionName(Names.POST_SPRINT_BACKLOG_ITEM, "success");
export const API_POST_SPRINT_BACKLOG_ITEM_FAILURE = buildActionName(Names.POST_SPRINT_BACKLOG_ITEM, "failure");
// #endregion

// #region Post Actions
export const API_POST_ACTION_REORDER_BACKLOG_ITEM_REQUEST = buildActionName(Names.POST_ACTION_REORDER_BACKLOG_ITEM, "request");
export const API_POST_ACTION_REORDER_BACKLOG_ITEM_SUCCESS = buildActionName(Names.POST_ACTION_REORDER_BACKLOG_ITEM, "success");
export const API_POST_ACTION_REORDER_BACKLOG_ITEM_FAILURE = buildActionName(Names.POST_ACTION_REORDER_BACKLOG_ITEM, "failure");

export const API_POST_ACTION_LOGIN_REQUEST = buildActionName(Names.POST_ACTION_LOGIN, "request");
export const API_POST_ACTION_LOGIN_SUCCESS = buildActionName(Names.POST_ACTION_LOGIN, "success");
export const API_POST_ACTION_LOGIN_FAILURE = buildActionName(Names.POST_ACTION_LOGIN, "failure");

export const API_POST_ACTION_RETRY_TOKEN_REQUEST = buildActionName(Names.POST_ACTION_REFRESH_TOKEN, "request");
export const API_POST_ACTION_RETRY_TOKEN_SUCCESS = buildActionName(Names.POST_ACTION_REFRESH_TOKEN, "success");
export const API_POST_ACTION_RETRY_TOKEN_FAILURE = buildActionName(Names.POST_ACTION_REFRESH_TOKEN, "failure");
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

export const ADD_BACKLOG_ITEM = "app/add:backlog-item";
export const SAVE_NEW_BACKLOG_ITEM = "app/save:backlog-item";
export const UPDATE_BACKLOG_ITEM = "app/update:backlog-item";
export const CANCEL_UNSAVED_BACKLOG_ITEM = "app/cancel-unsaved:backlog-item";
export const CANCEL_EDIT_BACKLOG_ITEM = "app/cancel-edit:backlog-item";

export const UPDATE_BACKLOG_ITEM_FIELDS = "app/update:user-story-fields";

export const RECEIVE_WEBSOCKET_MESSAGE = "app/ws:receive-message";

export const RECEIVE_PUSHED_BACKLOG_ITEM = "app/receive:pushed-backlog-item";

export const REORDER_BACKLOG_ITEM = "app/reorder:backlog-item";

export const TOGGLE_BACKLOG_ITEM_DETAIL = "app/toggle:backlog-item-detail";
export const EDIT_BACKLOG_ITEM = "app/edit:backlog-item";

export const SELECT_PRODUCT_BACKLOG_ITEM = "app/select:product-backlog-item";
export const UNSELECT_PRODUCT_BACKLOG_ITEM = "app/unselect:product-backlog-item";

export const SET_USERNAME = "app/user:set-username";
export const SET_PASSWORD = "app/user:set-password";

export const LOGIN_USER = "app/user:login-user";

export const EXPAND_SPRINT_PANEL = "app/expand:sprint-panel";
export const COLLAPSE_SPRINT_PANEL = "app/collapse:sprint-panel";

export const ADD_SPRINT = "app/add:sprint";

export const MOVE_SELECTED_BACKLOG_ITEMS_TO_SPRINT = "app/add:selected-sprint-backlog-items";
export const MOVE_BACKLOG_ITEM_TO_SPRINT = "app/add:sprint-backlog-item";

export const TOGGLE_SPRINT_BACKLOG_ITEM_DETAIL = "app/toggle:sprint-backlog-item";

export const MOVE_SPRINT_BACKLOG_ITEM_TO_BACKLOG = "app/move-to-backlog:sprint-backlog-item";
