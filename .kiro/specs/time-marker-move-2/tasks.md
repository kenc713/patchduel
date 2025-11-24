## 実装タスク

- [x] 1. ユーティリティ関数の実装
     \
     1,3,5

- `indexToCoord( index )` を実装する（外側 → 内側、時計回りのスパイラルマッピング）
- `coordToIndex( row, col )` を実装する（逆変換）
- `computeNewIndex(currentIndex, steps)` を純粋関数として実装し、`GOAL_INDEX` を超えないようにキャップする
- 基本的な単体テストを書く（境界、無効入力、GOAL 到達）

- [x] 2. `applyMove` ロジックと TimeTrack モジュールの実装
     \
     1,2,4,5

- 選択と `steps` の検証を実装する（不正な値を拒否）
- 原子的にマーカー位置を更新する `applyMove(playerId, steps)` を実装する（内部で `computeNewIndex` を使用）
- `timeMarkerMoved` と `gameEnded` イベントを発行する（必要なペイロードを含む）

- [x] 3. `GameStateStore` の拡張（状態更新とクエリ可能性）
     \
     2,4,5

- `applyMove` 呼び出しを受けて状態を更新するストア関数を実装する
- `gameEnded` フラグと理由を保持するフィールドを追加し、UI がクエリできるようにする
- 原子的更新で整合性を保つ（イベント発行との整合）

- [x] 4. `TileSelector` UI の更新と選択検証
     \
     2,4

- `availableTileIds` に基づいて選択可能なタイルを制御する（無効な選択を防止）
- 選択エラー時の視覚的フィードバックを実装する（アクセシブルな表示）

- [ ] 5. ゲーム終了検知とトースト通知の実装
     \
     3,4

- `gameEnded` イベントをリッスンしてローカライズ済みのトーストを表示する
- 将来の結果画面遷移用フックを用意する（現段階ではトースト表示で十分）

- [x] 6. コアロジックの単体テスト (P)
     \
     1,2,5

---

追記: タスク 2 と 3 の最小実装と、コアロジックに関するテスト（`timeMarker.utils.test.ts` と `timeTrack.applyMove.test.ts`）を追加・実行し、ローカルで全テストが通過することを確認しました。

- `computeNewIndex` の単体テスト（通常移動、GOAL 到達、オーバーシュートのキャップ、無効ステップ）
- `indexToCoord` / `coordToIndex` のマッピングテスト（例: `indexToCoord(63) == {row:4,col:3}` を含む）
- `applyMove` のビジネスロジック単体テスト

- [ ] 7. 統合テスト / E2E (P)
     \
     2,3,4,5

- UI 選択 → `applyMove` → ストア更新 → `timeMarkerMoved` 発行 → UI 表示のフローを検証する統合テスト
- ゴール到達フローで `gameEnded` が発生し、トーストが表示されることを検証する
- [ ]\* プラットフォーム／ブラウザ行列での拡張 E2E（MVP 後に実施可能、オプション）

---

注: 各サブタスクは目安で 1–3 時間に収まるように分割しています。`(P)` は並列実行可能な項目です。
