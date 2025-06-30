/*import { render, screen, act, waitFor } from "@testing-library/react";
import DynamicImg from "./DynamicImg";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

const mockImageMap = {
  "/portfolio": "/mock-images/portfolioo.png",
  "/about": "/mock-images/about.png",
  "/contact": "/mock-images/contact.png",
  "/certs": "/mock-images/certificate.png",
  "/downloads": "/mock-images/download.png",
};

jest.mock("../Images/portfolioo.png", () => "/mock-images/portfolioo.png");
jest.mock("../Images/about.png", () => "/mock-images/about.png");
jest.mock("../Images/contact.png", () => "/mock-images/contact.png");
jest.mock("../Images/certificate.png", () => "/mock-images/certificate.png");
jest.mock("../Images/download.png", () => "/mock-images/download.png");

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("DynamicImg", () => {
  test('zobrazí obrázek "/mock-images/about.png" po načtení a animaci, když je cesta /about a hover není aktivní', async () => {
    // ARRANGE
    const { debug } = render(
      <MemoryRouter initialEntries={["/about"]}>
        <DynamicImg hoveredPath={null} />
      </MemoryRouter>
    );

    // ACT
    let imgElement = screen.getByRole("img");
    expect(imgElement).toHaveAttribute(
      "src",
      "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
    );

    await waitFor(() => {
      expect(imgElement).toHaveStyle("opacity: 0");
    });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // ASSERT
    imgElement = screen.getByRole("img");

    debug();

    expect(imgElement).toHaveAttribute("src", "/mock-images/about.png");
    expect(imgElement).toHaveAttribute("alt", "/mock-images/about.png");

    await waitFor(() => {
      expect(imgElement).toHaveStyle("opacity: 1");
    });
  });
});*/
