import React from "react";
import { render, screen } from "@testing-library/react";

import ReviewDetailsCreateDialogComponent from "../ReviewDetailsCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders reviewDetails create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ReviewDetailsCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("reviewDetails-create-dialog-component")).toBeInTheDocument();
});
