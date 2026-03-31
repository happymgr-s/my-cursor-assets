# Clean Architecture References: コンポーネントパッケージング

## 書籍における位置づけ

書籍『Clean Architecture』では、パッケージングは「同心円の形を守ること」ではなく、**変更の理由**と**依存方向**を守るための設計判断として扱われる。重要なのは次の 2 点である。

- ビジネスルールに関わるコードを、実装詳細の変更から隔離する
- 依存を内側（方針）へ向ける

以下は、この Skill で採用する**独自の運用原則**である。書籍が列挙するパターンのうち、レイヤー分割は採用しない。

---

## 運用原則（この Skill の見解）

### レイヤーパッケージングは原則禁止

`controllers/`、`services/`、`repositories/` のように**技術的役割だけで並べるトップレベル分割**は採用しない。変更理由が異なるコードが横並びになり、薄い委譲や DTO 変換だけが増えやすいからである。

### コンポーネントごとのパッケージングを基本とする

境界は**コンポーネント**（変更理由とライフサイクルがそろう単位）で切る。各コンポーネントは、**外向きに公開するのはインターフェース（契約）に限定**する。実装詳細はコンポーネント内に閉じる。

### `shared` などの安易な共有ディレクトリは原則禁止

「どこに置くかわからないから shared」は、境界の設計を先送りにしているサインである。原則として置かない。

### 境界を横断しなければならないときは、まず境界の切り方を疑う

複数コンポーネントから同じコードが欲しくなったとき、いきなり共有置き場を作らない。**コンポーネントの分割が粗すぎないか**、**本当に別コンポーネントか**、**依存方向は妥当か**を見直す。それでも残る「本当に横断的な契約」だけを、最小の形で別コンポーネント（例: 狭いドメインカーネル）として切り出す判断をする。

---

## コンポーネントの中身（Ports / Adapters の扱い）

書籍の Ports and Adapters は、**リポジトリ全体を `adapters/` と `ports/` の二階建てにする**ことと同義ではない。依存性逆転が必要な**接点**では、コンポーネント内部またはコンポーネント同士の契約としてインターフェースを置く。機械的に全層に interface を挟まない。

---

## 実務での決め方

1. 依存方向を固定する（内側の方針が外側の詳細に依存しない）
2. 変更理由でコンポーネントを切る
3. 各コンポーネントは外向き API をインターフェースに限定する
4. 横断の必要性が出たら、共有フォルダではなく**境界の再設計**を優先する

---

## ディレクトリ構造例（言語別）

「コンポーネント名がトップに並ぶ」形は共通。公開 API を最小にする手段は言語ごとに異なる。

### Go（`internal/` パッケージで実装詳細を隠蔽）

```txt
components/
  translate/
    contract.go      # 外向き: インターフェース・DTO 契約のみ（public）
    internal/
      service.go     # package-private: 実装詳細
      adapter.go
  usage/
    contract.go
    internal/
      ...
```

Go では `internal/` に置いたコードは同パッケージ外から直接 import できないため、言語レベルで境界を強制できる。

### Java（コンポーネント内を `domain / application / adapter` で整理）

```txt
com.example.app/
  order/
    domain/
      Order.java              # ドメインモデル
      OrderRepository.java    # Port (interface) — ドメイン層が所有
    application/
      CreateOrderUseCase.java # ユースケース（プレーンなクラス）
      CreateOrderCommand.java
    adapter/
      in/
        OrderController.java  # HTTP ハンドラ
      out/
        JpaOrderRepository.java  # Port の実装 (Adapter)
        OrderJpaEntity.java
  shipping/
    domain/
      ...
    application/
      ...
    adapter/
      ...
```

コンポーネント外に公開するのは `domain/` の Port（interface）と型のみ。`application/` と `adapter/` は外部から直接参照しない。ArchUnit 等で依存ルールをテストで強制する運用が現実的。

### Python（`__init__.py` の re-export で公開 API を制御）

```txt
app/
  order/
    __init__.py       # 公開 API: OrderRepository, CreateOrderUseCase のみ re-export
    domain/
      model.py        # ドメインモデル
      repository.py   # Port (Protocol / ABC)
    application/
      create_order.py # ユースケース
    adapter/
      repository_impl.py  # Adapter（SQLAlchemy 等）
  shipping/
    __init__.py
    ...
```

`__init__.py` から re-export しないシンボルは外部から直接 import させない。`adapter/` 内のモジュールは公開しない。

### TypeScript（`index.ts` barrel export で公開 API を制御）

```txt
src/
  order/
    index.ts              # 公開 API: re-export（ここだけ外から import する）
    order-repository.ts   # Port (interface / type)
    create-order.ts       # ユースケース
    adapters/
      jpa-order-repository.ts  # Adapter（実装詳細）
  shipping/
    index.ts
    ...
```

