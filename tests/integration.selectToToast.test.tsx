import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import App from "../src/App";

describe("Integration: Tile selection -> applyMove -> toast", () => {
  // ゴール到達時にトーストが表示されることの確認
  it("selecting a goal tile triggers gameEnded and shows toast", async () => {
    const user = userEvent.setup();
    render(<App />);

    // ゴールタイルを選択する（aria-label を使って取得）
    const btn = screen.getByRole("button", { name: /tile-t_goal/i });
    await user.click(btn);

    // トーストが表示されることを確認する
    const toast = await screen.findByTestId("game-end-toast");
    expect(toast).toBeTruthy();
    expect(toast).toHaveTextContent(/ゴールしました/);
  });
});
