# Tech

推奨技術スタック（本プロジェクトの公式方針）:

- **フロントエンド**: React + TypeScript + Vite — 主力の実装プラットフォームとして採用する。理由: コンポーネント設計が容易で再利用性が高く、TypeScript による型安全でルールの複雑化に耐えられるため。Vite は開発起動・ホットリロードが高速で、開発ループを短縮する。
- **状態管理**: 初期は軽量な `Zustand` を推奨し、要件と複雑さが増す場合は `Redux Toolkit` を検討する。
- **テスト**: ユニット/統合は `Vitest` + `@testing-library/react`（TDD ワークフローに適合）、E2E は `Playwright` を推奨。
- **ビルド/配布**: 静的ホスティング (Vercel/Netlify) を想定。将来的にサーバが必要になれば Node.js（Fastify/Express）を追加する。

品質指針:

- TypeScript を基本とし、ドメインモデルの型定義を重視する。
- 小さなコンポーネントと明確な契約（Props / State）で設計する。
- 自動テストを CI に組み込み、TDD を推奨する。
