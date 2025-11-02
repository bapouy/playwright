import { expect, Page } from "@playwright/test";

export enum HomeSelectors {
  // Navigation
  NAV_XSHOP_CONTAINER = "#nav-xshop-container a",
  DISMISS_BUTTON = '[data-action-type="DISMISS"]',
  CUSTOMER_SERVICE_LINK = '[data-csa-c-slot-id="nav_cs_4"]',

  // Search
  SEARCH_INPUT = "#twotabsearchtextbox",

  // Login/Sign in
  EMAIL_INPUT = "#ap_email",
  CONTINUE_BUTTON = "#continue",
  PASSWORD_INPUT = "#ap_password",
  SIGN_IN_SUBMIT = "#signInSubmit",
}

export async function validateNavigationMenu(page: Page) {
  await page.reload();

  const expectedNavItems = [
    "Today's Deals",
    "Prime Video",
    "Registry",
    "Gift Cards",
    "Customer Service",
    "Sell",
    "Disability Customer Support",
  ];

  const navItemLocators = await page.locator(HomeSelectors.NAV_XSHOP_CONTAINER);

  await expect(navItemLocators).toHaveCount(expectedNavItems.length);

  for (let i = 0; i < expectedNavItems.length; i++) {
    const expectedText = expectedNavItems[i];

    const currentItemLocator = await navItemLocators.nth(i);

    await expect(await currentItemLocator.textContent()).toBe(expectedText);

    await expect(await currentItemLocator.isEnabled()).toBe(true);

    await expect(await currentItemLocator.isVisible()).toBe(true);
  }
}

export async function dismissToasterNotification(page: Page) {
  const popupLocator = await page.locator(HomeSelectors.DISMISS_BUTTON);
  if (await popupLocator.isVisible()) {
    await popupLocator.click();
  }
}

export async function navigateToCustomerService(page: Page) {
  await page.locator(HomeSelectors.CUSTOMER_SERVICE_LINK).click();
  await expect(page).toHaveURL(/nav_cs_customerservice/);
}

export async function validateSignInPageURL(page: Page) {
  await expect(page).toHaveURL(/signin/);
}

export async function signIn(page: Page, email: string, password: string) {
  await page.locator(HomeSelectors.EMAIL_INPUT).fill(email);
  await page.locator(HomeSelectors.CONTINUE_BUTTON).first().click();
  await page.locator(HomeSelectors.PASSWORD_INPUT).fill(password);
  await page.locator(HomeSelectors.SIGN_IN_SUBMIT).click();
}

export async function validateOrdersPageURL(page: Page) {
  await expect(page).toHaveURL(/orders/);
}
