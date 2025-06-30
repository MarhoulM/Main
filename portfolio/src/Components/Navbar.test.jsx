import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";
import { BrowserRouter, MemoryRouter, useNavigate } from "react-router-dom";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

test('Kliknutí na tlačítko "Portfolio" správně přesměruje na /portfolio', () => {
  render(
    <BrowserRouter>
      <Navbar onHoverChange={() => {}} theme="light" toggleTheme={() => {}} />
    </BrowserRouter>
  );

  const portfolioButton = screen.getByText("Portfolio");

  fireEvent.click(portfolioButton);

  expect(mockedUsedNavigate).toHaveBeenCalledWith("/portfolio");
});

test('Kliknutí na tlačítko "O mě" správně přesměruje na /about', () => {
  render(
    <BrowserRouter>
      <Navbar onHoverChange={() => {}} theme="light" toggleTheme={() => {}} />
    </BrowserRouter>
  );

  const aboutButton = screen.getByText("O mě");

  fireEvent.click(aboutButton);

  expect(mockedUsedNavigate).toHaveBeenCalledWith("/about");
});

test('Kliknutí na tlačítko "Kontakt" správně přesměruje na /contact', () => {
  render(
    <BrowserRouter>
      <Navbar onHoverChange={() => {}} theme="light" toggleTheme={() => {}} />
    </BrowserRouter>
  );

  const contactButton = screen.getByText("Kontakt");

  fireEvent.click(contactButton);

  expect(mockedUsedNavigate).toHaveBeenCalledWith("/contact");
});

test('Kliknutí na tlačítko "Certifikáty" správně přesměruje na /certs', () => {
  render(
    <BrowserRouter>
      <Navbar onHoverChange={() => {}} theme="light" toggleTheme={() => {}} />
    </BrowserRouter>
  );

  const certsButton = screen.getByText("Certifikáty");

  fireEvent.click(certsButton);

  expect(mockedUsedNavigate).toHaveBeenCalledWith("/certs");
});

test('Kliknutí na tlačítko "Ke stažení" správně přesměruje na /downloads', () => {
  render(
    <BrowserRouter>
      <Navbar onHoverChange={() => {}} theme="light" toggleTheme={() => {}} />
    </BrowserRouter>
  );

  const downloadsButton = screen.getByText("Ke stažení");

  fireEvent.click(downloadsButton);

  expect(mockedUsedNavigate).toHaveBeenCalledWith("/downloads");
});

test("Navbar se vykreslí a obsahuje texty buttonů viz buttonTexts", () => {
  render(
    <BrowserRouter>
      <Navbar onHoverChange={() => {}} theme="light" toggleTheme={() => {}} />
    </BrowserRouter>
  );
  const buttonTexts = [
    "Portfolio",
    "O mě",
    "Kontakt",
    "Certifikáty",
    "Ke stažení",
  ];

  buttonTexts.forEach((text) => {
    const buttonElement = screen.getByText(text);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.tagName).toBe("BUTTON");
  });
});
