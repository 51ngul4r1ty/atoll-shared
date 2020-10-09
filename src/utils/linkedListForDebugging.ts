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
                const linkToLastCurrId = curr.prevId || null;
                const lastCurrId = lastCurr?.id || null;
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
}
