import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Portfolio from "./Portfolio";
import ProjectDetail from "./ProjectDetail";
import App from "../App";
import { projects } from "../Data/projectsData";

jest.mock("../Images/Img1.png", () => "/mock-images/Img1.png");
jest.mock("../Images/Img2.png", () => "/mock-images/Img2.png");
jest.mock("../Images/Img3.png", () => "/mock-images/Img3.png");
jest.mock("../Images/Img4.png", () => "/mock-images/Img4.png");

Object.defineProperty(document.body, "scroll", {
  value: jest.fn(),
  writable: true,
});

describe("Portfolio Component", () => {
  test("zobrazí všechny projekty z projectsData", async () => {
    // ARRANGE
    render(
      <MemoryRouter initialEntries={["/portfolio"]}>
        <App />
      </MemoryRouter>
    );

    // ACT & ASSERT
    const expectedProjectNames = projects.map((p) => p.name);

    for (const name of expectedProjectNames) {
      const projectNameElement = await screen.findByRole("heading", {
        name: new RegExp(name, "i"),
      });
      expect(projectNameElement).toBeInTheDocument();
    }

    const expectedProjectAltTexts = projects.map((p) => p.name);
    for (const altText of expectedProjectAltTexts) {
      expect(
        await screen.findByAltText(new RegExp(altText, "i"))
      ).toBeInTheDocument();
    }

    for (const project of projects) {
      const projectLink = await screen.findByRole("link", {
        name: new RegExp(project.name, "i"),
      });
      expect(projectLink).toBeInTheDocument();
      expect(projectLink).toHaveAttribute("href", `/portfolio/${project.id}`);
    }
  });

  test("naviguje na detail projektu po kliknutí na odkaz", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/portfolio"]}>
        <App />
      </MemoryRouter>
    );

    const firstProject = projects[0];

    const projectLink = await screen.findByRole("link", {
      name: new RegExp(firstProject.name, "i"),
    });
    expect(projectLink).toBeInTheDocument();

    await user.click(projectLink);

    const projectDetailTitle = await screen.findByRole("heading", {
      name: new RegExp(firstProject.name, "i"),
    });
    expect(projectDetailTitle).toBeInTheDocument();

    const projectImage = await screen.findByRole("img", {
      name: new RegExp(firstProject.name, "i"),
    });
    expect(projectImage).toBeInTheDocument();

    const descriptionElement = document.querySelector(".project-description");
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement).toHaveTextContent(firstProject.description);

    if (firstProject.technologies && firstProject.technologies.length > 0) {
      for (const tech of firstProject.technologies) {
        expect(
          await screen.findByText(new RegExp(tech, "i"))
        ).toBeInTheDocument();
      }
    }
  });
});
