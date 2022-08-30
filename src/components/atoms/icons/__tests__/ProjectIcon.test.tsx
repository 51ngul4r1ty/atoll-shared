// externals
import * as React from "react";

// test related
import "jest";
import { render } from "@testing-library/react";

// code under test
import { ProjectIcon } from "../ProjectIcon";

describe("Project Icon", () => {
    describe("ProjectIcon", () => {
        it("should render icon with expected contents", () => {
            // arrange
            // (none)

            // act
            const actual = render(<ProjectIcon />);

            // assert
            const icon = actual.container.querySelector("svg") as SVGElement;
            expect(icon.children).toHaveLength(1);
        });
    });
});
