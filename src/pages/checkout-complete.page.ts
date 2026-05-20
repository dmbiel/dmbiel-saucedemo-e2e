import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './base.page';

export class CheckoutCompletePage extends BasePage {
  readonly title: Locator;
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async expectOrderCompleted(): Promise<void> {
    await expect(this.title).toHaveText('Checkout: Complete!');
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
