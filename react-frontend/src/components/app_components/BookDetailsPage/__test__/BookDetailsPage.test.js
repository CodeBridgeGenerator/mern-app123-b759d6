import React from "react";
import { render, screen } from "@testing-library/react";

import BookDetailsPage from "../BookDetailsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders bookDetails page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <BookDetailsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("bookDetails-datatable")).toBeInTheDocument();
    expect(screen.getByRole("bookDetails-add-button")).toBeInTheDocument();
});
