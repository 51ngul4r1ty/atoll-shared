// test related
import "jest";

// code under test
import { parsePostgresUrl } from "../config";

describe("Config", () => {
    describe("parsePostgresUrl", () => {
        it("should handle standard postgresql url", () => {
            // arrange
            const url = "postgres://FAKE_USERNAME:FAKE_PASSWORD@FAKE_HOST_NAME:FAKE_PORT/FAKE_DATABASE_NAME";

            // act
            const actual = parsePostgresUrl(url);

            // assert
            expect(actual.username).toEqual("FAKE_USERNAME");
            expect(actual.password).toEqual("FAKE_PASSWORD");
            expect(actual.host).toEqual("FAKE_HOST_NAME");
            expect(actual.port).toEqual("FAKE_PORT");
            expect(actual.database).toEqual("FAKE_DATABASE_NAME");
        });
    });
});
