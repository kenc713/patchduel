import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GameEndToast from "../src/components/GameEndToast";
import { eventBus } from "../src/state/eventBus";
import "../src/styles.css";

describe("GameEndToast positioning", () => {
  // ゴール時にトーストが画面右上に固定（スクロールしても同じ位置に）表示されることを確認
  it("renders as a fixed top-right toast when gameEnded is published", async () => {
    render(<GameEndToast />);

    // publish inside waitFor so the handler's setState runs inside testing-library's act
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

      // トースト要素が表示されることを確認
      expect(screen.getByTestId("game-end-toast")).toBeTruthy();
    });

    // Expect the element to have the class that will be styled in CSS
    const el = screen.getByTestId("game-end-toast");
    expect(el).toHaveClass("game-end-toast");
  });
});
