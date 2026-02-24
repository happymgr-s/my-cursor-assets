---
name: ui-ux-pro-max
description: "UI/UXデザインインテリジェンス。50スタイル、21カラーパレット、50フォントペアリング、20チャート、9スタック（React、Next.js、Vue、Svelte、SwiftUI、React Native、Flutter、Tailwind、shadcn/ui）。アクション: plan、build、create、design、implement、review、fix、improve、optimize、enhance、refactor、UI/UXコードのチェック。プロジェクト: website、landing page、dashboard、admin panel、e-commerce、SaaS、portfolio、blog、mobile app、.html、.tsx、.vue、.svelte。要素: button、modal、navbar、sidebar、card、table、form、chart。スタイル: glassmorphism、claymorphism、minimalism、brutalism、neumorphism、bento grid、dark mode、responsive、skeuomorphism、flat design。トピック: color palette、accessibility、animation、layout、typography、font pairing、spacing、hover、shadow、gradient。統合: shadcn/ui MCP によるコンポーネント検索と例示。"
---

# UI/UX Pro Max - デザインインテリジェンス

Webおよびモバイルアプリケーション向けの包括的なデザインガイド。50以上のスタイル、97のカラーパレット、57のフォントペアリング、99のUXガイドライン、9つの技術スタックにまたがる25のチャートタイプを収録。優先度ベースの推奨事項を持つ検索可能なデータベース。

## 適用タイミング

以下の場合にこれらのガイドラインを参照してください:
- 新しいUIコンポーネントやページを設計する
- カラーパレットとタイポグラフィを選択する
- UX問題についてコードをレビューする
- ランディングページやダッシュボードを構築する
- アクセシビリティ要件を実装する

## 優先度別のルールカテゴリー

| 優先度 | カテゴリー | 影響度 | ドメイン |
|----------|----------|--------|--------|
| 1 | アクセシビリティ | CRITICAL | `ux` |
| 2 | タッチ & インタラクション | CRITICAL | `ux` |
| 3 | パフォーマンス | HIGH | `ux` |
| 4 | レイアウト & レスポンシブ | HIGH | `ux` |
| 5 | タイポグラフィ & カラー | MEDIUM | `typography`, `color` |
| 6 | アニメーション | MEDIUM | `ux` |
| 7 | スタイル選択 | MEDIUM | `style`, `product` |
| 8 | チャート & データ | LOW | `chart` |

## クイックリファレンス

### 1. アクセシビリティ (CRITICAL)

- `color-contrast` - 通常テキストに対して最低4.5:1のコントラスト比
- `focus-states` - インタラクティブ要素に視認可能なフォーカスリング
- `alt-text` - 意味のある画像に対する説明的なaltテキスト
- `aria-labels` - アイコンのみのボタンにaria-labelを設定
- `keyboard-nav` - タブ順序を視覚的な順序と一致させる
- `form-labels` - for属性を持つlabelを使用

### 2. タッチ & インタラクション (CRITICAL)

- `touch-target-size` - タッチターゲットは最低44x44px
- `hover-vs-tap` - 主要なインタラクションにはclick/tapを使用
- `loading-buttons` - 非同期操作中はボタンを無効化
- `error-feedback` - 問題の近くに明確なエラーメッセージを表示
- `cursor-pointer` - クリック可能な要素にcursor-pointerを追加

### 3. パフォーマンス (HIGH)

- `image-optimization` - WebP、srcset、遅延読み込みを使用
- `reduced-motion` - prefers-reduced-motionをチェック
- `content-jumping` - 非同期コンテンツ用のスペースを確保

### 4. レイアウト & レスポンシブ (HIGH)

- `viewport-meta` - width=device-width initial-scale=1
- `readable-font-size` - モバイルでの本文テキストは最低16px
- `horizontal-scroll` - コンテンツをビューポート幅に収める
- `z-index-management` - z-indexスケールを定義 (10, 20, 30, 50)

### 5. タイポグラフィ & カラー (MEDIUM)

- `line-height` - 本文テキストには1.5-1.75を使用
- `line-length` - 1行あたり65-75文字に制限
- `font-pairing` - 見出しと本文のフォントの個性を一致させる

### 6. アニメーション (MEDIUM)

