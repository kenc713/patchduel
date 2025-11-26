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

  // トーストメッセージを表示（スタイルは styles.css に移行）
  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="game-end-toast"
      className="game-end-toast"
    >
      {msg}
    </div>
  );
}
