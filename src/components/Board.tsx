import React, { useState } from "react";
import useGame from "../state/useGame";

// 正方形ボードの一辺
const SIZE = 8;

export default function Board() {
  // ゲームの状態からマーカー情報とマーカー設置関数、現在のターンのプレイヤーを取得
  const board = useGame((s) => s.markers);
  const placeMarker = useGame((s) => s.placeMarker);
  const activePlayer = useGame((s) => s.activePlayer);

  // ホバー状態をローカルステートで管理
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

  // 選択状態を取得
  const selected = useGame((s) => s.selected);
  const setSelected = useGame((s) => s.setSelected);

  return (
    <div
      className="board"
      role="grid"
      style={{ gridTemplateColumns: `repeat(${SIZE}, 40px)` }}
    >
      {Array.from({ length: SIZE * SIZE }).map((_, i) => {
        // セルの座標を一次元配列から計算
        const x = i % SIZE;
        const y = Math.floor(i / SIZE);

        // その座標にマーカーがあるか確認
        // findの引数に定義された無名関数を使って、board配列の各要素mについて判定処理が行われる
        // 条件を満たす最初の要素が返され、markerに格納される
        const marker = board.find((m) => m.x === x && m.y === y);

        // ホバー状態と選択状態を判定
        const isHover = hover?.x === x && hover?.y === y;
        const isSelected = selected?.x === x && selected?.y === y;

        return (
          <div
            key={`${x}-${y}`}
            className={`cell ${isHover ? "hover" : ""} ${
              isSelected ? "selected" : ""
            }`}
            data-x={x}
            data-y={y}
            role="gridcell"
            tabIndex={0}
            aria-selected={isSelected}
            // クリックによる選択状態の管理
            onClick={() => {
              setSelected({ x, y });
              placeMarker(activePlayer, x, y);
            }}
            // キーボード操作による選択状態の管理
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSelected({ x, y });
                placeMarker(activePlayer, x, y);
              }
            }}
            // ホバー時の状態管理
            onMouseEnter={() => setHover({ x, y })}
            onMouseLeave={() => setHover(null)}
          >
            {/* マーカーが存在する場合にのみ表示 */}
            {marker ? <div className="marker">●</div> : null}
          </div>
        );
      })}
    </div>
  );
}
