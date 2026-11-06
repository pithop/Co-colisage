import { test, expect } from "@playwright/test";

test("application loads cleanly without errors", async ({ page }) => {
  await page.goto("/#landing");
  await expect(page).toHaveTitle(/BagVoyage/i);
});