- `duration-timing` - マイクロインタラクションには150-300msを使用
- `transform-performance` - width/heightではなくtransform/opacityを使用
- `loading-states` - スケルトンスクリーンまたはスピナー

### 7. スタイル選択 (MEDIUM)

- `style-match` - スタイルをプロダクトタイプに合わせる
- `consistency` - すべてのページで同じスタイルを使用
- `no-emoji-icons` - 絵文字ではなくSVGアイコンを使用

### 8. チャート & データ (LOW)

- `chart-type` - チャートタイプをデータタイプに合わせる
- `color-guidance` - アクセシブルなカラーパレットを使用
- `data-table` - アクセシビリティのためにテーブル代替を提供

## 使い方

以下のCLIツールを使用して特定のドメインを検索します。

---

## 前提条件

Pythonがインストールされているか確認:

```bash
python3 --version || python --version
```

Pythonがインストールされていない場合は、ユーザーのOSに基づいてインストール:

**macOS:**
```bash
brew install python3
```

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install python3
```

**Windows:**
```powershell
winget install Python.Python.3.12
```

---

## このスキルの使い方

ユーザーがUI/UXの作業（design、build、create、implement、review、fix、improve）をリクエストした場合、このワークフローに従う:

### ステップ1: ユーザー要件を分析

ユーザーのリクエストから主要な情報を抽出:
- **プロダクトタイプ**: SaaS、e-commerce、portfolio、dashboard、landing page など
- **スタイルキーワード**: minimal、playful、professional、elegant、dark mode など
- **業界**: healthcare、fintech、gaming、education など
- **スタック**: React、Vue、Next.js、またはデフォルトで `html-tailwind`

### ステップ2: デザインシステムを生成（必須）

**常に `--design-system` から始める** ことで、理由付きの包括的な推奨事項を取得:

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

このコマンドは:
1. 5つのドメインを並列検索 (product、style、color、landing、typography)
2. `ui-reasoning.csv` の推論ルールを適用して最適なマッチを選択
3. 完全なデザインシステムを返す: パターン、スタイル、カラー、タイポグラフィ、エフェクト
4. 避けるべきアンチパターンを含む

**例:**
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness service" --design-system -p "Serenity Spa"
```

### ステップ2b: デザインシステムを永続化（Master + Overridesパターン）

**セッション間での階層的取得**のためにデザインシステムを保存するには、`--persist` を追加:

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

これにより作成されるもの:
- `design-system/MASTER.md` — すべてのデザインルールを持つグローバルな信頼できる情報源
- `design-system/pages/` — ページ固有のオーバーライド用フォルダー

**ページ固有のオーバーライド付き:**
```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name" --page "dashboard"
```

これにより追加で作成されるもの:
- `design-system/pages/dashboard.md` — Masterからのページ固有の逸脱

**階層的取得の仕組み:**
1. 特定のページ（例: "Checkout"）を構築する際、まず `design-system/pages/checkout.md` を確認
2. ページファイルが存在する場合、そのルールがMasterファイルを**オーバーライド**
3. 存在しない場合、`design-system/MASTER.md` のみを使用

**コンテキスト認識型取得プロンプト:**
```
[Page Name] ページを構築しています。design-system/MASTER.md を読んでください。
design-system/pages/[page-name].md が存在するかも確認してください。
ページファイルが存在する場合、そのルールを優先してください。
存在しない場合、Masterルールのみを使用してください。
さあ、コードを生成してください...
```

### ステップ3: 詳細検索で補完（必要に応じて）

デザインシステムを取得した後、ドメイン検索を使用して追加の詳細を取得:

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

**詳細検索を使用するタイミング:**

| 必要なもの | ドメイン | 例 |
|------|--------|---------|
| より多くのスタイルオプション | `style` | `--domain style "glassmorphism dark"` |
| チャートの推奨事項 | `chart` | `--domain chart "real-time dashboard"` |
| UXベストプラクティス | `ux` | `--domain ux "animation accessibility"` |
| 代替フォント | `typography` | `--domain typography "elegant luxury"` |
| ランディング構造 | `landing` | `--domain landing "hero social-proof"` |

### ステップ4: スタックガイドライン（デフォルト: html-tailwind）

