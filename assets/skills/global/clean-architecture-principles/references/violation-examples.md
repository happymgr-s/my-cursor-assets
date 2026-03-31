# 違反パターンと修正例

よくある依存違反・過剰構造の Before/After。レビューや設計判断の具体的な判断材料として使う。

---

## 1. 内側が外側の詳細に依存している

ユースケースが ORM や Web フレームワーク固有の型に直接依存している。

### Before（違反）

```java
import javax.persistence.EntityManager;
import org.springframework.web.server.ResponseStatusException;

public class CreateOrderUseCase {
    public Order execute(EntityManager em, Map<String, Object> requestData) {
        OrderEntity entity = new OrderEntity(requestData);
        em.persist(entity);
        em.flush();
        if (entity.getId() == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "作成失敗");
        }
        return entity;
    }
}
```

### After（修正）

```java
public class CreateOrderUseCase {
    private final OrderRepository orderRepo;

    public CreateOrderUseCase(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    public Order execute(Order order) {
        Order saved = orderRepo.save(order);
        if (saved == null) {
            throw new DomainException("注文の作成に失敗しました");
        }
        return saved;
    }
}
```

**何が変わったか**: ユースケースは `EntityManager` や `ResponseStatusException` を知らない。永続化は `OrderRepository`（Port）を通じ、エラーはドメイン固有の例外で表現する。

---

## 2. 目的のない薄い委譲チェーン

Controller → Service → Repository を通すためだけに、Service が何もしていない。

### Before（違反）

```java
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public User getUser(String userId) {
        return repo.findById(userId);
    }

    public List<User> listUsers() {
        return repo.findAll();
    }
}
```

### After（修正）

Service がドメインロジックを持たないなら、その層を置く意味がない。

**選択肢 A**: Service を削除し、上位が Repository を直接使う（ドメインロジックが不要な場合）

**選択肢 B**: Service にドメインロジックを移す（ロジックが実在する場合）

```java
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public User getActiveUser(String userId) {
        User user = repo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        if (!user.isActive()) {
            throw new InactiveUserException(userId);
        }
        return user;
    }
}
```

**判断基準**: 層を追加する前に「この層はビジネスルールを表現しているか？」を問う。答えが No なら不要。

---

## 3. フレームワーク型がビジネスルールへ侵入

UI のイベント型やフレームワーク固有の型が、ドメインロジックに流れ込んでいる。

### Before（違反）

```typescript
function validateForm(e: React.FormEvent<HTMLFormElement>) {
  const formData = new FormData(e.currentTarget);
  const name = formData.get("name") as string;
  if (name.length < 2) throw new Error("名前は2文字以上");
}
```

### After（修正）

```typescript
function validateName(name: string): ValidationResult {
  if (name.length < 2) return { valid: false, reason: "名前は2文字以上" };
  return { valid: true };
}

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  const formData = new FormData(e.currentTarget);
  const result = validateName(formData.get("name") as string);
  // ...
}
```

**何が変わったか**: バリデーションロジックはピュアな関数になり、フレームワークに依存しない。テストも容易になる。

---

## 4. 目的のない interface

差し替えもテストのモック化も不要なのに interface を作っている。

### Before（過剰）

```typescript
interface DateFormatter {
  format(date: Date): string;
}

class JapaneseDateFormatter implements DateFormatter {
  format(date: Date): string {
    return date.toLocaleDateString("ja-JP");
  }
}
```

### After（適切）

```typescript
function formatDateJa(date: Date): string {
  return date.toLocaleDateString("ja-JP");
}
```

**判断基準**: 「この interface を消したとき、何が困るか？」 → テストの差し替えも実行時の切り替えも不要なら、interface は過剰。

---

## 5. DTO 変換が層ごとに存在する

各層を通過するたびに DTO に変換し直している。

### Before（過剰）

```java
// Controller
CreateUserRequestDTO requestDto = CreateUserRequestDTO.fromRequest(request);
// Service
CreateUserServiceDTO serviceDto = CreateUserServiceDTO.fromRequestDto(requestDto);
// Repository
CreateUserRepoDTO repoDto = CreateUserRepoDTO.fromServiceDto(serviceDto);
em.persist(repoDto.toEntity());
```

### After（適切）

```java
// Controller: 境界での変換（外→内）
User user = new User(request.getName(), request.getEmail());
// Service: ドメインオブジェクトをそのまま扱う
User validatedUser = userValidator.validateAndEnrich(user);
// Repository: 境界での変換（内→外）
em.persist(UserEntity.from(validatedUser));
```

**判断基準**: DTO 変換は **境界を越える箇所** にだけ存在する。層ごとに変換するのは、層の存在を正当化するためのコストでしかない。

---

## 6. ドメインロジックが外側に漏れている

