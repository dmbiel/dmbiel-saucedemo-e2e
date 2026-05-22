import { expect, test } from '../src/fixtures/test';
import { users } from '../src/test-data/users';

test.describe('Login', () => {
  test('should login successfully with standard user @smoke @login', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.openLoginPage();
    await loginPage.loginAs(users.standard);

    await inventoryPage.expectOpened();
  });

  test('should show error for locked out user @login', async ({ loginPage }) => {
    await loginPage.openLoginPage();
    await loginPage.loginAs(users.lockedOut);

    await loginPage.expectLoginError('Epic sadface: Sorry, this user has been locked out.');
  });

  test('should show error for invalid credentials @login', async ({ loginPage }) => {
    await loginPage.openLoginPage();
    await loginPage.loginAs(users.invalid);

    await loginPage.expectLoginError('Epic sadface: Username and password do not match');
  });

  test('should show error when username is empty @login', async ({ loginPage }) => {
    await loginPage.openLoginPage();
    await loginPage.login('', users.standard.password);

    await loginPage.expectLoginError('Epic sadface: Username is required');
  });

  test('should show error when password is empty @login', async ({ loginPage }) => {
    await loginPage.openLoginPage();
    await loginPage.login(users.standard.username, '');

    await loginPage.expectLoginError('Epic sadface: Password is required');
  });

  test('should logout successfully @smoke @login', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.openLoginPage();
    await loginPage.loginAs(users.standard);

    await inventoryPage.expectOpened();
    await inventoryPage.logout();

    await loginPage.expectOpened();
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });
});
