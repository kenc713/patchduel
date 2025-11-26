import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { act } from "react";
import GameEndToast from "../src/components/GameEndToast";
import { eventBus } from "../src/state/eventBus";
//import "../src/styles.css";

describe("GameEndToast animation", () => {
  // ゲーム終了時のトースト表示とアニメーションをテスト
  it("adds visible class, then hiding class, then removes element after timeout", async () => {
    vi.useFakeTimers();
    render(<GameEndToast />);

    act(() => {
      eventBus.publish("gameEnded", {
        winnerPlayerId: "p1",
        reason: "goal-reached",
        finalIndex: 63,
      });
    });

    // publish is synchronous; the element should be immediately available
    const el = screen.getByTestId("game-end-toast");
    expect(el).toBeTruthy();
    // should get visible class immediately
    expect(el).toHaveClass("toast-visible");

    // advance to just before hiding phase (assume hide starts at 3700ms)
    act(() => {
      vi.advanceTimersByTime(3700);
    });
    // element should be entering hiding state
    expect(el).toHaveClass("toast-hiding");

    // advance to after removal (4000ms total)
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.queryByTestId("game-end-toast")).toBeNull();

    vi.useRealTimers();
  });
});
