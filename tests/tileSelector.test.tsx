import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import TileSelector from "../src/components/TileSelector";

describe("TileSelector", () => {
  // 左右ボタン付きの5タイルウィンドウを使用してパッチタイルを選択できることを確認する
  it("uses left/right buttons to change selection, wraps around, and calls onSelect on click", async () => {
    const user = userEvent.setup();
    const tiles = Array.from({ length: 33 }).map((_, i) => `t${i + 1}`);
    const available = [...tiles];
    const calls: string[] = [];

    // 各タイルに対してステップ数を与える（0-10の繰り返し）
    const stepsMap: Record<string, number> = {};
    tiles.forEach((id, i) => (stepsMap[id] = i % 11));

    render(
      <TileSelector
        tileIds={tiles}
        availableTileIds={available}
        tileSteps={stepsMap}
        onSelect={(id) => calls.push(id)}
      />
    );

    // 左右ボタンが存在する
    const prev = screen.getByRole("button", { name: /prev/i });
    const next = screen.getByRole("button", { name: /next/i });
    expect(prev).toBeTruthy();
    expect(next).toBeTruthy();

    // 最初の中央表示タイルは tiles[0]（aria-label=`tile-<id>` で参照）
    const currentBtn = screen.getByRole("button", { name: `tile-${tiles[0]}` });
    expect(currentBtn).toHaveTextContent(String(stepsMap[tiles[0]]));

    // クリックすると onSelect が呼ばれる
    await act(async () => {
      await user.click(currentBtn);
    });
    expect(calls).toContain(tiles[0]);

    // next を押して選択を進め、中央に表示されるタイルが tiles[1] になる
    await act(async () => {
      await user.click(next);
    });
    const nextBtn = screen.getByRole("button", { name: `tile-${tiles[1]}` });
    expect(nextBtn).toBeTruthy();
    await act(async () => {
      await user.click(nextBtn);
    });
    expect(calls).toContain(tiles[1]);

    // prev を押して先頭からラップすると最後のタイルになる
    await act(async () => {
      await user.click(prev);
    });
    await act(async () => {
      await user.click(prev);
    });
    const wrapBtn = screen.getByRole("button", { name: `tile-${tiles[32]}` });
    expect(wrapBtn).toBeTruthy();
    await act(async () => {
      await user.click(wrapBtn);
    });
    expect(calls).toContain(tiles[32]);
  });
});
