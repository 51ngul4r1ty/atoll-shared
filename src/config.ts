import urlParse from "url-parse";

let historyInstance: any;

export const storeHistoryInstance = (history: any) => {
    historyInstance = history;
};

export const getHistoryInstance = () => {
    return historyInstance;
};

let configCallbacks: ConfigCallbacks = {
    getDocumentLocHref: () => ""
};

export interface ConfigCallbacks {
    getDocumentLocHref: { (): string };
}

export const initConfig = (configCallbacksObj: ConfigCallbacks) => {
    configCallbacks = configCallbacksObj;
};

export const protocolToScheme = (protocol: string) => {
    return protocol.substr(0, protocol.length - 1);
};

export const getApiScheme = () => {
    const appUrl = configCallbacks.getDocumentLocHref();
    const parsed = urlParse(appUrl);
    return protocolToScheme(parsed.protocol);
};

export const getApiHostName = () => {
    const appUrl = configCallbacks.getDocumentLocHref();
    const parsed = urlParse(appUrl);
    return parsed.hostname;
};

export const getApiPort = () => {
    const appUrl = configCallbacks.getDocumentLocHref();
    const parsed = urlParse(appUrl);
    return parsed.port;
};

export const getApiBaseUrl = () => {
    return `${getApiScheme()}://${getApiHostName()}:${getApiPort()}/`;
};

export const combineBaseAndRelativeUrl = (protocolHostAndPort: string, path: string) => {
    const pathToAppend = path.startsWith("/") ? path.substr(1) : path;
    return protocolHostAndPort.endsWith("/") ? `${protocolHostAndPort}${pathToAppend}` : `${protocolHostAndPort}${pathToAppend}`;
};

export const remapAssetPath = (url: string) => {
    if (!url) {
        return url;
    }
    const parsedAssetUrl = urlParse(url);
    const baseUrl = `${protocolToScheme(parsedAssetUrl.protocol)}://${getApiHostName()}:${parsedAssetUrl.port}/`;
    const result = combineBaseAndRelativeUrl(baseUrl, parsedAssetUrl.pathname);
    return result;
};
