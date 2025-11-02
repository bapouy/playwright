import { test } from "@playwright/test";
import {
  validateOrdersLink,
  validateJumpLinks,
  validateSidebarLinks,
  clickSidebarLink,
  validateSignInPageTitle,
  performSearch,
  validateSearchStatus,
  validateArrivingStatusDefinition,
  clickContactLink,
  validateContactLink,
  validateMobileView,
  performFeedback,
  validateFeedback,
  validateRecommendedTopics,
} from "../page-objects/HelpPage";

const HELP_PAGE_URL =
  "https://www.amazon.com/gp/help/customer/display.html?nodeId=GENAFPTNLHV7ZACW";

test.describe("Test cases for 1.3", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(HELP_PAGE_URL);
  });

  test('LNC-001: Verify external link to "Your Orders"', async ({ page }) => {
    await validateOrdersLink(page);
  });

  test("LNC-002: Verify jump links (Table of Contents)", async ({ page }) => {
    await validateJumpLinks(page);
  });

  test("LNC-003: Verify navigational sidebar links", async ({ page }) => {
    await validateSidebarLinks(page);
    await clickSidebarLink(page);
    await validateSignInPageTitle(page); // Usually I would login by API in the beforeEach, and check the propper result, do not want to depend on UI login to avoid flakiness
  });

  test("CSC-001: Verify search bar functionality", async ({ page }) => {
    await performSearch(page, "contact amazon");
    await validateSearchStatus(page);
  });

  test("CSC-002: Verify accuracy of Arriving Status definition", async ({
    page,
  }) => {
    await validateArrivingStatusDefinition(page);
  });

  test("CSC-003: Verify link to external contact options", async ({ page }) => {
    await validateContactLink(page);
    await clickContactLink(page);
  });

  // --- 4.3 Usability and Experience Test Cases (UX) ---

  test("UXC-001: Verify mobile responsiveness (Snapshot Test)", async ({
    page,
  }) => {
    await validateMobileView(page);
  });

  test("UXC-003: Verify the Feedback mechanism (Click No)", async ({
    page,
  }) => {
    await validateFeedback(page);
    await performFeedback(page, false);
  });

  test("UXC-004: Verify Recommended Help Topics", async ({ page }) => {
    await validateRecommendedTopics(page);
  });
});
