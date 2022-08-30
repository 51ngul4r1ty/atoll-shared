// externals
import * as React from "react";

// test related
import "jest";
import { render } from "@testing-library/react";

// code under test
import { SimpleButton } from "../SimpleButton";

const mockIcon = <div>Not an Icon</div>;
const mockOnClick = jest.fn();

describe("SimpleButton", () => {
    it("should contain the button caption", () => {
        // arrange
        // (none)

        // act
        const wrapper = render(<SimpleButton onClick={() => mockOnClick()}>Button Caption</SimpleButton>);

        // assert
        const button = wrapper.getByText("Button Caption");
        expect(button).toBeDefined();
    });
    it("should not contain the button caption", () => {
        // arrange
        // (none)

        // act
        const wrapper = render(<SimpleButton onClick={() => mockOnClick()} />);

        // assert
        const button = wrapper.queryByText("Button Caption");
        expect(button).toBeNull();
    });
    it("should contain the icon on the right", () => {
        // arrange
        // (none)

        // act
        const wrapper = render(
            <SimpleButton icon={mockIcon} onClick={() => mockOnClick()}>
                Button Caption
            </SimpleButton>
        );

        // assert
        const button = wrapper.getByText("Not an Icon");
        expect(button).toBeDefined();
        const buttonContainer = wrapper.getByTestId("button-container");
        const shouldBeCaption = buttonContainer.firstElementChild;
        expect(shouldBeCaption.textContent).toContain("Button Caption");
        const shouldBeIcon = shouldBeCaption.nextElementSibling;
        expect(shouldBeIcon.textContent).not.toContain("Button Caption");
    });
    it("should contain the icon on the left", () => {
        // arrange
        // (none)

        // act
        const wrapper = render(
            <SimpleButton iconOnLeft icon={mockIcon} onClick={() => mockOnClick()}>
                Button Caption
            </SimpleButton>
        );

        // assert
        const button = wrapper.getByText("Not an Icon");
        expect(button).toBeDefined();
        const buttonContainer = wrapper.getByTestId("button-container");
        const shouldBeIcon = buttonContainer.firstElementChild;
        expect(shouldBeIcon.textContent).not.toContain("Button Caption");
        const shouldBeCaption = shouldBeIcon.nextElementSibling;
        expect(shouldBeCaption.textContent).toContain("Button Caption");
    });
});
