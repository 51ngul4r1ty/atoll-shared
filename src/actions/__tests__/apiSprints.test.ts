// test related
import "jest";

// interfaces/types
import type { ApiGetSprintOptions, ApiGetSprintSuccessActionMetaPassthrough } from "../apiSprints";

// code under test
import * as apiSprints from "../apiSprints";

describe("Sprints REST API Action Creators", () => {
    describe("apiGetSprint", () => {
        it("should build the expected action object", () => {
            // arrange
            const sprintId = "fake-id";
            const passthroughData: ApiGetSprintSuccessActionMetaPassthrough = {
                sprintId: "passthrough-fake-id",
                backlogItemId: "passthrough-fake-backlog-item-id",
                triggerAction: "passthrough-fake-trigger-action",
                stepName: "passthrough-fake-step-name"
            };
            const endpointOverride = "https://fake-override.test/fake-path";
            const options: ApiGetSprintOptions = {
                passthroughData,
                endpointOverride
            };

            // act
            const actual = apiSprints.apiGetSprint(sprintId, options);

            // assert
            const type = "API";
            const payload = {
                endpoint: "https://fake-override.test/fake-path",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                method: "GET",
                types: ["app/api:get-sprint:request", "app/api:get-sprint:success", "app/api:get-sprint:failure"]
            };
            const meta = {
                actionParams: {
                    options: {
                        endpointOverride: "https://fake-override.test/fake-path"
                    },
                    sprintId: "fake-id"
                },
                passthrough: {
                    backlogItemId: "passthrough-fake-backlog-item-id",
                    sprintId: "passthrough-fake-id",
                    stepName: "passthrough-fake-step-name",
                    triggerAction: "passthrough-fake-trigger-action"
                }
            };
            expect(actual).toStrictEqual({
                meta,
                payload,
                type
            });
        });
    });
});
