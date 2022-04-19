import { LinkedList, NodeLinkInfo } from "./linkedList";

export class LinkedListForDebugging<T> extends LinkedList<T> {
    getMainLinkDiagString(): string {
        return this.getLinkDiagString(this.getFirstItemNodeInfo());
    }
    private fourDigitLinkId(id: string): string {
        if (!id) {
            return `null`;
        } else {
            return id.substr(id.length - 4);
        }
    }
    getLinkDiagString(item: NodeLinkInfo<T>, itemToHighlight?: NodeLinkInfo<T>): string {
        let curr = item;
        let lastCurr: NodeLinkInfo<T> = null;
        let result = "";
        while (curr) {
            if (this.isFirstItem(curr.id)) {
                result += " [ ";
            }
            const hightlightThisItem = itemToHighlight?.id === curr.id;
            if (hightlightThisItem) {
                result += "▸ ";
            }
            result += this.fourDigitLinkId(curr.id);
            if (hightlightThisItem) {
                result += "◂ ";
            }
            if (this.isLastItem(curr.id)) {
                result += " ] ";
            }
            if (curr.nextId) {
                const linkToLastCurrId = curr.prevId ?? null;
                const lastCurrId = lastCurr?.id ?? null;
                const linkBackGood = linkToLastCurrId === lastCurrId;
                const linkBackBad = !linkBackGood && linkToLastCurrId !== null;
                if (linkBackGood) {
                    result += " <--> ";
                } else if (linkBackBad) {
                    result += " *--> ";
                } else {
                    result += " ---> ";
                }
            }
            lastCurr = curr;
            curr = this.nodeInfo[curr.nextId];
        }
        return result;
    }
    getDiagnosticString(): string {
        return `main: ${this.getMainLinkDiagString()};\norphans: ${this.getOrphanDiagString()}\n`;
    }
    getOrphanLinkedListItemStart(orphanItem: NodeLinkInfo<T>): NodeLinkInfo<T> {
        let curr = orphanItem;
        while (!!curr.prevId) {
            curr = this.getItemNodeInfo(curr.prevId);
        }
        return curr;
    }
    getOrphanDiagString(): string {
        let curr = this.getFirstItemNodeInfo();
        let result = "";
        let linkedInItems: { [key: string]: NodeLinkInfo<T> } = {};
        let lastItem = this.getLastItemNodeInfo();
        let busy = !!curr;
        while (busy) {
            linkedInItems[curr.id] = curr;
            if (curr.id === lastItem.id) {
                busy = false;
            } else {
                curr = this.nodeInfo[curr.nextId];
                busy = !!curr;
            }
        }
        let allItemKeys = Object.keys(this.nodeInfo);
        let orphanDiagStrings: { [key: string]: NodeLinkInfo<T> } = {};
        let orphanIds: string[] = [];
        allItemKeys.forEach((key) => {
            if (!linkedInItems[key]) {
                const orphanItem = this.nodeInfo[key];
                orphanIds.push(orphanItem.id);
                const firstItemInOrphanLinkChain = this.getOrphanLinkedListItemStart(orphanItem);
                const orphanDiagString = this.getLinkDiagString(firstItemInOrphanLinkChain);
                orphanDiagStrings[orphanDiagString] = orphanItem;
            }
        });
        const orphanDiagStringKeys = Object.keys(orphanDiagStrings);
        orphanDiagStringKeys.forEach((key) => {
            if (result) {
                result += "; ";
            }
            result += key;
        });
        return result;
    }
}
