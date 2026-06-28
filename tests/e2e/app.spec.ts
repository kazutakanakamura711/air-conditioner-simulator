import { expect, test } from "@playwright/test";

test("ホーム画面にシミュレーターの見出しと共有ボタンが表示される", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(
    page.getByRole("heading", { name: "エアコンコスト比較シミュレーター" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "共有URLを作成" }),
  ).toBeVisible();
});

test("ホーム画面で結果サマリーカードが表示される", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText("安価モデル 年間電気代", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("省エネモデル 年間電気代", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("年間電気代の差額", { exact: true }),
  ).toBeVisible();
});

test("入力値を変更してグラフタブを切り替えられる", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await page.getByTestId("comparison-years-select").selectOption("5");

  await expect(page.getByTestId("slider-years-value")).toHaveText("5年");
  await expect(page.getByText("設定した5年", { exact: false })).toBeVisible();

  await page.getByRole("tab", { name: "月別電気代" }).click();
  await expect(page.getByRole("tab", { name: "月別電気代" })).toHaveAttribute(
    "data-state",
    "active",
  );
});
