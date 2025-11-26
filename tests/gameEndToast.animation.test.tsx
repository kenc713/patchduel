import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { waitFor } from "@testing-library/react";
import GameEndToast from "../src/components/GameEndToast";
import { eventBus } from "../src/state/eventBus";
import "../src/styles.css";

describe("GameEndToast animation", () => {
  // ゲーム終了時のトースト表示とアニメーションをテスト
  it("adds visible class, then hiding class, then removes element after timeout", async () => {
    render(<GameEndToast />);

    // ゲーム終了イベントを発行してトーストを表示
    let published = false;
    await waitFor(() => {
      // 一度だけ発行
      if (!published) {
        eventBus.publish("gameEnded", {
          winnerPlayerId: "p1",
          reason: "goal-reached",
          finalIndex: 63,
        });
        published = true;
      }

      // トーストメッセージが表示されていることを確認
      // waitFor 内に書くことで、非同期に表示されるのを待つ
      expect(screen.getByTestId("game-end-toast")).toBeTruthy();
    });

    // トーストメッセージのクラス名を確認
    const el = screen.getByTestId("game-end-toast");

    // トーストメッセージはすぐに visible クラスを持つべき
    expect(el).toHaveClass("toast-visible");

    // 非表示フェーズ直前まで進める（非表示は3700msで開始される想定）
    await new Promise((r) => setTimeout(r, 3700));

    // トーストメッセージは非表示クラスを持つべき
    await waitFor(() => expect(el).toHaveClass("toast-hiding"));

    // 削除後まで進める（合計4000ms）
    await new Promise((r) => setTimeout(r, 400));
    await waitFor(
      () => expect(screen.queryByTestId("game-end-toast")).toBeNull(),
      { timeout: 1000 }
    );
  });
});
