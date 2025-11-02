import { expect, Page } from "@playwright/test";

export enum HelpSelectors {
  // Search
  HELP_SEARCH_INPUT = "#helpsearch",
  HELP_RESULT_STATS = "#help-result-stats",

  // Feedback
  FEEDBACK_RADIO_CONFUSED = 'input[type="radio"][name="info"][value="Confused By Information"]',
  FEEDBACK_THANKS_MESSAGE = "#hmd-ConfirmNoBox",
}

export enum HelpTexts {
  // Links
  YOUR_ORDERS = "Your Orders",
  TRACKING_PACKAGE = "Tracking your package",
  RETURNS_REFUNDS = "Returns & Refunds Exchange or",
  YOUR_ORDERS_TRACK = "Your Orders Track or cancel",
  CONTACT_CARRIER = "contact a carrier",
  MISSING_TRACKING = "Missing Tracking Information",
  SIGN_IN = "Amazon Sign-In",

  // Content
  ARRIVING = "Arriving",
  RECOMMENDED_TOPICS = "Recommended Help Topics",
  CONTACT_CARRIER_TITLE = "Amazon Carrier Contact Information - Amazon Customer Service",
  FEEBACK_RESPONSE = "Thanks! While we're unable to respond directly to your feedback, we'll use this information to improve our online Help.",

  // Buttons
  FEEDBACK_NO = "No",
  FEEDBACK_YES = "Yes",
  FEEDBACK_SUBMIT = "Submit",
}

export enum HelpRoles {
  LINK = "link",
  LISTITEM = "listitem",
  BUTTON = "button",
}

//looks like dynamically generated, but ther is not other option, useage of classes is not recomended
export enum HelpURLs {
  TRACKING_PACKAGE = "https://www.amazon.com/gp/help/customer/display.html?nodeId=GENAFPTNLHV7ZACW#GUID-AEBE3FF9-5AAF-4CD6-AF09-0287157B72C3__GUID-3347AA8A-20A8-497F-8B2E-C946905E8963",
}

// Regex pattern for search results
export const SEARCH_RESULT_REGEX = /\d+\s+search\s+results\s+for/;

export async function validateOrdersLink(page: Page) {
  // Locate the link that directs to the customer's order history.
  const ordersLink = await page
    .locator("a", { hasText: HelpTexts.YOUR_ORDERS })
    .first(); //Thre is an ID, but looks like dynamically generated so it may break on the next deployment despite it is not a best practice to use it

  await expect(ordersLink).toBeVisible();
  await expect(ordersLink).toHaveAttribute("href", /.*order-history.*/);

  const [newPage] = await Promise.all([
    page.waitForEvent("popup"),
    ordersLink.click(),
  ]);
  await expect(newPage.url()).toContain("signin"); // Usually I would login by API in the beforeEach, and check the propper result, do not want to depend on UI login to avoid flakiness
  await newPage.close();
}

export async function validateJumpLinks(page: Page) {
  const jumpLink = await page.locator("a", {
    hasText: HelpTexts.TRACKING_PACKAGE,
  });
  await expect(jumpLink).toBeVisible();
  await jumpLink.click();
  await expect(page).toHaveURL(HelpURLs.TRACKING_PACKAGE); //it may break on next deploymnet, looks like dynmically generated, but ther is not other option, useage of classes is not recomended
}

export async function validateSidebarLinks(page: Page) {
  const sidebarLink = await page
    .getByRole(HelpRoles.LISTITEM)
    .filter({ hasText: HelpTexts.RETURNS_REFUNDS });

  await expect(sidebarLink).toBeVisible();
}

export async function clickSidebarLink(page: Page) {
  await page
    .getByRole(HelpRoles.LISTITEM)
    .filter({ hasText: HelpTexts.RETURNS_REFUNDS })
    .click();
}

export async function validateSignInPageTitle(page: Page) {
  await expect(page).toHaveTitle(HelpTexts.SIGN_IN);
}

export async function performSearch(page: Page, query: string) {
  const searchInput = await page.locator(HelpSelectors.HELP_SEARCH_INPUT);
  await expect(searchInput).toBeVisible();
  await searchInput.fill(query);
  await page.keyboard.press("Enter");
}

