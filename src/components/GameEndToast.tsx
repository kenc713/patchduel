import React, { useEffect, useState } from "react";
import { eventBus } from "../state/eventBus";

export default function GameEndToast() {
  // メッセージ状態を作成
  const [msg, setMsg] = useState<string | null>(null);

  // コンポーネントの表示、非表示を制御
  // useEffect(() => { /* 実行処理 */; return () => { /* 後処理（クリーンアップ）*/ } }, [依存配列])

  useEffect(() => {
    // gameEnded イベントを購読し、handlerを登録
    const unsub = eventBus.subscribe("gameEnded", (p: any) => {
      const player = p?.winnerPlayerId ?? "プレイヤー";
      const final = p?.finalIndex;
      setMsg(`${player}がゴールしました。 — ゲーム終了 (最終: ${final})`);
      // 自動的に数秒で消す
      setTimeout(() => setMsg(null), 4000);
    });

    // 表示終了後にクリーンアップ関数で購読解除
    return () => unsub();
  }, []);

  if (!msg) return null;

  // トーストメッセージを表示（画面右上に固定表示するスタイル）
  const toastStyle: React.CSSProperties = {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    background: "rgba(0,0,0,0.85)",
    color: "#fff",
    padding: "0.5rem 0.75rem",
    borderRadius: "6px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
    zIndex: 9999,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="game-end-toast"
      style={toastStyle}
    >
      {msg}
    </div>
  );
}
