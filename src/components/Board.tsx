import React from "react";
import useGame from "../state/useGame";

// 正方形ボードの一辺
const SIZE = 8;

export default function Board() {
  // ゲームの状態からマーカー情報とマーカー設置関数を取得
  const board = useGame((s) => s.markers);
  const placeMarker = useGame((s) => s.placeMarker);

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

        return (
          <div
            key={`${x}-${y}`}
            className="cell"
            data-x={x}
            data-y={y}
            role="gridcell"
            onClick={() => placeMarker("p1", x, y)}
          >
            {/* マーカーが存在する場合にのみ表示 */}
            {marker ? <div className="marker">●</div> : null}
          </div>
        );
      })}
    </div>
  );
}
