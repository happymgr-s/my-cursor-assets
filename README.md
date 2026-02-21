# happymgr/cursor-assets

自分のcursor用のnpmパッケージ

## コマンド

### 初期化（全てのアセットをインストール）

このリポジトリ内の全てのアセットをローカルにインストールする
既存のプロジェクト設定を汚染しないよう、.cursor/`<asset-type>`/globalにインストールする。

```bash
npx @happymgr/cursor-assets init
```

### アセット一覧取得

このリポジトリ内の全てのアセットの一覧を取得する。

```bash
npx @happymgr/cursor-assets ls
```

### 個別追加

アセットを指定してローカルにインストール

- アセット種別で一括追加

```bash
npx @happymgr/cursor-assets add <asset-type>
```

- 特定のアセットのみを追加

```bash
npx @happymgr/cursor-assets add <asset-type> <asset-name>
```

### このリポジトリに向けてPRを作成する

**このコマンドには `gh` CLI が必要です**
[Github CLI](https://docs.github.com/ja/github-cli/github-cli/about-github-cli)

ローカルで「熟成」させたアセットの変更分を、このリポジトリに向けてPRを作成します。

- 全ての変更をPR（.cursor/`<asset-type>`/global 内の全てのアセット）

```bash
npx @happymgr/cursor-assets pr
```

- アセット種別で指定してPR

```bash
npx @happymgr/cursor-assets pr <asset-type>
```

- 特定のアセットを指定してPR

```bash
npx @happymgr/cursor-assets pr <asset-type> <asset-name>
```
