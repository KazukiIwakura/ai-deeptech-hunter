# AI DeepTech Hunter 🔬

日本の大学・研究機関の最先端ディープテクノロジーを発見・分析するAIエージェント

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

## 🌟 主な機能

- **🔍 発見**: 投資ポテンシャルの高い新興ディープテック分野をAIが提案
- **📊 研究**: 日本の大学研究プロジェクトの自動検索・分析
- **🎯 詳細分析**: 潜在的インパクト、市場リスク、技術リスクを総合評価するVC式スコアリング
- **🌐 グローバル比較**: 類似技術分野の海外スタートアップとの比較分析
- **💬 対話型チャット**: 投資機会をより深く探求するAI搭載ディスカッション機能

## 🎯 対象ユーザー

- ベンチャーキャピタリスト・投資専門家
- テクノロジースカウト・イノベーション担当者
- ディープテック分野の研究者・アナリスト

## 🚀 クイックスタート

### 必要な環境

- **Node.js** (v18以上)
- **Google Gemini APIキー** ([こちらから取得](https://makersuite.google.com/app/apikey))

### 🔒 APIキーのセキュリティについて

**ご安心ください！あなたのAPIキーは完全に安全です：**

- ✅ **ローカル実行**: アプリケーションは完全にあなたのPC上で動作し、APIキーは外部サーバーに送信されません
- ✅ **直接通信**: Google Gemini APIとの通信は、あなたのブラウザから直接行われます
- ✅ **データ保存なし**: APIキーやリクエスト内容は一切保存・記録されません
- ✅ **オープンソース**: 全てのコードが公開されており、セキュリティを確認できます
- ✅ **Git除外設定**: `.env.local`ファイルは`.gitignore`で除外され、誤ってコミットされることはありません

### インストール手順

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/your-username/deep-tech-hunter.git
   cd deep-tech-hunter
   ```

2. **依存関係をインストール**
   ```bash
   npm install
   ```

3. **環境変数を設定**
   ```bash
   cp .env.local.example .env.local
   ```
   
   `.env.local`ファイルを編集してGemini APIキーを追加：
   ```env
   GEMINI_API_KEY=あなたのgemini_api_keyをここに入力
   ```
   
   > 💡 **重要**: `.env.local`ファイルはGitで管理されず、あなたのPC内にのみ保存されます

4. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

5. **ブラウザでアクセス**
   
   `http://localhost:5173` にアクセスして探索を開始！

## 🛠️ 技術スタック

- **フロントエンド**: React 19.1.0 + TypeScript
- **ビルドシステム**: Vite 6.2.0
- **AI統合**: Google Gemini AI (@google/genai v1.8.0)
- **状態管理**: Zustand 5.0.8
- **バリデーション**: Zod 3.23.8（スキーマ検証）
- **暗号化**: crypto-js 4.2.0
- **スタイリング**: Tailwind CSS

## 📁 プロジェクト構成

```
├── src/                    # ソースコードのルートディレクトリ
│   ├── components/         # 再利用可能なUIコンポーネント
│   │   ├── app/           # アプリケーションコアコンポーネント
│   │   ├── chat/          # チャットインターフェース
│   │   ├── common/        # 共通コンポーネント（Button、Cardなど）
│   │   ├── deepdive/      # 詳細分析コンポーネント
│   │   ├── icons/         # アイコンコンポーネント
│   │   ├── search/        # 検索・結果表示コンポーネント
│   │   └── ui/            # UI専用コンポーネント
│   ├── pages/             # トップレベルページコンポーネント
│   ├── contexts/          # React Contextプロバイダー
│   ├── hooks/             # カスタムReactフック
│   ├── services/          # 外部API統合
│   │   ├── gemini/        # Gemini AIサービスモジュール
│   │   │   ├── chat.ts    # チャット機能
│   │   │   ├── deepdive.ts # 詳細分析
│   │   │   ├── discovery.ts # 発見機能
│   │   │   ├── hunt.ts    # 検索機能
│   │   │   ├── overseas.ts # 海外スタートアップ比較
│   │   │   └── planning.ts # プランニング
│   │   └── quality/       # 品質管理・ベンチマーク
│   │       ├── optimizedValidator.ts # 最適化された品質評価
│   │       ├── cache.ts   # キャッシュ機構
│   │       └── benchmark.ts # ベンチマークツール
│   ├── stores/            # Zustand状態管理ストア
│   ├── types/             # TypeScript型定義
│   ├── utils/             # ユーティリティ関数
│   ├── config/            # アプリケーション設定
│   └── scripts/           # ビルド・テストスクリプト
├── public/                # 静的アセット
├── config.ts              # レガシー設定ファイル（後方互換性）
└── dist/                  # ビルド出力（自動生成）
```

## 🔧 利用可能なスクリプト

```bash
npm run dev              # 開発サーバーを起動
npm run build            # 本番用ビルド
npm run preview          # 本番ビルドをプレビュー
npm run test:performance # パフォーマンステストを実行
npm run benchmark:quality # 品質評価システムのベンチマークを実行
```

## 🎮 デモモード

**APIキーなしでも試せます！** モックデータを使ったデモモードが利用可能です。

### デモモードの使用方法

1. **アプリケーション起動時**: APIキーが設定されていない場合、自動的にデモモードで起動します
2. **UIから切り替え**: 設定画面からデモモードとAPIモードを切り替えることができます
3. **APIキー設定後**: APIキーを設定すると、自動的にAPIモードに切り替わります

> 💡 APIキーの取得前に、まずデモモードで機能を確認することをお勧めします。デモモードでは、実際のAPIコールを行わずにローカルのモックデータを使用します。

### APIキーの設定方法

アプリケーション内の設定画面から、以下の方法でAPIキーを設定できます：

1. **環境変数から読み込み**: `.env.local`ファイルに`GEMINI_API_KEY`を設定
2. **UIから直接入力**: 設定画面の「APIキー設定」タブから直接入力（ローカルストレージに保存）

> ⚠️ **注意**: APIキーはブラウザのローカルストレージに暗号化して保存されます。完全にローカルで管理され、外部サーバーには送信されません。

## 🔐 プライバシー・セキュリティ

### データの取り扱い

- **個人情報**: 一切収集・保存しません
- **検索履歴**: ローカルブラウザのみに保存され、外部送信されません
- **API通信**: あなたのブラウザ ↔ Google Gemini API の直接通信のみ
- **ログ**: サーバーログやアクセスログは存在しません（ローカル実行のため）

### APIキーの安全な管理

APIキーは以下の方法で設定・管理できます：

**方法1: 環境変数（推奨）**
```bash
# ✅ 正しい設定場所
.env.local              # ローカル環境変数（Git除外済み）
GEMINI_API_KEY=あなたのAPIキー
```

**方法2: UIから設定**
- アプリケーション内の設定画面から直接入力
- ローカルストレージに暗号化して保存されます

**❌ 絶対に避けるべき場所**
- `src/config.ts` - ソースコードに直接記述
- `README.md` - ドキュメントに記述
- `.env` - 通常の環境変数ファイル（Gitにコミットされる可能性）

### セキュリティ機能

- **自動Git除外**: `.gitignore`で`.env.local`を除外設定済み
- **暗号化保存**: APIキーは`crypto-js`で暗号化してローカルストレージに保存
- **型安全性**: TypeScriptによる実行時エラー防止
- **状態管理**: Zustandによる安全な状態管理
- **品質評価システム**: AI応答の品質を自動評価・検証
- **オープンソース**: 全コードが検証可能

### 品質評価システム

本アプリケーションには、AI応答の品質を評価する高度なシステムが組み込まれています：

- **最適化された品質評価**: 並列処理、キャッシュ、段階的評価による高速化
- **ソース信頼性評価**: 情報源の信頼性を自動評価
- **パフォーマンス監視**: 処理時間、キャッシュヒット率などのメトリクス収集
- **ベンチマーク機能**: 品質評価システムのパフォーマンスを測定

詳細は[品質評価システムのREADME](src/services/quality/README.md)をご覧ください。

## 🤝 コントリビューション

コントリビューションを歓迎します！詳細は[コントリビューションガイドライン](CONTRIBUTING.md)をご覧ください。

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/素晴らしい機能`)
3. 変更をコミット (`git commit -m '素晴らしい機能を追加'`)
4. ブランチにプッシュ (`git push origin feature/素晴らしい機能`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルをご覧ください。

## 🙏 謝辞

- [Google Gemini AI](https://ai.google.dev/)で構築
- [React](https://reactjs.org/)と[Vite](https://vitejs.dev/)で動作
- [Zustand](https://github.com/pmndrs/zustand)で状態管理
- アイコンは[Lucide React](https://lucide.dev/)を使用

## 📞 サポート

ご質問やサポートが必要な場合：

- 📧 [Issue](https://github.com/your-username/deep-tech-hunter/issues)を作成
- 💬 [Discussion](https://github.com/your-username/deep-tech-hunter/discussions)を開始
- 📖 [ドキュメント](docs/)をチェック

---

**ディープテック投資コミュニティのために ❤️ で作成**
