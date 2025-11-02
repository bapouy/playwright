import { test } from "@playwright/test";
import {
  dismissToasterNotification,
  navigateToCustomerService,
  openSearchResults,
  searchForItem,
  signIn,
  validateCustomerServicePageURL,
  validateNavigationMenu,
  validateOrdersPageURL,
  validateSignInPageURL,
} from "../page-objects/home";

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
  await navigateToCustomerService(page);
  await searchForItem(page, "where is My Stuff");
  await openSearchResults(page, "Your Amazon orders");

  await validateSignInPageURL(page); //I would login by API in the beforeEach, and check the propper page, do not want to depend on UI login to avoid flakiness
  //await signIn(page, "email", "password"); //I would use env variables for email and password to avoid hardcoding them
});
