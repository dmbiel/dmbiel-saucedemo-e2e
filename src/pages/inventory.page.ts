import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './base.page';
import { parsePrice } from '../utils/price.utils';

export type InventorySortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly productItems: Locator;
  readonly sortDropdown: Locator;
  readonly burgerMenuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.productItems = page.locator('[data-test="inventory-item"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.burgerMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async expectOpened(): Promise<void> {
    await expect(this.title).toHaveText('Products');
  }

  async expectProductListVisible(): Promise<void> {
    await expect(this.productItems).toHaveCount(6);
    await expect(this.productItems.first()).toBeVisible();
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.productByName(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    await this.productByName(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async expectCartBadgeCount(count: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async expectCartBadgeHidden(): Promise<void> {
    await expect(this.cartBadge).toBeHidden();
  }

  async sortBy(option: InventorySortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return this.productItems.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.productItems
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

  async logout(): Promise<void> {
    await this.burgerMenuButton.click();
    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();
  }

  private productByName(productName: string): Locator {
    return this.productItems.filter({ hasText: productName });
  }
}
