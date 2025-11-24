import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import App from "../src/App";
import timeMarker from "../src/models/timeMarkerUtils";

describe("Integration: selecting a tile moves board marker", () => {
  // ゴールタイルを選択したときに、ゴールの座標に正しくたどり着くかを確認
  it("selecting tile moves player marker to computed coord", async () => {
    const user = userEvent.setup();
    render(<App />);

    // ゴールタイルを選択する（aria-label を使って取得）
    const btn = screen.getByRole("button", { name: /tile-t_goal/i });
    await user.click(btn);

    // t_goalに対応するapplyMoveはゴールのインデックスにマッピングされるので、その座標を計算する
    const goalIdx = timeMarker.GOAL_INDEX;
    const { row, col } = timeMarker.indexToCoord(goalIdx);

    // 該当座標がセルとして存在しているか確認
    const cell = await screen.findByTestId(`cell-${col}-${row}`);
    expect(cell).toBeTruthy();

    // セルにマーカーがあるか確認
    expect(cell.querySelector(".marker")).toBeTruthy();
  });
});