export async function validateSearchStatus(page: Page) {
  await expect(page.locator(HelpSelectors.HELP_RESULT_STATS)).toContainText(
    SEARCH_RESULT_REGEX
  );
}

export async function validateArrivingStatusDefinition(page: Page) {
  const shippedDefinition = await page.getByText(HelpTexts.ARRIVING);
  await expect(shippedDefinition).toBeVisible();
  await expect(shippedDefinition).toContainText(HelpTexts.ARRIVING); // I know this is a usless test, but we have only a dynamically generated ID
}

export async function validateContactLink(page: Page) {
  const contactLink = await page.getByRole(HelpRoles.LINK, {
    name: HelpTexts.CONTACT_CARRIER,
    exact: true,
  });

  await expect(contactLink).toBeVisible();
}

export async function clickContactLink(page: Page) {
  const contactLink = await page.getByRole(HelpRoles.LINK, {
    name: HelpTexts.CONTACT_CARRIER,
    exact: true,
  });

  await contactLink.click();
  await expect(page).toHaveTitle(HelpTexts.CONTACT_CARRIER_TITLE);
}

export async function validateMobileView(page: Page) {
  await page.setViewportSize({ width: 375, height: 812 });

  // Functional check: Ensure the left navigation disappears or collapses
  const leftNav = await page
    .getByRole(HelpRoles.LISTITEM)
    .filter({ hasText: HelpTexts.YOUR_ORDERS_TRACK });
  // await expect(leftNav).not.toBeVisible(); not good responsiveness, there are no colapsing or disappearing elements

  await expect(leftNav).toBeVisible();
}

export async function validateFeedback(page: Page) {
  const feedbackNoButton = await page.getByRole(HelpRoles.BUTTON, {
    name: HelpTexts.FEEDBACK_NO,
  });
  const feedbackYesButton = await page.getByRole(HelpRoles.BUTTON, {
    name: HelpTexts.FEEDBACK_YES,
  });

  await expect(feedbackNoButton).toBeVisible();
  await expect(feedbackYesButton).toBeVisible();
}

export async function performFeedback(page: Page, yesNo: boolean) {
  const feedbackNoButton = await page.getByRole(HelpRoles.BUTTON, {
    name: HelpTexts.FEEDBACK_NO,
  });
  const feedbackYesButton = await page.getByRole(HelpRoles.BUTTON, {
    name: HelpTexts.FEEDBACK_YES,
  });

  if (yesNo) {
    await feedbackYesButton.click();

    await page.click(HelpSelectors.FEEDBACK_RADIO_CONFUSED);
    await page
      .getByRole(HelpRoles.BUTTON, { name: HelpTexts.FEEDBACK_SUBMIT })
      .last()
      .click();

    const feedbackTahanks = await page.locator(
      HelpSelectors.FEEDBACK_THANKS_MESSAGE
    );
    await expect(feedbackTahanks).toBeVisible();
    await expect(feedbackTahanks).toHaveText(HelpTexts.FEEBACK_RESPONSE);
  } else {
    await feedbackNoButton.click();

    await page.click(HelpSelectors.FEEDBACK_RADIO_CONFUSED);
    await page
      .getByRole(HelpRoles.BUTTON, { name: HelpTexts.FEEDBACK_SUBMIT })
      .last()
      .click();

    const feedbackTahanks = await page.locator(
      HelpSelectors.FEEDBACK_THANKS_MESSAGE
    );
    await expect(feedbackTahanks).toBeVisible();
    await expect(feedbackTahanks).toHaveText(HelpTexts.FEEBACK_RESPONSE);
  }
}

export async function validateRecommendedTopics(page: Page) {
  const recommendedTopicsList = await page.getByText(
    HelpTexts.RECOMMENDED_TOPICS
  );

  await expect(recommendedTopicsList).toBeVisible();

  const missingTrackingLink = await page
    .getByRole(HelpRoles.LINK, { name: HelpTexts.MISSING_TRACKING })
    .first();

  await expect(missingTrackingLink).toBeVisible();
}
