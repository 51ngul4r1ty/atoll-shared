/**
 * Purpose: To process HATEOAS links sent in the API responses.
 */

// externals
import urlParse from "url-parse";

// interfaces/types
import type { Link } from "../types/apiModelTypes";
import { ApiActionMetaDataRequestBody } from "../middleware/apiTypes";

export const LINK_REL_SELF = "self";
export const LINK_REL_NEXT = "next-item";

export const getLinkByRel = (links: Link[], rel: string): Link | null => {
    if (!links) {
        throw new Error(`Unexpected condition: there were no links provided to getLinkByRel for rel="${rel}"`);
    }
    const matchingLinks = links.filter((link) => link.rel === rel);
    const matchlingLinkCount = matchingLinks.length;
    switch (matchlingLinkCount) {
        case 0: {
            return null;
        }
        case 1: {
            return matchingLinks[0];
        }
        default: {
            throw new Error(
                `Unexpected condition: ${matchlingLinkCount} links matched the` +
                    ` provided rel ${rel}, but there should be no more than one!`
            );
        }
    }
};

export const buildUri = (requestUrl: string, linkUri: string): string => {
    if (!linkUri.startsWith("/")) {
        throw new Error(`Unable to handle link URI "${linkUri}" returned by "${requestUrl}"`);
    }
    const parsed = urlParse(requestUrl);
    const usePort = !!parsed.port && `${parsed.port}` !== "80" && `${parsed.port}` !== "443";
    const hostAndPort = usePort ? `${parsed.hostname}:${parsed.port}` : parsed.hostname;
    return `${parsed.protocol}//${hostAndPort}${linkUri}`;
};

export const buildFullUri = (requestBody: ApiActionMetaDataRequestBody<any>, uri: string): string => {
    return buildUri(requestBody.url, uri);
};
