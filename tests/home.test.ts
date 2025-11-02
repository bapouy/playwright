import { test } from "@playwright/test";
import {
  dismissToasterNotification,
  navigateToCustomerService,
  signIn,
  validateNavigationMenu,
  validateSignInPageURL,
} from "../page-objects/HomePage";

import {
  validateCustomerServicePageURL,
  searchForItem,
  openSearchResults,
} from "../page-objects/CustomerServicesPage";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.goto("https://www.amazon.com/");
});

test("Task 1", async ({ page }) => {
  await validateNavigationMenu(page);
  await dismissToasterNotification(page);
  // customers service
  await navigateToCustomerService(page);

  await validateCustomerServicePageURL(page);
  await searchForItem(page, "where is My Stuff");
  await openSearchResults(page, "Your Amazon orders");

  await validateSignInPageURL(page); //I would login by API in the beforeEach, and check the propper page, do not want to depend on UI login to avoid flakiness
  await signIn(page, "email", "pass"); //I would use env variables for email and password to avoid hardcoding them
});
