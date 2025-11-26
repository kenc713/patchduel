import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Board from "../src/components/Board";

// Check that mid-board has noticeable gradient change (quarter vs half index)
describe("Board gradient mid-range", () => {
  it("shows stronger contrast in mid-range between quarter and half indices", () => {
    const { container } = render(<Board />);
    const cells = Array.from(
      container.querySelectorAll("[data-index]")
    ) as HTMLElement[];
    const idxMap = new Map<number, HTMLElement>();
    cells.forEach((c) => idxMap.set(Number(c.getAttribute("data-index")), c));

    const q = 16; // roughly quarter
    const h = 32; // roughly half
    const qEl = idxMap.get(q);
    const hEl = idxMap.get(h);
    expect(qEl).toBeTruthy();
    expect(hEl).toBeTruthy();

    const parse = (s: string) => {
      const m = s.match(/hsl\(\s*(\d+)\s+(\d+)%\s+(\d+)%\s*\)/);
      if (!m) return null;
      return { h: Number(m[1]), s: Number(m[2]), l: Number(m[3]) };
    };

    const qBg = qEl!.getAttribute("data-bg") || "";
    const hBg = hEl!.getAttribute("data-bg") || "";
    const qH = parse(qBg)!;
    const hH = parse(hBg)!;
    expect(qH).toBeTruthy();
    expect(hH).toBeTruthy();

    const diff = Math.abs(qH.l - hH.l);
    expect(diff).toBeGreaterThanOrEqual(6);
  });
});
