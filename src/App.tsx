import React from "react";
import "./styles.css";
import Board from "./components/Board";
import TileSelector from "./components/TileSelector";
import GameEndToast from "./components/GameEndToast";
import { applyMove } from "./models/timeTrack";

export default function App() {
  // 33個のタイルを生成
  const tiles = Array.from({ length: 33 }).map((_, i) => `t${i + 1}`);

  // ステップ数マップ（0-10の適当な数字を割り当てる）
  const tileSteps: Record<string, number> = {};
  tiles.forEach((id, i) => (tileSteps[id] = i % 11));

  // ゴールタイルを1つ用意（末尾に差し替え）
  const goalId = "t_goal";
  // replace the last tile id with t_goal for demo
  tiles[tiles.length - 1] = goalId;
  tileSteps[goalId] = 999; // 大きな移動値でゴールをトリガ

  // タイル選択時の処理
  const handleSelect = async (tileId: string) => {
    const steps = tileSteps[tileId] ?? 0;
    try {
      await applyMove("p1", steps);
    } catch (e) {
      // noop for demo
    }
  };

  return (
    <div
      className="app"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <h1>PatchDuel — プロトタイプ</h1>
      <Board />

      {/* TileSelector: 横スクロールで33個のタイルを表示 */}
      <TileSelector
        tileIds={tiles}
        availableTileIds={tiles}
        tileSteps={tileSteps}
        onSelect={handleSelect}
      />

      <GameEndToast />
    </div>
  );
}
