import React from "react";
import { render, screen } from "@testing-library/react";

import SaleDetailsPage from "../SaleDetailsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders saleDetails page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <SaleDetailsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("saleDetails-datatable")).toBeInTheDocument();
    expect(screen.getByRole("saleDetails-add-button")).toBeInTheDocument();
});
