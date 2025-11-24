import React, { useState } from "react";

type Props = {
  tileIds: string[];
  availableTileIds: string[];
  onSelect: (tileId: string) => void;
};

export default function TileSelector({
  tileIds,
  availableTileIds,
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

  // レンダリング
  return (
    <div>
      <div role="list">
        {tileIds.map((id) => {
          const available = availableTileIds.includes(id);
          return (
            <button
              key={id}
              onClick={() => handleClick(id, available)}
              aria-disabled={!available}
            >
              {id}
            </button>
          );
        })}
      </div>
      {error && <div role="alert">{error}</div>}
    </div>
  );
}
