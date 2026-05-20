import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './base.page';
import type { User } from '../test-data/users';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async openLoginPage(): Promise<void> {
    await this.open('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAs(user: User): Promise<void> {
    await this.login(user.username, user.password);
  }

  async expectOpened(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
  }

  async expectLoginError(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }
}
