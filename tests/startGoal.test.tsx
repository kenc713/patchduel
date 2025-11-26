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
    // ensure gradient style is applied via inline background (HSL)
    const sBg = start.getAttribute("data-bg") || "";
    const gBg = goal.getAttribute("data-bg") || "";
    expect(sBg).toContain("hsl(");
    expect(gBg).toContain("hsl(");
    // indexes should differ
    const sIndex = start.getAttribute("data-index");
    const gIndex = goal.getAttribute("data-index");
    expect(sIndex).not.toBeNull();
    expect(gIndex).not.toBeNull();
    expect(sIndex).not.toEqual(gIndex);

    // Parse HSL and assert lightness contrast is noticeable (>= 20)
    const parseHsl = (s: string) => {
      const m = s.match(/hsl\(\s*(\d+)\s+(\d+)%\s+(\d+)%\s*\)/);
      if (!m) return null;
      return { h: Number(m[1]), s: Number(m[2]), l: Number(m[3]) };
    };

    const sHsl = parseHsl(sBg)!;
    const gHsl = parseHsl(gBg)!;
    expect(sHsl).toBeTruthy();
    expect(gHsl).toBeTruthy();
    const lightnessDiff = Math.abs(sHsl.l - gHsl.l);
    expect(lightnessDiff).toBeGreaterThanOrEqual(20);
  });
});
