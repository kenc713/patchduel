import React, { useState } from "react";

type Props = {
  tileIds: string[];
  availableTileIds: string[];
  // tile id -> steps to move (0-10)
  tileSteps?: Record<string, number>;
  onSelect: (tileId: string) => void;
};

export default function TileSelector({
  tileIds,
  availableTileIds,
  tileSteps = {},
  onSelect,
}: Props) {
  // 状態管理
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const total = tileIds.length;

  /**
   * 無限スクロールのためのインデックス処理関数
   * @param i
   * @returns
   */
  const clampIndex = (i: number) => {
    if (total === 0) return 0;
    // wrap around for infinite behavior
    return ((i % total) + total) % total;
  };

  // 左ボタン押下ハンドラ
  const handlePrev = () => {
    setError(null);
    setCurrentIndex((i) => clampIndex(i - 1));
  };

  // 右ボタン押下ハンドラ
  const handleNext = () => {
    setError(null);
    setCurrentIndex((i) => clampIndex(i + 1));
  };

  // window size (visible tiles)
  const WINDOW = 5;
  const half = Math.floor(WINDOW / 2);

  const visibleIndices = Array.from({ length: WINDOW }).map((_, i) =>
    clampIndex(currentIndex - half + i)
  );

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button aria-label="prev" onClick={handlePrev}>
          ◀
        </button>

        <div style={{ display: "inline-flex", gap: 8 }}>
          {visibleIndices.map((idx) => {
            const id = tileIds[idx];
            const available = availableTileIds.includes(id);
            const steps = tileSteps[id] ?? 0;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={`tile-${id}-${idx}`}
                onClick={() => {
                  setError(null);
                  if (!available) {
                    setError("このタイルは選択できません");
                    return;
                  }
                  setCurrentIndex(idx);
                  onSelect(id);
                }}
                aria-disabled={!available}
                aria-label={`tile-${id}`}
                style={{
                  minWidth: 56,
                  minHeight: 56,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: isCurrent ? "2px solid #333" : "1px solid #ccc",
                }}
              >
                {String(steps)}
              </button>
            );
          })}
        </div>

        <button aria-label="next" onClick={handleNext}>
          ▶
        </button>
      </div>

      {error && <div role="alert">{error}</div>}
    </div>
  );
}
