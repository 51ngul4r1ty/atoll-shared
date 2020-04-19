// test related
import "jest";

// code under test
import { parsePostgresUrl } from "../config";

describe("Config", () => {
    describe("parsePostgresUrl", () => {
        it("should handle standard postgresql url", () => {
            const result = parsePostgresUrl("postgres://FAKE_USERNAME:FAKE_PASSWORD@FAKE_HOST_NAME:FAKE_PORT/FAKE_DATABASE_NAME");
            expect(result.username).toEqual("FAKE_USERNAME");
            expect(result.password).toEqual("FAKE_PASSWORD");
            expect(result.host).toEqual("FAKE_HOST_NAME");
            expect(result.port).toEqual("FAKE_PORT");
            expect(result.database).toEqual("FAKE_DATABASE_NAME");
        });
    });
});
