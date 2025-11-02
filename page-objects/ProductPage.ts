import { expect, Page } from "@playwright/test";

export enum ProductSelectors {
  // Search
  SEARCH_BOX = "#twotabsearchtextbox",
  SEARCH_RESULTS = "[data-component-type='s-search-results']",
  DELETE_BUTTON = "[data-feature-id='item-delete-button']",

  // Cart
  ADD_TO_CART_BUTTON_SIDE_MENU = "#a-autoid-1-announce",
  CART_ITEMS = "#ewc-compact-body",
  INCREMENT_ORDER_COUNT = '[data-a-selector="increment"]',

  //Proucts
  PRODUCT_IMAGE = "#imageBlock",
  PRODUCT_COLOR = "#inline-twister-expanded-dimension-text-color_name",
  ADD_TO_CART_BUTTON_ON_PRODUCT = "#add-to-cart-button",
}

export async function clearCart(page: Page) {
  const deleteButtons = await page
    .locator(ProductSelectors.DELETE_BUTTON)
    .all();
  for (let i = 0; i < 2 && i < deleteButtons.length; i++) {
    await deleteButtons[i].click();
  }
}

export async function addToCartFromSearch(page: Page, searchTerm: string) {
  const searchBox = page.locator(ProductSelectors.SEARCH_BOX);
  await expect(searchBox).toBeVisible();
  await searchBox.fill(searchTerm);
  await searchBox.press("Enter");

  await expect(page.locator(ProductSelectors.SEARCH_RESULTS)).toBeVisible();

  const addToCartButton = page.locator(
    ProductSelectors.ADD_TO_CART_BUTTON_SIDE_MENU
  );
  await expect(addToCartButton).toBeVisible();
  await addToCartButton.click();

  const cartItems = page.locator(ProductSelectors.CART_ITEMS);
  await expect(cartItems).toBeVisible();
}

export async function navegateToProductURL(url: string, page: Page) {
  await page.goto("https://www.amazon.com/" + url);
}

export async function validateProductImage(page: Page) {
  await expect(page.locator(ProductSelectors.PRODUCT_IMAGE)).toBeVisible();
}

export async function clickOnProductOption(page: Page, option: string) {
  const colorOption = page.getByRole("radio", {
    name: new RegExp(option),
  });

  await colorOption.click({ force: true });
}

export async function validateProductColor(page: Page, color: string) {
  const colorText = page.locator(ProductSelectors.PRODUCT_COLOR);
  await expect(colorText).toBeVisible({ timeout: 30000 });
  await expect(colorText).toHaveText(color);
}

export async function addToCartFromProductPage(page: Page) {
  const addToCart = page.locator(
    ProductSelectors.ADD_TO_CART_BUTTON_ON_PRODUCT
  );
  await expect(addToCart).toBeVisible();
  await addToCart.click();

  const confirmationMessage = page.getByText(/Added\s+to\s+cart/i).nth(0);
  await expect(confirmationMessage).toBeVisible({ timeout: 30000 });
}

export async function validateProductCountOnCart(
  page: Page,
  expectedCount: number
) {
  const cartItems = page.locator(ProductSelectors.CART_ITEMS);
  await expect(cartItems).toBeVisible();

  const listItems = cartItems.locator("li");
  await expect(listItems).toHaveCount(expectedCount);
}

export async function validateThereIsNoFreeShipment(page: Page) {
  // Case-insensitive search for "free shipment" text (the /i flag makes the regex case-insensitive)
  const freeShipmentText = page.getByText(/free shipment/i);
  await expect(freeShipmentText).toHaveCount(0);
}

export async function incrementOrderCountByProductID(
  page: Page,
  increment: number,
  productID: number
) {
  const incrementButton = page
    .locator(ProductSelectors.INCREMENT_ORDER_COUNT)
    .nth(productID);
  for (let i = 0; i < increment; i++) {
    await incrementButton.click();
  }
}
