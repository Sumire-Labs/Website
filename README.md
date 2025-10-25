# すみれさばホームページ

Discordサーバー「すみれさば」の公式ホームページです。

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
