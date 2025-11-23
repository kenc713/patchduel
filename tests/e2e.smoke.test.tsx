import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, beforeEach, expect } from "vitest";
import App from "../src/App";
import useGame from "../src/state/useGame";
import useSession from "../src/state/session";

describe("E2E smoke: App -> Board -> place -> endTurn", () => {
  beforeEach(() => {
    // 初期セッションを p1 で開始
    useGame.getState().initSession("p1");
  });

  it("renders app, places a marker as p2, and records endTurn", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    // p2 に切り替えて (2,0) に配置
    useGame.getState().setActivePlayer("p2");
    const cell = container.querySelector(
      '[data-x="2"][data-y="0"]'
    ) as HTMLElement;
    expect(cell).toBeTruthy();

    await user.click(cell);

    // マーカーが描画されていること
    const marker = cell.querySelector(".marker");
    expect(marker).toBeTruthy();

    // 履歴に place が追加されていること
    const place = useSession
      .getState()
      .history.find(
        (h) =>
          h.type === "place" &&
          h.playerId === "p2" &&
          h.payload?.x === 2 &&
          h.payload?.y === 0
      );
    expect(place).toBeTruthy();

    // endTurn を呼んで履歴に endTurn が追加される
    useGame.getState().endTurn("p2");
    const last = useSession.getState().history.slice(-1)[0];
    expect(last.type).toBe("endTurn");
    expect(last.playerId).toBe("p2");
  });
});
