import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, beforeEach, expect } from "vitest";
import { waitFor } from "@testing-library/react";
import Board from "../src/components/Board";
import useGame from "../src/state/useGame";

describe("Board render performance", () => {
  beforeEach(() => {
    // p1 を初期セッションとして (0,0) に初期マーカーを配置
    useGame.getState().initSession("p1");
  });

  it("reflects movement in the DOM within 200ms", async () => {
    const user = userEvent.setup();
    const { container } = render(<Board />);

    // 移動前: 既存のマーカーが (0,0) にあることを確認
    const origin = container.querySelector(
      '[data-x="0"][data-y="0"]'
    ) as HTMLElement;
    expect(origin).toBeTruthy();
    expect(origin.querySelector(".marker")).toBeTruthy();

    // 移動先セル (2,2)
    const target = container.querySelector(
      '[data-x="2"][data-y="2"]'
    ) as HTMLElement;
    expect(target).toBeTruthy();

    const start = performance.now();
    await user.click(target);

    // クリック後、移動先にマーカーが描画されるのを待つ
    await waitFor(() => {
      const marker = target.querySelector(".marker");
      expect(marker).toBeTruthy();
    });

    // 同時に元のセルのマーカーが消えていることを検証
    expect(origin.querySelector(".marker")).toBeNull();
    const elapsed = performance.now() - start;
    // 要件: 200ms 未満で描画されること
    expect(elapsed).toBeLessThan(200);
  });
});
