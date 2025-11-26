import React, { useState } from "react";
import useGame from "../state/useGame";
import { coordToIndex, GOAL_INDEX } from "../utils/trackUtils";

// 正方形ボードの一辺
const SIZE = 8;

// グラデーション設定（マジックナンバーを意味ある定数に置換）
const GRADIENT = {
  HUE_START: 0, // 黄色寄りの色相
  HUE_END: 130, // 緑色寄りの色相
  SAT_BASE: 60, // %
  SAT_DELTA: 30, // %
  // 明度のベースと最大減少量を調整して、全体のコントラストを強める
  LIGHT_BASE: 100, // % ベース明度
  LIGHT_DELTA_MAX: 95, // % 最大減少量（ゴール付近で明度を強く下げる）
  POWER: 10, // 非線形カーブの強さ
  LINEAR_WEIGHT: 0.6, // 線形比率の重み
  POW_WEIGHT: 0.4, // べき乗比率の重み
};

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

        // タイムトラック上でこのセルがスタートまたはゴールか判定
        const isStart = x === 0 && y === 0;
        // `coordToIndex` で螺旋インデックスを計算し `GOAL_INDEX` と比較
        const idx = coordToIndex(y, x);
        const isGoal = idx === GOAL_INDEX;

        // スタート(0)からゴール(GOAL_INDEX)への比率を計算 (0..1)
        const ratio = idx >= 0 ? idx / GOAL_INDEX : 0;

        // 終盤での変化を強めるために非線形（べき乗）カーブを適用
        const power = GRADIENT.POWER;

        // 線形比率とべき乗カーブを混合して、中盤でもコントラストが出るようにする
        const rPow = Math.pow(ratio, power);
        const r2 = GRADIENT.LINEAR_WEIGHT * ratio + GRADIENT.POW_WEIGHT * rPow;

        // 比率を色相にマップ（暖色→緑）
        const hue =
          GRADIENT.HUE_START +
          Math.round(r2 * (GRADIENT.HUE_END - GRADIENT.HUE_START));

        // ゴールに近づくほど彩度を上げ、明度を下げてコントラストを強化
        const sat = GRADIENT.SAT_BASE + Math.round(r2 * GRADIENT.SAT_DELTA);
        const light =
          GRADIENT.LIGHT_BASE - Math.round(r2 * GRADIENT.LIGHT_DELTA_MAX);
        const bgColor = `hsl(${hue} ${sat}% ${light}%)`;

        return (
          <div
            key={`${x}-${y}`}
            className={`cell ${isHover ? "hover" : ""} ${
              isSelected ? "selected" : ""
            } ${isStart ? "start" : ""} ${isGoal ? "goal" : ""}`}
            data-x={x}
            data-y={y}
            data-testid={`cell-${x}-${y}`}
            data-index={idx}
            data-bg={bgColor}
            style={{ backgroundColor: bgColor }}
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
