import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Board from "../src/components/Board";
import "../src/styles.css";

describe("Board start/goal visuals", () => {
  it("marks start cell (0,0) and goal cell (3,4)", () => {
    const { container } = render(<Board />);

    const start = screen.getByTestId("cell-0-0");
    expect(start).toBeTruthy();
    expect(start).toHaveClass("start");

    const goal = screen.getByTestId("cell-3-4");
    expect(goal).toBeTruthy();
    expect(goal).toHaveClass("goal");
  });
});
