// libraries
import { themeList } from "../themes/all";

export class ThemeHelper {
    private lastThemeName: string;
    public detectBrowserDarkMode: boolean;
    constructor() {
        this.lastThemeName = null;
        this.detectBrowserDarkMode = false;
    }
    public init() {
        window.addEventListener("load", () => {
            this.themeEngineSetup();
        });
    }
    themeEngineSetup() {
        const themeName = this.getThemeAttribute();
        this.setThemeVars(themeName);
        this.setupNextCheck();
    }
    getThemeAttribute() {
        const prefix = "theme-";
        let result = null;
        let html = document.querySelector("html");
        html.classList.forEach((item) => {
            if (item.indexOf(prefix) === 0) {
                const themeName = item.substr(prefix.length);
                result = themeName;
            }
        });
        if (!result) {
            result = "default";
        }
        return result;
    }
    setThemeVars(themeName) {
        switch (themeName) {
            case "default":
            case "dark": {
                this.addBodyStylesForTheme(themeName);
                break;
            }
            default: {
                break;
            }
        }
    }
    setupNextCheck() {
        setTimeout(() => {
            if (this.detectBrowserDarkMode) {
                this.checkForBrowserDarkMode();
            }
            this.checkForThemeChange();
        }, 500);
    }
    addBodyStylesForTheme(themeName) {
        const bodyStyles = document.body.style;
        const theme = this.getTheme(themeName);
        for (var propName in theme) {
            var propValue = theme[propName];
            bodyStyles.setProperty(propName, propValue);
        }
    }
    checkForBrowserDarkMode() {
        if (matchMedia("(prefers-color-scheme: dark)").matches) {
            this.setThemeAttribute("theme-dark");
        }
        if (matchMedia("(prefers-color-scheme: light)").matches) {
            this.setThemeAttribute("theme-default");
        }
    }
    checkForThemeChange() {
        const themeName = this.getThemeAttribute();
        if (themeName !== this.lastThemeName) {
            this.setThemeVars(themeName);
            this.storeLastThemeName(themeName);
        }
        this.setupNextCheck();
    }
    getTheme(themeName) {
        var items = themeList.filter((item) => item.name === themeName);
        if (items.length) {
            return items[0] && items[0].theme;
        } else {
            return null;
        }
    }
    setThemeAttribute(fullThemeName: string) {
        const prefix = "theme-";
        let result = null;
        let html = document.querySelector("html");
        const themesToRemove = [];
        html.classList.forEach((item) => {
            if (item.indexOf(prefix) === 0) {
                themesToRemove.push(item);
            }
        });
        if (themesToRemove.indexOf(fullThemeName) < 0) {
            html.classList.add(fullThemeName);
        }
        themesToRemove.forEach((theme) => {
            if (theme !== fullThemeName) {
                html.classList.remove(theme);
            }
        });
        return result;
    }
    storeLastThemeName(themeName: string) {
        this.lastThemeName = themeName;
    }
}
