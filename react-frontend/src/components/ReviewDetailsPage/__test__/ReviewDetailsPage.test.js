import React from "react";
import { render, screen } from "@testing-library/react";

import ReviewDetailsPage from "../ReviewDetailsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders reviewDetails page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ReviewDetailsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("reviewDetails-datatable")).toBeInTheDocument();
    expect(screen.getByRole("reviewDetails-add-button")).toBeInTheDocument();
});
