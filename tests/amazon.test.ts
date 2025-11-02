import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.goto("https://www.amazon.com/");
});

test("Task 1", async ({ page }) => {
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

  const navItemLocators = await page.locator("#nav-xshop-container a");

  await expect(navItemLocators).toHaveCount(expectedNavItems.length);

  for (let i = 0; i < expectedNavItems.length; i++) {
    const expectedText = expectedNavItems[i];

    const currentItemLocator = await navItemLocators.nth(i);

    await expect(await currentItemLocator.textContent()).toBe(expectedText);

    await expect(await currentItemLocator.isEnabled()).toBe(true);

    await expect(await currentItemLocator.isVisible()).toBe(true);
  }

  //dismiss
  await page.locator('[data-action-type="DISMISS"]').click();
  // customers service
  await page.locator('[data-csa-c-slot-id="nav_cs_4"]').click();

  await expect(page).toHaveURL(/nav_cs_customerservice/);
  await page.locator("#twotabsearchtextbox").fill("where is My Stuff");
  await page.keyboard.press("Enter");
  await page.getByText("Your Amazon orders", { exact: true }).click();
  await expect(page).toHaveURL(/signin/);


  await page.locator('#ap_email').fill('alfonso2025@tutamail.com');
  await page.locator('#continue').first().click();
  await page.locator('#ap_password').fill('Am210255Am!');
  await page.locator('#signInSubmit').click();
  await expect(page).toHaveURL(/your-orders/);
 
 
  
});
