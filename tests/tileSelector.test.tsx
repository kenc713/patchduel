import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import TileSelector from "../src/components/TileSelector";

describe("TileSelector", () => {
  // TileSelector が33個のタイルを表示し、ボタンに名称ではなく数字（0-10）が表示されることを確認する
  it("renders 33 tiles showing numeric step labels and handles selection", async () => {
    const user = userEvent.setup();
    const tiles = Array.from({ length: 33 }).map((_, i) => `t${i + 1}`);
    // available はすべて許可
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

    // 33個のボタンが存在する
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(33);

    // 最初のボタンには数字が表示され、id名は表示されていない
    const first = buttons[0];
    expect(first).toHaveTextContent(String(stepsMap[tiles[0]]));
    expect(first).not.toHaveTextContent(tiles[0]);

    // コンテナは横スクロール可能（overflowX:auto のいずれか）
    const list = screen.getByTestId("tile-scroller");
    expect(list).toBeTruthy();

    // ボタンをクリックすると onSelect が呼ばれる
    await user.click(first);
    expect(calls).toContain(tiles[0]);
  });
});
