# Requirements Document

## Introduction

ターン終了ボタンは、プレイヤーが UI から現在のターンを終了し、ゲームのアクティブプレイヤーを進めるための基本的な操作です。本ドキュメントはテスト可能な受け入れ基準（EARS 形式）を提供します。

## Requirements

### Requirement 1: UI 表示と操作可能性

**Objective:** プレイヤーとして、UI 上に明確な「ターン終了」ボタンが欲しい。これにより、プレイヤーはインターフェイスからターンを終了できる。

#### Acceptance Criteria

1. When ローカルプレイヤーのターンである, the Game UI shall 表示する 有効な `ターン終了` ボタン。
2. If ローカルプレイヤーのターンでない, the Game UI shall `ターン終了` ボタンを無効化して表示する。
3. The Game UI shall ボタンにキーボードフォーカス可能なアクセシブルな名前（例: `aria-label` のローカライズ値）を備える。

### Requirement 2: ターン終了の状態遷移

**Objective:** ゲームとして、プレイヤーのターン終了操作により正しくアクティブプレイヤーを進め、セッション履歴を記録したい。

#### Acceptance Criteria

1. When プレイヤーが `ターン終了` ボタンを操作した, the Turn Manager shall アクティブプレイヤーを次のプレイヤーに進める。
2. When プレイヤーが `ターン終了` ボタンを操作した, the Turn Manager shall セッション履歴に終了イベント（タイムスタンプ付き）を記録する。
3. If 未処理の必須アクションや妥当性チェックが存在してターン終了が許可されない場合, the Turn Manager shall アクティブプレイヤーを変更せず、Game UI shall ユーザ向けの説明的なメッセージを表示する。

### Requirement 3: 重複実行防止とフィードバック

**Objective:** プレイヤーの誤操作や二重送信を防ぎ、処理中のフィードバックを提供したい。

#### Acceptance Criteria

1. When `ターン終了` アクションが進行中である間, the Game UI shall ボタンを無効化し、進行中インジケータを表示する。
2. If `ターン終了` 処理が失敗した場合, the Game UI shall ボタンを再度有効化し、失敗理由を示すエラーメッセージを表示する。
3. The Turn Manager shall 同一ユーザ操作に対して一度だけアクティブプレイヤーを進める（冪等性）。

### Requirement 4: テスト性と可観測性（全体要件）

**Objective:** 自動テストと監査のために、操作と結果が確認できるようにしたい。

#### Acceptance Criteria

1. The Game UI shall DOM 上で `data-testid` か同等の識別子を提供し、UI テストからボタンの存在・状態を検証できること。
2. The Turn Manager shall ログまたはセッション履歴に十分なメタデータ（ユーザ ID、タイムスタンプ、イベントタイプ）を記録する。
3. The Game UI shall キーボード操作およびスクリーンリーダーで操作可能であることを満たす（アクセシビリティ基準）。

<!-- 追加の要件はユーザのフィードバック後に追記 -->
