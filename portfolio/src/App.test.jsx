import { render, screen } from "@testing-library/react";
import App from "./App";
import Header from "./Components/Header";
import Navbar from "./Components/Navbar";

Object.defineProperty(document.body, "scroll", {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: jest.fn(),
});

jest.mock("./Components/Header", () => () => <div data-testid="mock-header" />);
jest.mock("./Components/Navbar", () => () => <div data-testid="mock-navbar" />);

import { MemoryRouter } from "react-router-dom";

test("renders Header and Navbar components", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByTestId("mock-header")).toBeInTheDocument();
  expect(screen.getByTestId("mock-navbar")).toBeInTheDocument();
});

test("renders Portfolio page when on /portfolio route", () => {
  render(
    <MemoryRouter initialEntries={["/portfolio"]}>
      <App />
    </MemoryRouter>
  );

  const portfolioTitle = screen.getByText(/project1/i);
  expect(portfolioTitle).toBeInTheDocument();
});
