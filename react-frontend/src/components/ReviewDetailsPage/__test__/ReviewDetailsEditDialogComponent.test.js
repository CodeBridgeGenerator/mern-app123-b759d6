import React from "react";
import { render, screen } from "@testing-library/react";

import ReviewDetailsEditDialogComponent from "../ReviewDetailsEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders reviewDetails edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ReviewDetailsEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("reviewDetails-edit-dialog-component")).toBeInTheDocument();
});
