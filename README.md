# すみれさば Discord - 公式ホームページ

ゲームから開発まで、多彩なコミュニティを提供するDiscordサーバー「すみれさば」の公式ホームページです。

## 🚀 技術スタック

- **Vue.js 3.5.22** - Progressive JavaScript Framework
- **TypeScript** - 型安全な開発
- **Vite** - 次世代フロントエンドツール
- **Vue Router 4** - 公式ルーティングライブラリ
- **Tailwind CSS 4** - ユーティリティファーストCSS
- **Material Design 3 Expressive** - デザインシステム
- **VueUse** - Vue Composition API ユーティリティ
- **unplugin-vue-markdown** - Markdown統合

## ✨ 機能

### Home タブ
- 美しいヒーローセクション
- Discordサーバー参加ボタン
- お知らせセクション（Markdown形式）
- 新しい順に自動ソート

### Labs タブ
- GitHub APIによるリポジトリ一覧表示
- リアルタイム検索機能
- 更新日時順ソート
- スター数、言語、ライセンス表示

### 共通機能
- ダークモード / ライトモード切り替え
- レスポンシブデザイン（モバイル対応）
- ハンバーガーメニューによる統合ナビゲーション
- Material Design 3準拠のUI/UX

## 📦 セットアップ

### 必要要件
- Node.js 18.x 以上
- npm または yarn

### インストール

\`\`\`bash
npm install
\`\`\`

### 開発サーバー起動

\`\`\`bash
npm run dev
\`\`\`

http://localhost:5173 でアクセス可能になります。

### ビルド

\`\`\`bash
npm run build
\`\`\`

ビルド成果物は `dist/` ディレクトリに出力されます。

### プレビュー

\`\`\`bash
npm run preview
\`\`\`

## 📝 お知らせの追加方法

1. `docs/announcements/` ディレクトリに新しいMarkdownファイルを作成
2. ファイル名は `YYYY-MM-DD-title.md` 形式にする（例: `2025-01-20-welcome.md`）
3. Markdown形式で内容を記述

### お知らせファイル例

\`\`\`markdown
# タイトル

お知らせ内容をMarkdown形式で記述します。

## セクション

- リスト項目1
- リスト項目2

**太字**や[リンク](https://example.com)も使えます。
\`\`\`

ファイルを追加すると、自動的にホームページに反映されます。

## 🚀 Vercelデプロイ

このプロジェクトはVercelでホスティングされています。

### 自動デプロイ
- `main` ブランチへのプッシュで自動デプロイ
- Pull Request作成でプレビューデプロイ

### 手動デプロイ

\`\`\`bash
npm run build
vercel --prod
\`\`\`

## 🔗 リンク

- [Discord](https://discord.gg/H8eh2hR79e)
- [GitHub Organization](https://github.com/Sumire-Labs)
- [YouTube](https://youtu.be/qL31ZOqiXvc?si=8WSmLQS5iLT3AC0s)

## 📄 ライセンス

© 2025 Sumire Labs. All rights reserved.
