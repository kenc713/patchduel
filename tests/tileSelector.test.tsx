import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import TileSelector from "../src/components/TileSelector";

describe("TileSelector", () => {
  // 選択可能なタイルでonSelectが呼ばれ、選択不可能なタイルでエラーメッセージが表示されることを確認するテスト
  it("calls onSelect for available tiles and shows error for unavailable", async () => {
    const user = userEvent.setup();
    const tiles = ["t1", "t2", "t3"];
    const available = ["t1", "t3"];
    const calls: string[] = [];
    render(
      <TileSelector
        tileIds={tiles}
        availableTileIds={available}
        onSelect={(id) => calls.push(id)}
      />
    );

    // t1 is available
    await user.click(screen.getByRole("button", { name: /t1/i }));
    expect(calls).toContain("t1");

    // t2 is unavailable -> should not call onSelect and should show error
    await user.click(screen.getByRole("button", { name: /t2/i }));
    expect(calls).not.toContain("t2");
    expect(screen.getByText(/無効な選択|選択できません/)).toBeTruthy();
  });
});