実装固有のベストプラクティスを取得。ユーザーがスタックを指定しない場合、**デフォルトで `html-tailwind` を使用**。

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "<keyword>" --stack html-tailwind
```

利用可能なスタック: `html-tailwind`、`react`、`nextjs`、`vue`、`svelte`、`swiftui`、`react-native`、`flutter`、`shadcn`、`jetpack-compose`

---

## 検索リファレンス

### 利用可能なドメイン

| ドメイン | 用途 | キーワード例 |
|--------|---------|------------------|
| `product` | プロダクトタイプの推奨 | SaaS, e-commerce, portfolio, healthcare, beauty, service |
| `style` | UIスタイル、カラー、エフェクト | glassmorphism, minimalism, dark mode, brutalism |
| `typography` | フォントペアリング、Google Fonts | elegant, playful, professional, modern |
| `color` | プロダクトタイプ別カラーパレット | saas, ecommerce, healthcare, beauty, fintech, service |
| `landing` | ページ構造、CTA戦略 | hero, hero-centric, testimonial, pricing, social-proof |
| `chart` | チャートタイプ、ライブラリ推奨 | trend, comparison, timeline, funnel, pie |
| `ux` | ベストプラクティス、アンチパターン | animation, accessibility, z-index, loading |
| `react` | React/Next.jsパフォーマンス | waterfall, bundle, suspense, memo, rerender, cache |
| `web` | Webインターフェースガイドライン | aria, focus, keyboard, semantic, virtualize |
| `prompt` | AIプロンプト、CSSキーワード | (スタイル名) |

### 利用可能なスタック

| スタック | フォーカス |
|-------|-------|
| `html-tailwind` | Tailwindユーティリティ、レスポンシブ、a11y（デフォルト） |
| `react` | State、hooks、パフォーマンス、パターン |
| `nextjs` | SSR、ルーティング、画像、APIルート |
| `vue` | Composition API、Pinia、Vue Router |
| `svelte` | Runes、stores、SvelteKit |
| `swiftui` | Views、State、Navigation、Animation |
| `react-native` | Components、Navigation、Lists |
| `flutter` | Widgets、State、Layout、Theming |
| `shadcn` | shadcn/uiコンポーネント、テーマ、フォーム、パターン |
| `jetpack-compose` | Composables、Modifiers、State Hoisting、Recomposition |

---

## ワークフロー例

**ユーザーのリクエスト:** "プロフェッショナルなスキンケアサービスのランディングページを作る"

### ステップ1: 要件を分析
- プロダクトタイプ: Beauty/Spa service
- スタイルキーワード: elegant、professional、soft
- 業界: Beauty/Wellness
- スタック: html-tailwind（デフォルト）

### ステップ2: デザインシステムを生成（必須）

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness service elegant" --design-system -p "Serenity Spa"
```

**出力:** パターン、スタイル、カラー、タイポグラフィ、エフェクト、アンチパターンを含む完全なデザインシステム。

### ステップ3: 詳細検索で補完（必要に応じて）

```bash
# アニメーションとアクセシビリティのUXガイドラインを取得
python3 skills/ui-ux-pro-max/scripts/search.py "animation accessibility" --domain ux

# 必要に応じて代替タイポグラフィオプションを取得
python3 skills/ui-ux-pro-max/scripts/search.py "elegant luxury serif" --domain typography
```

### ステップ4: スタックガイドライン

```bash
python3 skills/ui-ux-pro-max/scripts/search.py "layout responsive form" --stack html-tailwind
```

**その後:** デザインシステム + 詳細検索を統合してデザインを実装。

---

## 出力フォーマット

`--design-system` フラグは2つの出力フォーマットをサポート:

```bash
# ASCIIボックス（デフォルト） - ターミナル表示に最適
python3 skills/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system

# Markdown - ドキュメント化に最適
python3 skills/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system -f markdown
```

---

## より良い結果を得るためのヒント

1. **キーワードを具体的に** - "healthcare SaaS dashboard" > "app"
2. **複数回検索** - 異なるキーワードで異なる洞察が得られる
3. **ドメインを組み合わせる** - Style + Typography + Color = 完全なデザインシステム
4. **常にUXを確認** - "animation"、"z-index"、"accessibility" を検索して一般的な問題を確認
5. **スタックフラグを使用** - 実装固有のベストプラクティスを取得
6. **繰り返す** - 最初の検索が一致しない場合、異なるキーワードを試す

