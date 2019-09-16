export { App } from "./App";
export { HamburgerIcon } from "./components/images/HamburgerIcon";
export { HomeButton } from "./components/buttons/HomeButton";
export { SimpleButton } from "./components/buttons/SimpleButton";
export { SimpleText } from "./components/text/SimpleText";
export { TabStrip } from "./components/tabs/TabStrip";

// containers
export { default as AppContainer } from "./AppContainer";
export { configureStore } from "./store";
// TODO: Get rid of IntlProvider- giving me too many problems!!!!
// export { default as IntlProvider } from "./i18n/IntlProvider";
import { MainLayout } from "./layouts/MainLayout";
export { default as createHistory } from "./store/history";

export const layouts = {
    MainLayout
};
