import React, { useEffect, useState } from "react";
import { eventBus } from "../state/eventBus";

export default function GameEndToast() {
  // メッセージ状態を作成
  const [msg, setMsg] = useState<string | null>(null);

  // visible状態を作成
  const [visible, setVisible] = useState(false);

  // タイマー参照を作成
  const hideTimerRef = React.useRef<number | null>(null);
  const removeTimerRef = React.useRef<number | null>(null);

  // コンポーネントの表示、非表示を制御
  // useEffect(() => { /* 実行処理 */; return () => { /* 後処理（クリーンアップ）*/ } }, [依存配列])

  useEffect(() => {
    // gameEnded イベントを購読し、handlerを登録
    const unsub = eventBus.subscribe("gameEnded", (p: any) => {
      const player = p?.winnerPlayerId ?? "プレイヤー";
      const final = p?.finalIndex;
      // set message and show toast
      setMsg(`${player}がゴールしました。 — ゲーム終了 (最終: ${final})`);
      setVisible(true);

      // クリア前に既存のタイマーをクリア
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }

      // visible期間の終わり近くで非表示アニメーションを開始（例: 3700ms）
      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false); // triggers hiding class
      }, 3700);

      // 完全な期間（4000ms）後に要素を削除
      removeTimerRef.current = window.setTimeout(() => {
        setMsg(null);
        // clear refs
        hideTimerRef.current = null;
        removeTimerRef.current = null;
      }, 4000);
    });

    // cleanup on unmount
    return () => {
      unsub();
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (removeTimerRef.current) clearTimeout(removeTimerRef.current);
    };
  }, []);

  if (!msg) return null;

  // トーストメッセージを表示（スタイルは styles.css に移行）
  const classNames = ["game-end-toast"];
  if (visible) classNames.push("toast-visible");
  else if (msg) classNames.push("toast-hiding");

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="game-end-toast"
      className={classNames.join(" ")}
    >
      {msg}
    </div>
  );
}
