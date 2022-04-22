/**
 * Purpose: abstract standard browser functionality mainly for easier testing, but
 *   also to provide more targeted functions rather than working with full objects
 *   like "window.location" etc.
 */

export const getBrowserQueryString = () => typeof window !== "undefined" && window.location.search;

export const getBrowserHostName = () => typeof window !== "undefined" && window.location.hostname;
