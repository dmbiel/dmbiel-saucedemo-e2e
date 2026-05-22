import { test } from '../src/fixtures/test';
import {
  expectNumbersSortedAscending,
  expectNumbersSortedDescending,
  expectStringsSortedAscending,
  expectStringsSortedDescending,
} from '../src/utils/assertions';
import { users } from '../src/test-data/users';

test.describe('Inventory sorting', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.openLoginPage();
    await loginPage.loginAs(users.standard);
    await inventoryPage.expectOpened();
  });

  test('should sort products by name from A to Z @inventory @sorting', async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortBy('az');

    expectStringsSortedAscending(await inventoryPage.getProductNames());
  });

  test('should sort products by name from Z to A @inventory @sorting', async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortBy('za');

    expectStringsSortedDescending(await inventoryPage.getProductNames());
  });

  test('should sort products by price from low to high @inventory @sorting', async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortBy('lohi');

    expectNumbersSortedAscending(await inventoryPage.getProductPrices());
  });

  test('should sort products by price from high to low @inventory @sorting', async ({
    inventoryPage,
  }) => {
    await inventoryPage.sortBy('hilo');

    expectNumbersSortedDescending(await inventoryPage.getProductPrices());
  });
});