`adapters/` 内のファイルは `index.ts` で re-export しない。ESLint ルール（`no-restricted-imports` 等）で `adapters/` への直接 import を禁止できる。

---

## 「shared に逃げない」判断の具体シナリオ

### シナリオ A: 複数コンポーネントが同じバリデーションロジックを必要とする

**Before（悪い例）**

```txt
shared/
  validation/
    email-validator.ts   # order/ と user/ 両方が import
order/
  ...
user/
  ...
```

`shared` に逃げているが、実は `order` と `user` が一緒に変更される理由があった。

**After（再設計）**

コンポーネントの分割が粗すぎた。`order` の中に「注文者情報」という責務が混在していたため、
`customer/` を独立コンポーネントとして切り出す。バリデーションは `customer/` 内に収まる。

```txt
customer/
  index.ts               # CustomerEmail 型, validateEmail を公開
  ...
order/
  ...                    # customer/ の公開 API だけに依存
```

---

### シナリオ B: 日付フォーマットユーティリティをどこに置くか

**判断基準**: どのドメインにも帰属せず、ビジネスルールを持たない純粋な技術ユーティリティか？

- `formatDate`（タイムゾーン変換・ロケール対応なし）→ **`lib/`** に配置が妥当
- `formatOrderDeadline`（ビジネスルールが入っている）→ **`order/` 内** に配置

`lib/` は「本当にどのドメインにも属さない汎用コード」の最後の避難場所。
ビジネスルールを含む瞬間に `order/` 等のコンポーネントに移動する。

---

### シナリオ C: 通知送信ロジックを複数コンポーネントが使う

**Before（悪い例）**

```txt
shared/
  notification/
    send-notification.ts   # order/, payment/, shipping/ が直接 import
```

**After（通知を独立コンポーネントとして切り出す）**

```txt
notification/
  index.ts               # NotificationService (interface) のみ公開
  internal/
    email-notification-service.ts   # Adapter
    push-notification-service.ts    # Adapter
order/
  ...                    # notification/ の interface に依存（DI で解決）
payment/
  ...
shipping/
  ...
```

`shared` への配置ではなく「通知」という独立ドメインとして切り出すことで、
通知手段の変更（email → push）が他コンポーネントに波及しない。

---

## コンポーネント間の依存管理

### 公開契約の最小化

各コンポーネントが外に公開するのは **interface（Port）・型・ファクトリ**のみ。
実装クラス・内部ヘルパー・Adapter は外から見えない。

```
order/index.ts        → OrderService(interface), OrderId(型)  ← これだけ公開
order/internal/       → OrderServiceImpl, JpaOrderRepository  ← 外から触れない
```

### 循環依存の検出と解消

`order/ → payment/ → order/` のような循環が発生したら、境界の再設計が必要なサイン。

解消パターン:
1. **共通型を第三のコンポーネントへ抽出**: 両者が依存していた型だけを `domain-kernel/` に移す
2. **依存方向を反転（DIP）**: 一方を interface 越しに参照させ、循環を断ち切る
3. **コンポーネントを統合**: 実は同じ変更理由でまとめてよかった → 合体

### 依存方向の原則

より**安定した（変更頻度の低い）**コンポーネントに依存する。

```
変更頻度: 高               →              低
UI コンポーネント  →  ユースケース  →  ドメインモデル
```

外側から内側への一方向。内側は外側を知らない。

---

## 「コンポーネントの分割が粗すぎる」を判断する基準

以下の兆候が1つでも当てはまれば、分割を検討する。

| 兆候 | 意味 |
|---|---|
| 変更理由が複数ある | SRP 違反。責務が混在している |
| コンポーネント内の一部だけが頻繁に変更される | 変更頻度の異なる責務が同居している |
| テストのセットアップが複雑すぎる | 依存が多すぎる。責務が広い |
| コンポーネントの責務を一文で説明できない | 境界が曖昧なサイン |
| 他コンポーネントとのインターフェースが多すぎる | 結合が強すぎる |

逆に**分割しすぎ**のサインも認識する:

- 1コンポーネントに 1〜2 ファイルしかない状態が続く
- コンポーネント間の依存が多く、変更が常に連鎖する
- テストのためだけに interface を挟んでいる（実装が1つしかない）

---

## 補足: Screaming Architecture

トップレベルが `controllers` や `orm` ではなく、**何のユースケース・ドメインか**がディレクトリ名から読める形は、この原則と両立する。コンポーネント名がその「叫び」になりうる。

```txt
src/
  order/       ← 「注文」が叫ばれている
  payment/     ← 「決済」が叫ばれている
  shipping/    ← 「配送」が叫ばれている
  notification/
  lib/         ← 技術ユーティリティ（最小限）
```

`controllers/`, `services/`, `repositories/` が叫ばれているリポジトリは、
「技術スタック」を叫んでいる。ドメインが見えない。
