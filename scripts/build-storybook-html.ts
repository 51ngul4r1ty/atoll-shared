import * as fs from "fs";
import * as path from "path";

import { themeList } from "../src/themes/all";

const PLACE_HOLDER = "/* ***INSERT_THEME_LIST_HERE*** */";

const getIndexOfPlaceHolder = (line) => {
    const index = line.indexOf(PLACE_HOLDER);
    if (index >= 0) {
        return index;
    }
    return -1;
};

const hasPlaceholder = (line) => {
    return getIndexOfPlaceHolder(line) >= 0;
};

var inputPath = path.resolve(".storybook/preview-head.template.html");
var outputPath = path.resolve(".storybook/preview-head.html");
var textByLine = fs.readFileSync(inputPath).toString().replace(/\r/g, "").split("\n");
var newLines = [];
textByLine.forEach((line) => {
    if (!hasPlaceholder(line)) {
        newLines.push(line);
    } else {
        const index = getIndexOfPlaceHolder(line);
        const lineStart = line.substr(0, index);
        let outerLineIdx: number = -1;
        themeList.forEach((themeListItem) => {
            if (outerLineIdx > 0) {
                newLines[outerLineIdx] = newLines[outerLineIdx] + ",";
            }
            newLines.push(lineStart + "{");
            newLines.push(lineStart + `    name: "${themeListItem.name}",`);
            newLines.push(lineStart + `    theme: {`);
            let themeLineIdx = newLines.length;
            let firstLine = true;
            for (const propName in themeListItem.theme) {
                if (!firstLine) {
                    newLines[themeLineIdx - 1] = newLines[themeLineIdx - 1] + ",";
                } else {
                    firstLine = false;
                }
                const propValue = themeListItem.theme[propName];
                newLines.push(lineStart + `        "${propName}": "${propValue}"`);
                themeLineIdx++;
            }
            newLines.push(lineStart + `    }`);
            newLines.push(lineStart + "}");
            outerLineIdx = newLines.length - 1;
        });
    }
});

const allText = newLines.join("\r\n");

fs.writeFile(outputPath, allText, (err) => {
    if (err) {
        console.error(`${err} occured writing preview-head.html`);
    }
});
