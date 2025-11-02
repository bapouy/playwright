import { expect, Page } from "@playwright/test";

export enum CustomerServicesSelectors {
  // Navigation
  NAV_XSHOP_CONTAINER = "#nav-xshop-container a",
  CUSTOMER_SERVICE_LINK = '[data-csa-c-slot-id="nav_cs_4"]',
  // Search
  SEARCH_INPUT = "#twotabsearchtextbox",
}

export async function searchForItem(page: Page, item: string) {
  await page.locator(CustomerServicesSelectors.SEARCH_INPUT).fill(item);
  await page.keyboard.press("Enter");
}

export async function validateCustomerServicePageURL(page: Page) {
  await expect(page).toHaveURL(/nav_cs_customerservice/);
}

export async function openSearchResults(page: Page, item: string) {
  await page.getByText(item, { exact: true }).click();
}
