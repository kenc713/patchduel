# Research & Design Decisions — time-marker-move-2

## Summary

- **Feature**: time-marker-move-2
- **Discovery Scope**: Extension / Simple Addition
- **Key Findings**:
  - 既存コードベースは `TimeMarker` ドメインが存在し、状態は `src/state/` に集約される想定（steering の方針に準拠）。
  - 要件は主にロジック（移動計算、ゴール判定）と状態更新・イベント発行に集中しており、外部依存は小さい。
  - UI は選択可能なタイルを提示する既存コンポーネントを拡張すれば対応可能で、サーバ側 API は不要と判断。
  - タイルは現状 `33` 枚を想定するが、将来的に変更される可能性があるため設定化（`TILE_POOL_SIZE`）を推奨する。

## Research Log

### トラック表現とインデックス方式

- **Context**: 要件は `computeNewIndex(currentIndex, steps)` を明示しているが、インデックスの表現が未定義だったため決定が必要。
- **Sources Consulted**: steering/structure.md（ドメインモデル推奨）、既存テスト群（`tests/`）の命名規約
- **Findings**:
  - シンプルでテストしやすいのは「0..N-1 の線形インデックス」を採用し、公開 API はインデックスを用いること。
  - 表示やログは必要に応じて `(row,col)` に変換するユーティリティ関数を用意する。
- **Implications**: インデックスの順序（盤面上の移動経路）を設計.md に明記して実装者間の解釈差を防ぐ。

### ゴールセルの取り扱い

- **Context**: ユーザ指定でゴールは `(4,3)`、トラックの周回は禁止。
- **Findings**:
  - 移動がゴールを超過する場合はゴールに止めるという要件を採用。
  - ゴール到達時はゲーム終了イベントを発行し、状態は終了状態へ遷移する。
- **Implications**: computeNewIndex はゴール判定を行うか、もしくは別の判定 API (`isGoalReached(index)`) を用意する方針を提案。

## Architecture Pattern Evaluation

| Option                | Description                                                               | Strengths                     | Risks / Limitations              | Notes                                   |
| --------------------- | ------------------------------------------------------------------------- | ----------------------------- | -------------------------------- | --------------------------------------- |
| Modular Domain Module | `TimeTrack` を独立したモジュールとして定義し、Game State とイベントで連携 | 単体テストが容易、UI と疎結合 | 既存ストアとの調整が必要だが軽微 | steering の型中心のドメインモデルに合致 |

## Design Decisions

### Decision: インデックス表現を線形 0..63 とする

- **Context**: 実装間の齟齬を防ぐために共通の表現を決定する必要がある
- **Alternatives Considered**:
  1. `(row,col)` を直接使う — 可読性は高いが境界チェックがやや冗長
  2. 線形インデックス `0..63` を使う — 計算とユニットテストが簡潔
- **Selected Approach**: 線形インデックスを採用し、表示用ユーティリティで `(row,col)` に変換する
- **Rationale**: `computeNewIndex` の純粋関数性能とテスト性を優先
- **Trade-offs**: 実装者はインデックス → 座標変換の命名規約を遵守する必要がある

### Decision: トラック経路を外周から内側へ螺旋（スパイラル）状にする

- **Context**: 要件にある「右回りに進める」「左上スタート」、「(4,3) がゴール」に自然に合致する経路定義が必要
- **Alternatives Considered**:
  1. 行優先（row-major）や列優先（column-major）で単純に線形化 — 実装は単純だが「右回りに進める」というドメイン表現と乖離する可能性がある
  2. 外周 → 内側スパイラル（採用） — ドメインの「外周を右回りで進む」イメージに合致し、`(4,3)` を最終セルにできる
- **Selected Approach**: スパイラル割当を採用。`index = 0` は `(0,0)`、`index = 63` は `(4,3)`（N=8 の場合）。
- **Rationale**: ゲームのルール記述（右回り）とテスト性、実装の可読性のバランスが良いため。最終セルの位置は 8×8 におけるスパイラルの特性として `(N/2, N/2 - 1)` で表される。
- **Trade-offs**: インデックス → 座標の実装を全員が共有する必要がある。`indexToCoord`/`coordToIndex` のユーティリティを用意し、共同で使うことを義務化することでリスクを低減する。

### Decision: タイルプールサイズを設定化する

- **Context**: 現状は 33 枚を想定するが、ルール変更やバランス調整で数が変わる可能性がある。
- **Selected Approach**: `TILE_POOL_SIZE` を設定として管理し、ゲーム初期化と UI はその値を参照してプールを構築する。
- **Rationale**: テストやルール変更への対応が容易になり、ハードコーディングを避けられる。
- **Implementation Note**: `src/config/gameConfig.ts` に定義し、ユニットテストではモック／フィクスチャで上書き可能にする。

### Decision: ゴール到達は UI に仮のトーストで通知する

- **Context**: 現時点では簡易な終了表示で十分。将来的に結果画面へ拡張する可能性がある。
- **Selected Approach**: `gameEnded` イベント受信時に UI レイヤーでトーストを表示する（ローカライズ対応）。
- **Rationale**: 実装が軽量で UX を即時に確認でき、後続のデザインで画面遷移へ置換しやすい。

## Risks & Mitigations

- リスク: インデックスの順序（トラック経路）が不明確 → 線形マッピング仕様を設計.md に明記して回避
- リスク: UI 側で選択状態と同期がずれる → イベント `timeMarkerMoved` と状態ストアの原子更新で整合性を保証

## References

- steering/structure.md — ドメインモデルの方針
- steering/tech.md — テスト方針（Vitest）と TypeScript を使う前提
