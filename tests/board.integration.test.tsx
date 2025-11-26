import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, beforeEach, expect } from "vitest";
import { waitFor } from "@testing-library/react";
import Board from "../src/components/Board";
import useGame from "../src/state/useGame";
import useSession from "../src/state/session";

describe("Board -> placeMarker -> endTurn integration", () => {
  beforeEach(() => {
    // 単一プレイヤーセッションを初期化して (0,0) に初期マーカーを置く
    useGame.getState().initSession("p1");
  });

  it("clicking a cell places a marker and endTurn records the action", async () => {
    const user = userEvent.setup();

    // Board を描画
    const { container } = render(<Board />);

    // (1,0) のセルを取得してクリックする
    // 注: initSession('p1') により p1 は既に (0,0) にマーカーを持つため、別プレイヤーで配置を行う
    useGame.getState().setActivePlayer("p2");
    const cell = container.querySelector(
      '[data-x="1"][data-y="0"]'
    ) as HTMLElement;
    expect(cell).toBeTruthy();

    await user.click(cell);

    // クリック後、そのセルにマーカーが描画されていることを待つ
    await waitFor(() => {
      const marker = cell.querySelector(".marker");
      expect(marker).toBeTruthy();
    });

    // セッション履歴に place エントリが追加されていることを待つ
    await waitFor(() => {
      const placeEntry = useSession
        .getState()
        .history.find(
          (h) =>
            h.type === "place" &&
            h.playerId === "p2" &&
            h.payload?.x === 1 &&
            h.payload?.y === 0
        );
      expect(placeEntry).toBeTruthy();
    });

    // endTurn を呼んで履歴に endTurn が追加されることを確認
    useGame.getState().endTurn("p1");
    await waitFor(() => {
      const last = useSession.getState().history.slice(-1)[0];
      expect(last.type).toBe("endTurn");
      expect(last.playerId).toBe("p1");
    });
  });
});
