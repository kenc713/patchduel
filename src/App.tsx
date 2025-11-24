import React from "react";
import Board from "./components/Board";
import TileSelector from "./components/TileSelector";
import GameEndToast from "./components/GameEndToast";
import { applyMove } from "./models/timeTrack";

export default function App() {
  // タイルに応じたステップ数を返す関数
  const stepsFor = (id: string) => (id === "t_goal" ? 999 : 1);

  // タイル選択時の処理
  const handleSelect = async (tileId: string) => {
    const steps = stepsFor(tileId);
    try {
      await applyMove("p1", steps);
    } catch (e) {
      // noop for demo
      // in real app show error feedback
    }
  };

  return (
    <div className="app">
      <h1>PatchDuel — プロトタイプ</h1>
      <Board />

      {/* quick TileSelector for integration/demo */}
      <TileSelector
        tileIds={["t_goal", "t_small"]}
        availableTileIds={["t_goal", "t_small"]}
        onSelect={handleSelect}
      />

      <GameEndToast />
    </div>
  );
}
