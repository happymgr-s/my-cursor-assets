# 横断的関心事の扱い方

ログ、認証/認可、エラーハンドリング、トランザクション管理などの横断的関心事（Cross-Cutting Concerns）は、複数のレイヤーやコンポーネントに影響する。クリーンアーキテクチャの原則と衝突しやすい領域であり、配置を間違えるとビジネスルールに実装詳細が侵入する。

---

## 核心: 横断的関心事はビジネスルールではない

横断的関心事の多くは**インフラストラクチャの関心**であり、ビジネスルールの内側に配置してはならない。ただし、ビジネスルールが「何を記録すべきか」「誰に許可するか」を決定する場合、その**判断ロジック**はビジネスルール側に属する。

```
判断（何を/誰を） → 内側（ビジネスルール）
実行（どうやって） → 外側（実装詳細）
```

---

## パターン別の配置原則

### 1. ログ / 監査

| 関心 | 配置 | 理由 |
|---|---|---|
| 「何をログに残すか」の判断 | ビジネスルール | ドメインの要件 |
| ログの出力先・フォーマット | 実装詳細（外側） | 技術的選択 |
| リクエスト/レスポンスの自動ログ | フレームワーク層（ミドルウェア等） | ビジネスルールに無関係 |

**原則**: ユースケースの中に `logger.info(...)` を直接書かない。ログが必要なイベントをドメインイベントや戻り値として表現し、外側でログに変換する。

### Before（違反）

```python
class CreateOrderUseCase:
    def execute(self, order):
        logger.info(f"注文作成開始: {order.customer_id}")
        saved = self.order_repo.save(order)
        logger.info(f"注文作成完了: {saved.id}")
        return saved
```

### After（適切）

```python
class CreateOrderUseCase:
    def execute(self, order):
        saved = self.order_repo.save(order)
        return saved

# 外側（ミドルウェアやデコレータ）でログを処理
@log_usecase_execution
async def create_order_handler(request):
    order = CreateOrderUseCase(repo).execute(parse_order(request))
    return to_response(order)
```

ただし、**監査ログのようにビジネス要件として「この操作を記録すること」が求められる場合**は、ユースケースがその事実を外側に伝える手段（イベント発行、Port経由の通知）を持つのは正当。

---

### 2. 認証 / 認可

| 関心 | 配置 | 理由 |
|---|---|---|
| 「このユーザーは誰か」（認証） | フレームワーク層（ミドルウェア） | ビジネスルールの前段 |
| 「このユーザーはこの操作を許可されているか」（認可） | 状況による（下記参照） | |

認可の配置は、その認可ルールの性質で変わる:

- **技術的なアクセス制御**（ロールベース、エンドポイント単位のガード）→ フレームワーク層
- **ビジネスルールとしての認可**（「自分が作成した注文のみキャンセルできる」）→ ユースケース / ドメインロジック

### Before（違反）

```typescript
// ビジネスルールとしての認可がミドルウェアにある
function authMiddleware(req, res, next) {
  const order = db.findOrder(req.params.orderId);
  if (order.createdBy !== req.user.id) {
    return res.status(403).json({ error: "権限がありません" });
  }
  next();
}
```

### After（適切）

```typescript
// ビジネスルールとしての認可はユースケース内
class CancelOrderUseCase {
  execute(orderId: string, requestedBy: string): Order {
    const order = this.orderRepo.findById(orderId);
    if (!order.canBeCancelledBy(requestedBy)) {
      throw new UnauthorizedOperationError("自身の注文のみキャンセル可能です");
    }
    return this.orderRepo.save(order.cancel());
  }
}
```

---

### 3. エラーハンドリング

| 関心 | 配置 | 理由 |
|---|---|---|
| ドメイン固有の例外定義 | ビジネスルール（内側） | ドメインの語彙 |
| 例外から HTTP ステータスへの変換 | フレームワーク層 | 実装詳細 |
| リトライ・フォールバック戦略 | 実装詳細（外側） | 技術的選択 |

**原則**: ビジネスルールは自身の例外を投げる。その例外をどのプロトコルでどう返すかは外側が決める。

### Before（違反）

```java
public class CreateOrderUseCase {
    public Order execute(Order order) {
        if (order.getItems().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "注文には1つ以上の商品が必要です");
        }
        return orderRepo.save(order);
    }
}
```

### After（適切）

```java
// 内側: ドメイン例外
public class CreateOrderUseCase {
    public Order execute(Order order) {
        if (order.getItems().isEmpty()) {
            throw new EmptyOrderException("注文には1つ以上の商品が必要です");
        }
        return orderRepo.save(order);
    }
}

// 外側: 例外 → HTTPレスポンス変換
@ExceptionHandler(EmptyOrderException.class)
public ResponseEntity<ErrorResponse> handleEmptyOrder(EmptyOrderException e) {
    return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
}
```

---

### 4. トランザクション管理

| 関心 | 配置 | 理由 |
|---|---|---|
| 「この操作はアトミックであるべき」の判断 | ユースケース | ビジネス要件 |
| トランザクションの開始・コミット・ロールバック | 実装詳細（外側） | 技術的機構 |

**原則**: ユースケースはトランザクションの境界（「ここからここまでが一つの操作」）を定義するが、トランザクションの実装機構（`@Transactional`、`BEGIN/COMMIT`）は外側に委ねる。

---

### 5. フロントエンドにおける横断的関心事

フロントエンドでは横断的関心事の性質が異なる:

| 関心 | 配置 | 理由 |
|---|---|---|
| グローバルエラーハンドリング | ルートレイアウト / Error Boundary | フレームワーク機構 |
| 認証状態の管理 | 認証プロバイダ（ルートレイアウト近傍） | アプリ全体に影響する状態 |
| トースト / 通知 | 専用プロバイダ（ルートレイアウト近傍） | UI の関心 |
| API エラーのリトライ | フェッチ層（Server Action / fetch wrapper） | 実装詳細 |

各コンポーネントは自身の「契約の再現」や「表示の意図」に集中し、横断的関心事はフレームワークの仕組み（Layout、Provider、Middleware）に委ねる。

---

## チェックリスト

横断的関心事を配置するときに問うこと:

- [ ] その関心事の「判断」と「実行」を分離しているか？
- [ ] ビジネスルールの内側にフレームワーク固有の処理が入り込んでいないか？
- [ ] 認可ルールがビジネスルールなのか技術的アクセス制御なのか区別しているか？
- [ ] ドメイン例外とプロトコル固有のエラー表現が分離されているか？
- [ ] フレームワークの仕組み（ミドルウェア、デコレータ、Provider）で処理できるものを、ユースケースに混入させていないか？
