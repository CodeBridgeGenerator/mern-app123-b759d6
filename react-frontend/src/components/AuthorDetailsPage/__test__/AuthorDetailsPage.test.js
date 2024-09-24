import React from "react";
import { render, screen } from "@testing-library/react";

import AuthorDetailsPage from "../AuthorDetailsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders authorDetails page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <AuthorDetailsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("authorDetails-datatable")).toBeInTheDocument();
    expect(screen.getByRole("authorDetails-add-button")).toBeInTheDocument();
});
