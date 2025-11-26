import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GameEndToast from "../src/components/GameEndToast";
import { eventBus } from "../src/state/eventBus";

describe("GameEndToast positioning", () => {
  // ゴール時にトーストが画面右上に固定（スクロールしても同じ位置に）表示されることを確認
  it("renders as a fixed top-right toast when gameEnded is published", async () => {
    render(<GameEndToast />);

    eventBus.publish("gameEnded", {
      winnerPlayerId: "p1",
      reason: "goal-reached",
      finalIndex: 63,
    });

    // トースト要素が表示されることを確認
    const el = await screen.findByTestId("game-end-toast");
    expect(el).toBeTruthy();

    // トーストのスタイル確認
    expect(el).toHaveStyle({ position: "fixed" });
    expect(el).toHaveStyle({ top: "1rem" });
    expect(el).toHaveStyle({ right: "1rem" });
  });
});
