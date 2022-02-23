// interfaces/types
import type { StoryPhrases } from "../../../types/storyTypes";

// e.g. As a user, I can edit a text input in the middle, without the cursor going to the end
export const STORY_REGEX = RegExp(/as (an?) (.*), I ([a-z]*) ([^,]*)(, .*)?/i);

export const getStoryPhrases = (text: string): StoryPhrases => {
    const captureGroups = text.match(STORY_REGEX);
    if (!captureGroups) {
        return null;
    } else {
        const aOrAnCaptureGroup = captureGroups[1];
        const roleCaptureGroup = captureGroups[2];
        const storyAdverbCaptureGroup = captureGroups[3];
        const storyActionPhraseCaptureGroup = captureGroups[4];
        const rawReasonPhrase = captureGroups.length > 4 ? captureGroups[5] : null;
        const reasonPhrase = rawReasonPhrase?.length > 2 ? rawReasonPhrase.substr(2).trim() : null;
        const asText = text.substr(0, 2);
        const rolePhrase = `${asText} ${aOrAnCaptureGroup} ${roleCaptureGroup}`;
        const storyPhrase = `I ${storyAdverbCaptureGroup} ${storyActionPhraseCaptureGroup}`;
        return {
            rolePhrase,
            storyPhrase,
            reasonPhrase
        };
    }
};

export const isStoryPaste = (text: string) => {
    const storyPhrases = getStoryPhrases(text);
    return !!storyPhrases;
};
