import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GameEndToast from "../src/components/GameEndToast";
import { eventBus } from "../src/state/eventBus";

describe("GameEndToast", () => {
  // ゲーム終了イベントが発行されたときにトーストが表示されることを確認するテスト
  it("shows toast when gameEnded event is published", async () => {
    render(<GameEndToast />);

    // ゲーム終了イベントを発行
    eventBus.publish("gameEnded", {
      winnerPlayerId: "p1",
      reason: "goal-reached",
      finalIndex: 63,
    });

    // トーストが表示されることを確認
    const el = await screen.findByTestId("game-end-toast");
    expect(el).toBeTruthy();
    expect(el).toHaveTextContent("p1がゴールしました");
  });
});
