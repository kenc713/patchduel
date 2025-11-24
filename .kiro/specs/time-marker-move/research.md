# Research & Design Decisions for time-marker-move

---

**Feature**: time-marker-move
**Discovery Scope**: Extension

## Summary

- **Feature**: 既存のタイムマーカー配置ロジックを「移動」動作に変更し、同一プレイヤーの既存マーカーを新しい位置で置き換える。
- **Discovery Scope**: 既存のフロントエンド（React + TypeScript）内の状態管理（Zustand）を拡張する小規模な変更。
- **Key Findings**:
  - 変更点は主に `src/state/useGame.ts` の `placeMarker` ロジックに集中する。
  - `src/components/Board.tsx` では UI 側は既に `placeMarker` を呼び出す実装になっており、UI 側の大幅な変更は不要。
  - セッション記録（`src/state/session.ts` 経由）における配置履歴の扱いを見直す必要がある（旧マーカー削除の記録）。

## Research Log

### Extension Point: マーカー配置ロジック

- **Context**: `placeMarker` が現在「既に同一プレイヤーのマーカーがある場合は配置を拒否」している。
- **Sources Consulted**: ローカルコード (`useGame.ts`, `Board.tsx`, `timeMarker.ts`) の確認。
- **Findings**: 既存実装の条件によって“移動”が実現されていない。最小の修正で仕様が満たせる。
- **Implications**: `placeMarker` を「既存マーカーがあれば削除して新しい位置に追加する」振る舞いに変更する。セッションの記録 API を拡張して、`prevMarkerId` を含めることを推奨。

### UI Impact

- **Context**: `Board.tsx` はマーカーが `markers` 配列に存在するかで表示を決めている。
- **Findings**: ステート更新が正しく行われれば、UI は自動的に 1 つのマーカー表示に変化する。
- **Implications**: UI 側は軽微なテストのみで十分。描画遅延は 200ms 要件としてテストケースに追加。

## Architecture Pattern Evaluation

| Option               | Description                                                              | Strengths                                | Risks / Limitations                                    |
| -------------------- | ------------------------------------------------------------------------ | ---------------------------------------- | ------------------------------------------------------ |
| Minimal store change | `placeMarker` の振る舞いを変更して既存マーカーを削除してから新規追加する | 最小侵襲。既存コードの大部分を維持できる | セッション履歴や並列操作の競合を忘れないよう注意が必要 |

## Design Decisions

### Decision: placeMarker を移動操作に変更する

- **Context**: ユーザー要件では「マーカーの移動」が期待されている。
- **Alternatives Considered**:
  1. UI で「移動」操作を明示的に設ける（クリックで移動モードに入る） — UI 変更が必要
  2. Store レイヤで置換を行う（選択） — 最小限の変更で要件達成
- **Selected Approach**: Store レイヤで置換を行う。既存の `placeMarker` を改修し、`own` マーカーがあれば削除して新しいマーカーを追加する。
- **Rationale**: UI を変えずに期待動作を満たせること、ドメイン不変条件（プレイヤー当たり 1 マーカー）を一箇所で担保できる利点。
- **Trade-offs**: 既存の呼び出し元が `placeMarker` の戻り値や失敗条件に依存している場合、呼び出し側テストの更新が必要。

## Risks & Mitigations

- リスク: レースコンディションで 2 つの同一プレイヤー操作が並列発生すると不整合が起きる。
  - 緩和策: `placeMarker` 内で同一プレイヤーの操作を排他（Zustand の更新関数を一貫して使用し、変更は同期的に行う）、自動テストで競合ケースを追加。
- リスク: セッション履歴に旧マーカー削除が記録されないと履歴整合性が失われる。
  - 緩和策: `useSession.recordPlace` を `prevMarkerId` を受け取る形に拡張し、現在の移動を正しく記録する。

## Files / Components to Modify

- `src/state/useGame.ts` — `placeMarker` のロジック変更（必須）
- `src/state/session.ts` — 配置履歴のスキーマに `prevMarkerId` を追加（推奨）
- `src/components/Board.tsx` — UI レンダリングは現状維持で良いが、表示タイミングの E2E テストを追加（200ms 要件の検証）

## Testing Focus Areas

- 単体テスト: `placeMarker` の既存・置換・拒否ロジック（境界値、範囲外）
- 並列性テスト: 同一プレイヤーで短時間に複数配置呼び出しした場合の整合性
- UI 統合テスト: Board の再描画で古いマーカーが消え新しいマーカーのみ表示されること（描画遅延を含む）

## References

- ローカルコードベース: `src/state/useGame.ts`, `src/components/Board.tsx`, `src/models/timeMarker.ts`

---
