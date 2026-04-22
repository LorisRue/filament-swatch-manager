import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("shows empty state when API returns no filaments", async ({ page }) => {
    await page.route("**/api/filament", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ filaments: [] }),
      });
    });

    await page.goto("/");

    await expect(page.getByText("No filaments found.")).toBeVisible();
  });

  test("applies URL filter params on initial load", async ({ page }) => {
    await page.route("**/api/filament", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          filaments: [
            {
              identifier: "PL-101",
              type: "Matte PLA",
              color: "Red",
              colorHex: "#ff0000",
              material: "PLA",
              brand: "Prusa",
              diameter: 1.75,
              weight: 1000,
              weightLeft: 700,
              inStock: true,
              dateAdded: "2026-01-01T00:00:00.000Z",
              printSettings: {},
            },
            {
              identifier: "PT-202",
              type: "PETG",
              color: "Blue",
              colorHex: "#0000ff",
              material: "PETG",
              brand: "Sunlu",
              diameter: 1.75,
              weight: 1000,
              weightLeft: 0,
              inStock: false,
              dateAdded: "2026-01-02T00:00:00.000Z",
              printSettings: {},
            },
          ],
        }),
      });
    });

    await page.goto("/?material=PLA");

    await expect(page.getByText("PL-101")).toBeVisible();
    await expect(page.getByText("PT-202")).toHaveCount(0);
  });
});
