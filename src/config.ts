let historyInstance: any;

export const storeHistoryInstance = (history: any) => {
    historyInstance = history;
};

export const getHistoryInstance = () => {
    return historyInstance;
};
