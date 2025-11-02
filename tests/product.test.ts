const { test } = require("@playwright/test");
import { navegateHome, signIn } from "../page-objects/HomePage";
import {
  addToCartFromSearch,
  clearCart,
  clickOnProductOption,
  navegateToProductURL,
  validateProductColor,
  validateProductImage,
  addToCartFromProductPage,
  validateProductCountOnCart,
  validateThereIsNoFreeShipment,
  incrementOrderCountByProductID,
} from "../page-objects/ProductPage";

test.describe("Task 2", () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport to 1920x1080
    await page.setViewportSize({ width: 1920, height: 1080 });
    await navegateHome(page);
  });

  test.afterEach(async ({ page }) => {
    await clearCart(page);
  });

  test("Validate cart", async ({ page }) => {
    await addToCartFromSearch(
      page,
      "Bostitch Personal Electric Pencil Sharpener, Powerful Stall-Free Motor, High Capacity Shavings Tray, Blue (EPS4-BLUE)"
    );
    await navegateToProductURL(
      "Scissors-iBayam-Crafting-Scrapbooking-Knitting/dp/B07H3QKN2Z",
      page
    );
    await validateProductImage(page);
    await clickOnProductOption(page, "Yellow, Grey, Blue");
    await validateProductColor(page, "Yellow, Grey, Blue");
    await addToCartFromProductPage(page);
    await validateProductCountOnCart(page, 2);    
    await incrementOrderCountByProductID(page, 2, 0);
    await validateThereIsNoFreeShipment(page);
    await signIn(page, "eee", "ppp"); //I would use env variables for email and password to avoid hardcoding them
  });
});
