import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Board from "../src/components/Board";

/**
 * ボードのホバー動作をテスト
 */
describe("Board hover", () => {
  it("adds hover class on mouse enter and removes on leave", async () => {
    render(<Board />);
    const user = userEvent.setup();

    // ターゲットセルを取得
    const target = document.querySelector(
      '[data-x="1"][data-y="0"]'
    ) as HTMLElement | null;
    expect(target).toBeTruthy();

    // 初期状態ではホバークラスがないことを確認
    expect(target?.classList.contains("hover")).toBe(false);

    // マウスがセルに入ったときにホバークラスが追加されることを確認
    await user.hover(target as HTMLElement);
    expect((target as HTMLElement).classList.contains("hover")).toBe(true);

    // マウスがセルから離れたときにホバークラスが削除されることを確認
    await user.unhover(target as HTMLElement);
    expect((target as HTMLElement).classList.contains("hover")).toBe(false);
  });
});
