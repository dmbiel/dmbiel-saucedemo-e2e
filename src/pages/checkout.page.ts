import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './base.page';
import type { CheckoutCustomer } from '../test-data/checkout-data';
import { parsePrice, sumPrices } from '../utils/price.utils';

export class CheckoutPage extends BasePage {
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;
  readonly overviewItems: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.overviewItems = page.locator('[data-test="inventory-item"]');
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
  }

  async expectInformationStepOpened(): Promise<void> {
    await expect(this.title).toHaveText('Checkout: Your Information');
  }

  async fillCustomerInformation(customer: CheckoutCustomer): Promise<void> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async expectOverviewStepOpened(): Promise<void> {
    await expect(this.title).toHaveText('Checkout: Overview');
  }

  async expectValidationError(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }

  async expectSummaryVisible(): Promise<void> {
    await expect(this.itemTotal).toBeVisible();
    await expect(this.tax).toBeVisible();
    await expect(this.total).toBeVisible();
  }

  async expectItemTotalEquals(expectedTotal: number): Promise<void> {
    const actualTotal = await this.getItemTotalAmount();

    expect(actualTotal).toBeCloseTo(expectedTotal, 2);
  }

  async expectItemTotalMatchesOverviewItems(): Promise<void> {
    const prices = await this.getOverviewProductPrices();

    await this.expectItemTotalEquals(sumPrices(prices));
  }

  async getOverviewProductNames(): Promise<string[]> {
    return this.overviewItems.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  async getOverviewProductPrices(): Promise<number[]> {
    const prices = await this.overviewItems
      .locator('[data-test="inventory-item-price"]')
      .allTextContents();

    return prices.map(parsePrice);
  }

  async getItemTotalAmount(): Promise<number> {
    return parsePrice(await this.itemTotal.innerText());
  }

  async getTaxAmount(): Promise<number> {
    return parsePrice(await this.tax.innerText());
  }

  async getTotalAmount(): Promise<number> {
    return parsePrice(await this.total.innerText());
  }
}
