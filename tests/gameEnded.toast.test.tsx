import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GameEndToast from "../src/components/GameEndToast";
import { eventBus } from "../src/state/eventBus";

describe("GameEndToast", () => {
  // ゲーム終了イベントが発行されたときにトーストが表示されることを確認するテスト
  it("shows toast when gameEnded event is published", async () => {
    render(<GameEndToast />);

    // publish inside waitFor so setState runs inside testing-library's act
    let published = false;
    await waitFor(() => {
      if (!published) {
        eventBus.publish("gameEnded", {
          winnerPlayerId: "p1",
          reason: "goal-reached",
          finalIndex: 63,
        });
        published = true;
      }

      const el = screen.getByTestId("game-end-toast");
      expect(el).toBeTruthy();
      expect(el).toHaveTextContent("p1がゴールしました");
    });
  });
});
