import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Board from "../src/components/Board";
import { GOAL_INDEX } from "../src/utils/trackUtils";

// Verify that color gradient near the goal changes noticeably
describe("Board gradient near goal", () => {
  it("has a noticeable lightness difference between goal and previous cell", () => {
    const { container } = render(<Board />);

    // find goal cell by scanning data-index
    const cells = container.querySelectorAll("[data-index]");
    let goalEl: HTMLElement | null = null;
    let prevEl: HTMLElement | null = null;
    cells.forEach((c) => {
      const idx = Number(c.getAttribute("data-index"));
      if (idx === GOAL_INDEX) goalEl = c as HTMLElement;
      if (idx === GOAL_INDEX - 1) prevEl = c as HTMLElement;
    });

    expect(goalEl).toBeTruthy();
    expect(prevEl).toBeTruthy();

    const g = goalEl!.getAttribute("data-bg") || "";
    const p = prevEl!.getAttribute("data-bg") || "";

    const parseHsl = (s: string) => {
      const m = s.match(/hsl\(\s*(\d+)\s+(\d+)%\s+(\d+)%\s*\)/);
      if (!m) return null;
      return { h: Number(m[1]), s: Number(m[2]), l: Number(m[3]) };
    };

    const gh = parseHsl(g)!;
    const ph = parseHsl(p)!;
    expect(gh).toBeTruthy();
    expect(ph).toBeTruthy();

    const lightDiff = Math.abs(gh.l - ph.l);
    // require a modest lightness jump between last two cells
    expect(lightDiff).toBeGreaterThanOrEqual(4);
  });
});
