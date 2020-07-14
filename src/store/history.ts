import { createMemoryHistory, createBrowserHistory } from "history";

type HistoryParams = {
    initialEntries?: any[];
};

export const createClientHistory = ({ initialEntries = [] }: HistoryParams = {}) => {
    const history = window.browserHistory || createBrowserHistory();
    if (process.env.NODE_ENV === "development" && !window.browserHistory) {
        window.browserHistory = history;
    }
    return history;
};

export const createServerHistory = ({ initialEntries = [] }: HistoryParams = {}) => {
    return createMemoryHistory({ initialEntries });
};

export const createElectronClientHistory = ({ initialEntries = [] }: HistoryParams = {}) => {
    return createMemoryHistory({ initialEntries });
};
