import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import Board from "../src/components/Board";
import useGame from "../src/state/useGame";

// テスト間で共有される Zustand ストアの選択状態をリセット
beforeEach(() => {
  useGame.setState({ selected: null });
});

/**
 * ボードの選択動作をテスト
 */
describe("Board selection", () => {
  it("adds selected class on click and sets aria-selected", async () => {
    render(<Board />);
    const user = userEvent.setup();

    const target = document.querySelector(
      '[data-x="1"][data-y="0"]'
    ) as HTMLElement | null;
    expect(target).toBeTruthy();

    // 初期状態では選択クラスがないことを確認
    expect(target?.classList.contains("selected")).toBe(false);
    expect(target?.getAttribute("aria-selected")).toBe("false");

    // クリックして選択状態にする
    await user.click(target as HTMLElement);

    // 選択クラスが追加され、aria-selected属性がtrueになることを確認
    expect((target as HTMLElement).classList.contains("selected")).toBe(true);
    expect((target as HTMLElement).getAttribute("aria-selected")).toBe("true");
  });

  it("selects cell when Enter key is pressed while focused", async () => {
    render(<Board />);
    const user = userEvent.setup();

    const target = document.querySelector(
      '[data-x="2"][data-y="0"]'
    ) as HTMLElement | null;
    expect(target).toBeTruthy();

    // 初期状態では選択クラスがないことを確認
    expect(target?.classList.contains("selected")).toBe(false);
    expect(target?.getAttribute("aria-selected")).toBe("false");

    // フォーカスを当ててEnterキーを押す
    (target as HTMLElement).focus();
    await user.keyboard("{Enter}");

    // 選択クラスが追加され、aria-selected属性がtrueになることを確認
    expect((target as HTMLElement).classList.contains("selected")).toBe(true);
    expect((target as HTMLElement).getAttribute("aria-selected")).toBe("true");
  });
});
