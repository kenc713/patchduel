# Structure

プロジェクト構成のガイドライン（パターン）:

- **Feature-first, Component-led**: 機能単位でディレクトリを分け、コンポーネント・状態・モデルを近接配置する。例: `src/features/board/` に `Board` コンポーネント、`boardState`、`timeMarker` 型を置く。
- **型中心のドメインモデル**: `src/models/` にドメイン型（`TimeMarker` など）を置き、UI と状態管理はこれらの型を参照して実装する。
- **状態管理**: 小規模段階では `src/state/` にシンプルなストア、拡張時は `src/state/slices/` に分割して管理する。
- **テスト配置**: 単体/統合は `src/**/__tests__/`、E2E は `tests/e2e/` に配置する。
- **テスト配置**: 単体/統合は `src/**/__tests__/`、E2E は `tests/e2e/` に配置する。

注: このリポジトリでは `tests/` にユニット／統合テストと軽量の E2E スモーク（`tests/e2e.smoke.test.tsx`）を配置しています。将来的なフルブラウザ E2E を導入する場合は `tests/e2e/playwright/` 等に分離することを推奨します。

- **設定とスクリプト**: プロジェクトルートに `package.json`、`vite.config.ts`、`tsconfig.json` を置き、CI 設定は `.github/workflows/` に追加する。

命名と慣習:

- コンポーネントは `UpperCamelCase`、ファイルはコンポーネント名と一致させる（例: `Board.tsx`）。
- CSS モジュールや scoped スタイルを推奨し、スタイルの責務をコンポーネントに限定する。

更新方針:

- 新しいパターンや重大な構造変更が発生したら `structure.md` を追記で更新する（既存の記述は原則保持）。
