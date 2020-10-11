// test related
import "jest";

// code under test
import { getStoryPhrases } from "../pasteFormatUtils";

describe("pastFormatUtils", () => {
    describe("getStoryPhrases", () => {
        it("should handle a typical 3-part user story", () => {
            const result = getStoryPhrases("As a user, I can edit a text input in the middle, without the cursor going to the end");
            expect(result.rolePhrase).toEqual("As a user");
            expect(result.storyPhrase).toEqual("I can edit a text input in the middle");
            expect(result.reasonPhrase).toEqual("without the cursor going to the end");
        });
        it("should handle a typical 2-part user story", () => {
            const result = getStoryPhrases("As a user, I can edit a text input in the middle");
            expect(result.rolePhrase).toEqual("As a user");
            expect(result.storyPhrase).toEqual("I can edit a text input in the middle");
            expect(result.reasonPhrase).toBeNull();
        });
        it("should not treat a role phrase as a story", () => {
            const result = getStoryPhrases("As a user");
            expect(result).toBeNull();
        });
        it("should not treat a story phrase as a story", () => {
            const result = getStoryPhrases("I can edit a text input in the middle");
            expect(result).toBeNull();
        });
        it("should not treat a reason phrase as a story", () => {
            const result = getStoryPhrases("without the cursor going to the end");
            expect(result).toBeNull();
        });
        it("should not treat a story without punctuation as a story", () => {
            // NOTE: This is done to ensure that a more deliberate partitioning of the story is provided, so that the algorithm
            //       isn't too smart for its own good.
            const result = getStoryPhrases("As a user I can edit a text input in the middle without the cursor going to the end");
            expect(result).toBeNull();
        });
    });
});
