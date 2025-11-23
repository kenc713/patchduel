import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Board from "../src/components/Board";

describe("Board interactions", () => {
  it("places a marker when a cell is clicked", async () => {
    // ボードを描画
    render(<Board />);

    // ユーザー操作用のオブジェクトを作成
    const user = userEvent.setup();

    // マーカーの初期位置である（0,0）でないセルの1つをターゲットに設定
    const target = document.querySelector(
      '[data-x="1"][data-y="0"]'
    ) as HTMLElement | null;

    // ターゲットセルが存在することを確認してクリック
    expect(target).toBeTruthy();
    await user.click(target as HTMLElement);

    // クリック後、そのセル内にマーカーが存在することを確認
    const marker = (target as HTMLElement).querySelector(".marker");

    // マーカーが正しく配置されたことを検証
    expect(marker).toBeTruthy();
  });
});
