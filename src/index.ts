export { App } from "./App";
export { HamburgerIcon } from "./components/images/HamburgerIcon";
export { HomeButton } from "./components/buttons/HomeButton";
export { SimpleButton } from "./components/buttons/SimpleButton";
export { SimpleText } from "./components/text/SimpleText";
export { TabStrip } from "./components/tabs/TabStrip";

// containers
export { configureStore } from "./store";
// export { default as IntlProvider } from "./i18n/IntlProvider";
import { MainLayout } from "./layouts/MainLayout";
export { createClientHistory, createServerHistory } from "./store/history";

// themes
export { themeList } from "./themes/all";

export const layouts = {
    MainLayout
};