---

## プロフェッショナルなUIのための共通ルール

UIを素人っぽく見せる、よく見落とされる問題:

### アイコン & ビジュアル要素

| ルール | 推奨 | 非推奨 |
|------|----|----- |
| **絵文字アイコンを使わない** | SVGアイコンを使用（Heroicons、Lucide、Simple Icons） | 🎨 🚀 ⚙️ のような絵文字をUIアイコンとして使用 |
| **安定したホバー状態** | ホバー時にカラー/不透明度のトランジションを使用 | レイアウトをずらすスケール変換を使用 |
| **正しいブランドロゴ** | Simple Iconsから公式SVGをリサーチ | 推測または誤ったロゴパスを使用 |
| **一貫したアイコンサイズ** | w-6 h-6 で固定viewBox（24x24）を使用 | 異なるアイコンサイズをランダムに混在 |

### インタラクション & カーソル

| ルール | 推奨 | 非推奨 |
|------|----|----- |
| **カーソルポインター** | すべてのクリック可能/ホバー可能なカードに `cursor-pointer` を追加 | インタラクティブ要素にデフォルトカーソルを残す |
| **ホバーフィードバック** | 視覚的フィードバックを提供（カラー、シャドウ、ボーダー） | 要素がインタラクティブであることの表示なし |
| **スムーズなトランジション** | `transition-colors duration-200` を使用 | 即座の状態変化または遅すぎる（>500ms） |

### ライト/ダークモードのコントラスト

| ルール | 推奨 | 非推奨 |
|------|----|----- |
| **ライトモードのグラスカード** | `bg-white/80` 以上の不透明度を使用 | `bg-white/10`（透明すぎる）を使用 |
| **ライトモードのテキストコントラスト** | テキストに `#0F172A`（slate-900）を使用 | 本文テキストに `#94A3B8`（slate-400）を使用 |
| **ライトモードの控えめなテキスト** | 最低でも `#475569`（slate-600）を使用 | gray-400 以下を使用 |
| **ボーダーの視認性** | ライトモードで `border-gray-200` を使用 | `border-white/10`（見えない）を使用 |

### レイアウト & スペーシング

| ルール | 推奨 | 非推奨 |
|------|----|----- |
| **フローティングナビゲーションバー** | `top-4 left-4 right-4` のスペーシングを追加 | ナビゲーションバーを `top-0 left-0 right-0` に固定 |
| **コンテンツパディング** | 固定ナビゲーションバーの高さを考慮 | 固定要素の後ろにコンテンツを隠す |
| **一貫したmax-width** | 同じ `max-w-6xl` または `max-w-7xl` を使用 | 異なるコンテナ幅を混在 |

---

## デリバリー前チェックリスト

UIコードを納品する前に、これらの項目を確認:

### 視覚的品質
- [ ] アイコンとして絵文字を使用していない（代わりにSVGを使用）
- [ ] すべてのアイコンが一貫したアイコンセットから（Heroicons/Lucide）
- [ ] ブランドロゴが正しい（Simple Iconsから確認）
- [ ] ホバー状態がレイアウトシフトを引き起こさない
- [ ] テーマカラーを直接使用（bg-primary）、var()ラッパーは使用しない

### インタラクション
- [ ] すべてのクリック可能要素に `cursor-pointer` がある
- [ ] ホバー状態が明確な視覚的フィードバックを提供
- [ ] トランジションがスムーズ（150-300ms）
- [ ] キーボードナビゲーション用のフォーカス状態が視認可能

### ライト/ダークモード
- [ ] ライトモードのテキストが十分なコントラストを持つ（最低4.5:1）
- [ ] グラス/透明要素がライトモードで視認可能
- [ ] 両モードでボーダーが視認可能
- [ ] デリバリー前に両モードをテスト

### レイアウト
- [ ] フローティング要素がエッジから適切なスペーシングを持つ
- [ ] 固定ナビゲーションバーの後ろにコンテンツが隠れていない
- [ ] 375px、768px、1024px、1440pxでレスポンシブ
- [ ] モバイルで横スクロールがない

### アクセシビリティ
- [ ] すべての画像にaltテキストがある
- [ ] フォーム入力にラベルがある
- [ ] カラーが唯一の指標ではない
- [ ] `prefers-reduced-motion` が尊重されている
