import { test, expect } from "@playwright/test";

// Shared test filaments used across specs
const filaments = [
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
    cost: 40,
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
    cost: 28,
  },
  {
    identifier: "PL-303",
    type: "Silk PLA",
    color: "Black",
    colorHex: "#000000",
    material: "PLA",
    brand: "Prusa",
    diameter: 1.75,
    weight: 1000,
    weightLeft: 900,
    inStock: true,
    dateAdded: "2025-12-01T00:00:00.000Z",
    printSettings: {},
  },
];

// Helper: mock the filament API for a page
async function mockFilamentApi(
  page: import("@playwright/test").Page,
  data: typeof filaments = filaments,
) {
  await page.route("**/api/filament", async (route) => {
    const method = route.request().method();
    if (method === "GET") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ filaments: data }),
      });
    } else if (method === "POST") {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ message: "Filament added successfully" }),
      });
    }
  });
}

// ─── Empty state ─────────────────────────────────────────────────────────────

test.describe("Home page – empty state", () => {
  test("shows empty state when API returns no filaments", async ({ page }) => {
    await mockFilamentApi(page, []);
    await page.goto("/");

    await expect(page.getByText("No filaments found.")).toBeVisible();
  });
});

// ─── Filament list ───────────────────────────────────────────────────────────

test.describe("Home page – filament list", () => {
  test("renders filament cards after loading", async ({ page }) => {
    await mockFilamentApi(page);
    await page.goto("/");

    await expect(page.getByText("PL-101")).toBeVisible();
    await expect(page.getByText("PT-202")).toBeVisible();
    await expect(page.getByText("PL-303")).toBeVisible();
  });

  test("shows in-stock and out-of-stock badges", async ({ page }) => {
    await mockFilamentApi(page);
    await page.goto("/");

    await expect(page.getByText("In Stock").first()).toBeVisible();
    await expect(page.getByText("Out of Stock").first()).toBeVisible();
  });
});

// ─── URL filter params ────────────────────────────────────────────────────────

test.describe("Home page – URL filter params", () => {
  test("applies URL filter params on initial load", async ({ page }) => {
    await mockFilamentApi(page);
    await page.goto("/?material=PLA");

    await expect(page.getByText("PL-101")).toBeVisible();
    await expect(page.getByText("PL-303")).toBeVisible();
    await expect(page.getByText("PT-202")).toHaveCount(0);
  });

  test("filters by inStock param from URL", async ({ page }) => {
    await mockFilamentApi(page);
    await page.goto("/?inStock=inStock");

    await expect(page.getByText("PL-101")).toBeVisible();
    await expect(page.getByText("PL-303")).toBeVisible();
    await expect(page.getByText("PT-202")).toHaveCount(0);
  });

  test("filters by outOfStock param from URL", async ({ page }) => {
    await mockFilamentApi(page);
    await page.goto("/?inStock=outOfStock");

    await expect(page.getByText("PT-202")).toBeVisible();
    await expect(page.getByText("PL-101")).toHaveCount(0);
  });
});

// ─── Sorting ─────────────────────────────────────────────────────────────────

test.describe("Home page – sorting", () => {
  test("shows sort direction toggle button", async ({ page }) => {
    await mockFilamentApi(page);
    await page.goto("/");

    // The sort direction button has aria-label
    await expect(
      page.getByRole("button", { name: /sort ascending/i }),
    ).toBeVisible();
  });

  test("toggles sort order when direction button is clicked", async ({
    page,
  }) => {
    await mockFilamentApi(page);
    await page.goto("/");

    const sortBtn = page.getByRole("button", { name: /sort ascending/i });
    await sortBtn.waitFor({ state: "visible" });
    await sortBtn.click();

    await expect(
      page.getByRole("button", { name: /sort descending/i }),
    ).toBeVisible();
  });

  test("URL updates with sortOrder param after toggling", async ({ page }) => {
    await mockFilamentApi(page);
    await page.goto("/");

    await page
      .getByRole("button", { name: /sort ascending/i })
      .waitFor({ state: "visible" });
    await page.getByRole("button", { name: /sort ascending/i }).click();

    await expect(page).toHaveURL(/sortOrder=desc/);
  });
});

// ─── Clear filters ────────────────────────────────────────────────────────────

test.describe("Home page – clear filters", () => {
  test("clear filters restores all filament cards", async ({ page }) => {
    await mockFilamentApi(page);
    // Start with a material filter applied
    await page.goto("/?material=PLA");

    // PT-202 (PETG) should be hidden
    await expect(page.getByText("PT-202")).toHaveCount(0);

    // Click "Clear Filters"
    await page.getByRole("button", { name: /clear filters/i }).click();

    // Now PT-202 should appear
    await expect(page.getByText("PT-202")).toBeVisible();
  });

  test("URL params are cleared after clicking Clear Filters", async ({
    page,
  }) => {
    await mockFilamentApi(page);
    await page.goto("/?material=PLA&inStock=inStock");

    await page.getByRole("button", { name: /clear filters/i }).click();

    // URL should not contain filter params anymore
    await expect(page).not.toHaveURL(/material=/);
    await expect(page).not.toHaveURL(/inStock=/);
  });
});

// ─── Form – validation errors ─────────────────────────────────────────────────

test.describe("Home page – add filament form", () => {
  test("opens the add filament dialog", async ({ page }) => {
    await mockFilamentApi(page);
    await page.goto("/");

    await page.getByRole("button", { name: /add new filament/i }).click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Add Filament")).toBeVisible();
  });

  test("shows validation errors when submitting empty required fields", async ({
    page,
  }) => {
    await mockFilamentApi(page);
    await page.goto("/");

    await page.getByRole("button", { name: /add new filament/i }).click();
    await page.getByRole("dialog").waitFor({ state: "visible" });

    // Clear the auto-generated identifier
    const identifierInput = page.locator("#filament-identifier");
    await identifierInput.clear();

    // Submit without filling required fields
    await page.getByRole("button", { name: /save changes/i }).click();

    // "This field is required" should appear
    await expect(
      page.getByText("This field is required").first(),
    ).toBeVisible();
  });

  test("closes dialog when Cancel is clicked", async ({ page }) => {
    await mockFilamentApi(page);
    await page.goto("/");

    await page.getByRole("button", { name: /add new filament/i }).click();
    await page.getByRole("dialog").waitFor({ state: "visible" });

    await page.getByRole("button", { name: /cancel/i }).click();

    await expect(page.getByRole("dialog")).not.toBeVisible();
  });
});
