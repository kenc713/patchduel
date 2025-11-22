```markdown
# Requirements Document

## Introduction

patchduel という 2 人用のボードゲームの最小実装。プレイヤーは 1 人で開始し、表示される 8×8 の盤上に自分のコマ（タイムマーカー）を自由に置き、置いたらターンを終了できることを目的とする。

## Requirements

### Requirement 1: Time Marker Placement

**Objective:** プレイヤーとして、8×8 の盤上の任意の空きマスに自分のタイムマーカーを置けるようにしたい（配置の基本動作）。

#### Acceptance Criteria

1. When プレイヤーが空のマスを選択してタイムマーカーを配置したとき, the system shall そのマスにプレイヤーのタイムマーカーを表示する。
2. If プレイヤーが盤外（8×8 の範囲外）を選択したとき, then the system shall その操作を無効化し、配置を行わない。
3. While ゲームが「配置」フェーズにある間, the system shall プレイヤーが盤上の任意のマスを選択可能にする。
4. The system shall プレイヤーごとに同時に存在するタイムマーカーは最大 1 つに制限する。

### Requirement 2: End Turn

**Objective:** プレイヤーとして、配置や操作の後に自分のターンを終了できるようにしたい（ターン進行の明示）。

#### Acceptance Criteria

1. When プレイヤーが「ターン終了」操作を実行したとき, the system shall プレイヤーのターンを終了し、次のゲーム処理（次フェーズまたは次プレイヤーへの移行）を行う（最小実装では単にターンを終了状態にする）。
2. When プレイヤーが有効なタイムマーカーを配置していない状態で「ターン終了」操作を実行したとき, the system shall その操作を受け付け、プレイヤーのターンを終了する。

### Requirement 3: Board Representation and Constraints

**Objective:** システムとして、盤面とマスの状態を正しく管理したい。

#### Acceptance Criteria

1. The system shall 表示される盤は 8 行 ×8 列であること。
2. When プレイヤーがマスを選択したとき, the system shall 選択中のマスを視覚的にハイライトする（UI 実装に依存するが、振る舞いはテスト可能にする）。
3. If マスに既に他のプレイヤーのタイムマーカーがあるとき, then the system shall 新たな配置をブロックする（最小実装では重複配置を禁止）。

### Requirement 4: Minimal Session Behavior

**Objective:** プレイヤーが単一プレイヤーで体験を試せるようにしたい（最小限のセッション管理）。

#### Acceptance Criteria

1. The system shall ゲームを開始するときにプレイヤーを 1 人で初期化できること。
2. When プレイヤーが配置とターン終了を完了したとき, the system shall その行為を記録し、次の操作（UI 上の状態更新）を反映する。

<!-- 追加の要件はユーザーのフィードバックにより反復追加する -->
```
