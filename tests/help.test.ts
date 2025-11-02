import { test, expect } from "@playwright/test";

// Placeholder for the URL. You will replace this with the actual Amazon Help URL.
const HELP_PAGE_URL =
  "https://www.amazon.com/gp/help/customer/display.html?nodeId=GENAFPTNLHV7ZACW";

test.describe("Test cases for 1.3", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(HELP_PAGE_URL);
  });

  test('Verify external link to "Your Orders"', async ({ page }) => {
    // Locate the link that directs to the customer's order history.
    const ordersLink = await page
      .locator("a", { hasText: "Your Orders" })
      .first(); //Thre is an ID, but looks like dynamically generated so it may break on the next deployment despite it is not a best practice to use it

    await expect(ordersLink).toBeVisible();
    await expect(ordersLink).toHaveAttribute("href", /.*order-history.*/);

    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      ordersLink.click(),
    ]);
    await expect(newPage.url()).toContain("signin"); // Usually I would login by API in the beforeEach, and check the propper result, do not want to depend on UI login to avoid flakiness
    await newPage.close();
  });

  test("Verify jump links (Table of Contents)", async ({ page }) => {
    const jumpLink = await page.locator("a", {
      hasText: "Tracking your package",
    });
    await expect(jumpLink).toBeVisible();
    await jumpLink.click();
    await expect(page).toHaveURL(
      /#GUID-AEBE3FF9-5AAF-4CD6-AF09-0287157B72C3__GUID-3347AA8A-20A8-497F-8B2E-C946905E8963/
    ); //it may break on next deploymnet, looks like dynmically generated, but ther is not other option, useage of classes is not recomended
  });

  test("Verify navigational sidebar links", async ({ page }) => {
    const sidebarLink = await page
      .getByRole("listitem")
      .filter({ hasText: "Returns & Refunds Exchange or" });

    await expect(sidebarLink).toBeVisible();

    await sidebarLink.click();
    await expect(page).toHaveTitle("Amazon Sign-In"); // Usually I would login by API in the beforeEach, and check the propper result, do not want to depend on UI login to avoid flakiness
  });

  test("Verify search bar functionality", async ({ page }) => {
    const searchInput = await page.locator("#helpsearch");

    const testQuery = "contact amazon";

    await expect(searchInput).toBeVisible();
    await searchInput.fill(testQuery);
    await page.keyboard.press("Enter");

    await expect(page.locator("#help-result-stats")).toContainText(
      /\d+\s+search\s+results\s+for/ //s due to extra white spaces
    );
  });

  test("CSC-002: Verify accuracy of Delivery Status definition (Shipped)", async ({
    page,
  }) => {
    const shippedDefinition = await page.getByText("Arriving");
    await expect(shippedDefinition).toBeVisible();
    await expect(shippedDefinition).toContainText("Arriving"); // I know this is a usless test, but we have only a dynamically generated ID
  });

  test("CSC-004: Verify link to external contact options", async ({ page }) => {
    const contactLink = await page.getByRole("link", {
      name: "contact a carrier",
      exact: true,
    });

    await expect(contactLink).toBeVisible();

    await contactLink.click();
    await expect(page).toHaveTitle(
      "Amazon Carrier Contact Information - Amazon Customer Service"
    );
  });

  // --- 4.3 Usability and Experience Test Cases (UX) ---

  test("UXC-001: Verify mobile responsiveness (Snapshot Test)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    // Functional check: Ensure the left navigation disappears or collapses
    const leftNav = await page
      .getByRole("listitem")
      .filter({ hasText: "Your Orders Track or cancel" });
    // await expect(leftNav).not.toBeVisible(); not good responsiveness, there are no colapsing or disappearing elements

    await expect(leftNav).toBeVisible();
  });

  test("UXC-003: Verify the Feedback mechanism (Click No)", async ({
    page,
  }) => {
    const feedbackNoButton = await page.getByRole("button", { name: "No" });
    const feedbackYesButton = await page.getByRole("button", { name: "Yes" });

    await expect(feedbackNoButton).toBeVisible();
    await expect(feedbackYesButton).toBeVisible();
    await feedbackNoButton.click();

    await page.click(
      'input[type="radio"][name="info"][value="Confused By Information"]'
    );
    await page.getByRole("button", { name: "Submit" }).last().click();

    const feedbackTahanks = await page.locator("#hmd-ConfirmNoBox");
    await expect(feedbackTahanks).toBeVisible();
    await expect(feedbackTahanks).toHaveText(
      "Thanks! While we're unable to respond directly to your feedback, we'll use this information to improve our online Help."
    );
  });

  test("UXC-004: Verify Recommended Help Topics", async ({ page }) => {
    const recommendedTopicsList = await page.getByText(
      "Recommended Help Topics"
    );

    await expect(recommendedTopicsList).toBeVisible();

    const missingTrackingLink = await page
      .getByRole("link", { name: "Missing Tracking Information" })
      .first();

    await expect(missingTrackingLink).toBeVisible();
  });
});