ビジネスルールが Controller やハンドラに直接書かれており、再利用もテストもできない。

### Before（違反）

```java
@RestController
public class OrderController {
    private final OrderRepository orderRepo;
    private final InventoryRepository inventoryRepo;

    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest req) {
        for (OrderItem item : req.getItems()) {
            int stock = inventoryRepo.getStock(item.getProductId());
            if (stock < item.getQuantity()) {
                return ResponseEntity.badRequest()
                    .body(new OrderResponse("在庫不足: " + item.getProductId()));
            }
        }
        int total = req.getItems().stream()
            .mapToInt(i -> i.getPrice() * i.getQuantity())
            .sum();
        if (total > 500_000) {
            total = (int)(total * 0.95); // 50万円以上で5%割引
        }
        Order order = new Order(req.getCustomerId(), req.getItems(), total);
        orderRepo.save(order);
        return ResponseEntity.ok(new OrderResponse(order));
    }
}
```

### After（修正）

```java
public class CreateOrderUseCase {
    private final OrderRepository orderRepo;
    private final InventoryChecker inventoryChecker;

    public Order execute(String customerId, List<OrderItem> items) {
        inventoryChecker.ensureAvailable(items);
        int total = OrderPricing.calculate(items);
        Order order = new Order(customerId, items, total);
        return orderRepo.save(order);
    }
}
```

**何が変わったか**: 在庫チェック・価格計算・割引ルールがユースケースとドメインオブジェクトに移り、Controller は HTTP の入出力変換だけを担う。ルール変更時に Controller を触る必要がなくなる。

---

## 7. 外部サービスの型がドメインに伝播している

外部 API クライアントのレスポンス型が、ドメイン層やUI層にそのまま流れ込んでいる。

### Before（違反）

```typescript
import type { StripePaymentIntent } from "stripe";

type OrderSummaryProps = {
  paymentIntent: StripePaymentIntent;
};

function OrderSummary({ paymentIntent }: OrderSummaryProps) {
  return (
    <div>
      <p>金額: {paymentIntent.amount}</p>
      <p>通貨: {paymentIntent.currency}</p>
      <p>状態: {paymentIntent.status}</p>
    </div>
  );
}
```

### After（修正）

```typescript
type PaymentStatus = "pending" | "completed" | "failed";

type PaymentSummary = {
  amount: number;
  currency: string;
  status: PaymentStatus;
};

function OrderSummary({ payment }: { payment: PaymentSummary }) {
  return (
    <div>
      <p>金額: {payment.amount}</p>
      <p>通貨: {payment.currency}</p>
      <p>状態: {payment.status}</p>
    </div>
  );
}
```

**何が変わったか**: UI は Stripe を知らない。決済プロバイダを変更しても、`PaymentSummary` への変換を書き換えるだけで UI は影響を受けない。外部型の変換は境界（adapter）で閉じる。

---

## 8. 共有ディレクトリへの安易な逃避

「どこに置くかわからない」コードが `shared/` や `common/` に集まり、あらゆるドメインから参照される巨大な依存元になっている。

### Before（違反）

```
src/
├── shared/
│   ├── validate-email.ts        # 会員登録ドメインのルール
│   ├── calc-tax.ts              # 注文ドメインのルール
│   ├── format-date.ts           # 純粋なユーティリティ
│   ├── order-status.ts          # 注文ドメインの定数
│   └── permission-check.ts      # 認可ドメインのルール
```

### After（適切）

```
src/
├── app/
│   ├── registration/
│   │   └── _utils/
│   │       └── validate-email.ts    # 会員登録に属する
│   ├── order/
│   │   └── _utils/
│   │       ├── calc-tax.ts          # 注文に属する
│   │       └── order-status.ts      # 注文に属する
│   └── settings/
│       └── _utils/
│           └── permission-check.ts  # 認可に属する
├── lib/
│   └── format-date.ts              # ドメインに属さない純粋なユーティリティ
```

**判断基準**: `shared` に置く前に「このコードはどのドメインの関心か？」を問う。ドメインに属するなら、そのドメインのディレクトリに置く。本当にどのドメインにも属さない純粋なユーティリティだけが `lib/` に置かれる。

---

## チェックリスト

コードを書いた/レビューするときに問うこと:

- [ ] 内側のコードは、外側のフレームワーク型を直接 import していないか？
- [ ] 各層はビジネスルールを表現しているか？（ただの委譲ではないか）
- [ ] interface は差し替え・テストの実需があるか？
- [ ] DTO 変換は境界を越える箇所にだけ存在するか？
- [ ] ビジネスルールが Controller / ハンドラに直接書かれていないか？
- [ ] 外部サービスの型がドメインやUIに漏れていないか？
- [ ] `shared` / `common` にドメイン固有のコードが置かれていないか？
