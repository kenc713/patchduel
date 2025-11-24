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
  const [error, setError] = useState<string | null>(null);

  // タイルクリック時の処理
  const handleClick = (id: string, available: boolean) => {
    setError(null);
    if (!available) {
      setError("このタイルは選択できません");
      return;
    }
    onSelect(id);
  };

  // 横スクロール（無限風）にするためにリストを2回描画
  const renderTiles = (repeatIndex: number) =>
    tileIds.map((id, idx) => {
      const available = availableTileIds.includes(id);
      const steps = tileSteps[id] ?? 0;
      return (
        <button
          key={`${id}-${repeatIndex}-${idx}`}
          onClick={() => handleClick(id, available)}
          aria-disabled={!available}
          aria-label={`tile-${id}`}
          style={{
            minWidth: 48,
            minHeight: 48,
            marginRight: 8,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {String(steps)}
        </button>
      );
    });

  return (
    <div>
      <div
        data-testid="tile-scroller"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        <div role="list" style={{ display: "inline-flex" }}>
          {renderTiles(0)}
          {renderTiles(1)}
        </div>
      </div>
      {error && <div role="alert">{error}</div>}
    </div>
  );
}
