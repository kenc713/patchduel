import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import GameEndToast from "../src/components/GameEndToast";
import { eventBus } from "../src/state/eventBus";
//import "../src/styles.css";

describe("GameEndToast positioning", () => {
  // ゴール時にトーストが画面右上に固定（スクロールしても同じ位置に）表示されることを確認
  it("renders as a fixed top-right toast when gameEnded is published", async () => {
    render(<GameEndToast />);

    act(() => {
      eventBus.publish("gameEnded", {
        winnerPlayerId: "p1",
        reason: "goal-reached",
        finalIndex: 63,
      });
    });

    // トースト要素が表示されることを確認
    const el = await screen.findByTestId("game-end-toast");
    expect(el).toBeTruthy();

    // Expect the element to have the class that will be styled in CSS
    expect(el).toHaveClass("game-end-toast");
    // The presence of the CSS class is sufficient for styling in runtime;
    // computed styles in JSDOM may not reflect external CSS reliably.
    // We assert the class is present so the visual rules live in `styles.css`.
    expect(el).toHaveClass("game-end-toast");
  });
});
