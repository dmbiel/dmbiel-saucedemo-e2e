import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './base.page';
import { parsePrice } from '../utils/price.utils';

export class CartPage extends BasePage {
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async expectOpened(): Promise<void> {
    await expect(this.title).toHaveText('Your Cart');
  }

  async expectCartItemsCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectProductVisible(productName: string): Promise<void> {
    await expect(this.productByName(productName)).toBeVisible();
  }

  async expectProductNotVisible(productName: string): Promise<void> {
    await expect(this.productByName(productName)).toHaveCount(0);
  }

  async expectProductsVisible(productNames: readonly string[]): Promise<void> {
    for (const productName of productNames) {
      await this.expectProductVisible(productName);
    }
  }

  async expectEmpty(): Promise<void> {
    await expect(this.cartItems).toHaveCount(0);
  }

  async removeProduct(productName: string): Promise<void> {
    await this.productByName(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async getProductNames(): Promise<string[]> {
    return this.cartItems.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.cartItems
      .locator('[data-test="inventory-item-price"]')
      .allTextContents();

    return prices.map(parsePrice);
  }

  async getProductPrice(productName: string): Promise<number> {
    const price = await this.productByName(productName)
      .locator('[data-test="inventory-item-price"]')
      .innerText();

    return parsePrice(price);
  }

  private productByName(productName: string): Locator {
    return this.cartItems.filter({ hasText: productName });
  }
}
