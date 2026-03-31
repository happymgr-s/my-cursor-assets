# テスト戦略とアーキテクチャ境界

クリーンアーキテクチャの境界設計は、テスト戦略と直結する。境界を正しく引けば、テストは自然と書きやすくなる。境界が曖昧なら、テストも曖昧になる。

---

## 核心: Port の位置 = モック境界

依存性逆転のために interface（Port）を切った接点は、テストにおけるモック境界と一致する。

```
[ユースケース] → [Port (interface)] → [Adapter (実装)]
                      ↑
                テストではここを差し替える
```

Port が正しい位置に存在すれば、テストでは Adapter をモックに差し替えるだけでユースケースを独立にテストできる。逆に言えば、**テストでモックしづらい箇所は、境界の設計が甘い兆候**である。

---

## 原則

### 1. 内側のピュアなロジックはモック不要でテストできる

フレームワーク型を排除したビジネスロジックは、外部依存がないためモックなしで単体テスト可能。

```java
// ピュアなドメインロジック — モック不要
public class OrderPricing {
    public static int calculate(List<OrderItem> items) {
        int subtotal = items.stream()
            .mapToInt(i -> i.getPrice() * i.getQuantity())
            .sum();
        return subtotal > 500_000 ? (int)(subtotal * 0.95) : subtotal;
    }
}

// テスト
@Test
void 50万円超で5パーセント割引が適用される() {
    var items = List.of(new OrderItem("A", 300_000, 2));
    assertThat(OrderPricing.calculate(items)).isEqualTo(570_000);
}
```

```typescript
// ピュアなバリデーション — モック不要
function validateName(name: string): ValidationResult {
  if (name.length < 2) return { valid: false, reason: "名前は2文字以上" };
  return { valid: true };
}

// テスト
it("2文字未満の名前は無効", () => {
  expect(validateName("a")).toEqual({ valid: false, reason: "名前は2文字以上" });
});
```

**テストが複雑になったら問う**: このロジックは本当に外部依存が必要か？ピュアな関数に抽出できないか？

### 2. ユースケースのテストは Port をモックする

ユースケースが Port を通じて外部と通信するなら、テストでは Port のモック実装を注入する。

```java
// ユースケース
public class CreateOrderUseCase {
    private final OrderRepository orderRepo;
    private final InventoryChecker inventoryChecker;

    public Order execute(String customerId, List<OrderItem> items) {
        inventoryChecker.ensureAvailable(items);
        int total = OrderPricing.calculate(items);
        return orderRepo.save(new Order(customerId, items, total));
    }
}

// テスト — Port をモックに差し替え
@Test
void 注文が正常に作成される() {
    var mockRepo = mock(OrderRepository.class);
    var mockChecker = mock(InventoryChecker.class);
    when(mockRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

    var useCase = new CreateOrderUseCase(mockRepo, mockChecker);
    var order = useCase.execute("customer-1", List.of(new OrderItem("A", 1000, 2)));

    assertThat(order.getTotal()).isEqualTo(2000);
    verify(mockChecker).ensureAvailable(any());
}
```

### 3. コンポーネント単位のテストはその境界で閉じる

「コンポーネントごとの小さなクリーンアーキテクチャ」を採用すると、テストもそのコンポーネントの境界で閉じる。

```typescript
// Provider がコンポーネントの「契約の再現」を担う
// テストでは Provider をモックし、UIコンポーネントを独立にテスト

function renderWithMockProvider(ui: React.ReactElement) {
  const mockValue = {
    tasks: [{ id: "1", title: "タスクA", status: "open" }],
    isLoading: false,
  };
  return render(
    <TaskBoardContext.Provider value={mockValue}>
      {ui}
    </TaskBoardContext.Provider>
  );
}

it("タスクが表示される", () => {
  renderWithMockProvider(<KanbanView />);
  expect(screen.getByText("タスクA")).toBeInTheDocument();
});
```

**Provider = 境界**: Provider はバックエンドの契約を再現する層であり、テストにおけるモック境界と一致する。UI コンポーネントのテストでは Provider をモックし、Provider 自体のテストでは API 呼び出し（Server Action 等）をモックする。

---

## アンチパターン

### モックだらけのテスト

テスト1件に対してモックが 5 個以上あるなら、テスト対象が多くの外部詳細に依存しすぎている。境界の設計を見直す。

### 実装詳細のテスト

「この関数がこの順序で呼ばれること」をテストしているなら、振る舞いではなく実装をテストしている。クリーンアーキテクチャの目的は実装詳細を隠すことであり、テストも同じ原則に従う。

### テストのためだけに public にする

テスト容易性のために内部メソッドを公開しているなら、それは境界設計の問題。テストしたいロジックをピュアな関数やドメインオブジェクトに抽出し、そちらをテストする。

---

## まとめ

| アーキテクチャの境界 | テストでの対応 |
|---|---|
| ピュアなドメインロジック | モック不要で直接テスト |
| Port（interface） | モックに差し替えてユースケースをテスト |
| Provider（フロントエンド） | モック Provider で UI コンポーネントをテスト |
| Adapter（外部通信） | 結合テストまたは E2E で検証 |
