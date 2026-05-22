import { expect, test } from '../src/fixtures/test';
import { users } from '../src/test-data/users';

const backpack = 'Sauce Labs Backpack';
const bikeLight = 'Sauce Labs Bike Light';
const boltTShirt = 'Sauce Labs Bolt T-Shirt';

test.describe('Cart', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.openLoginPage();
    await loginPage.loginAs(users.standard);
    await inventoryPage.expectOpened();
  });

  test('should show product list after successful login @smoke @cart', async ({
    inventoryPage,
  }) => {
    await inventoryPage.expectProductListVisible();
  });

  test('should add single product to cart @smoke @cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addProductToCart(backpack);
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.openCart();
    await cartPage.expectOpened();
    await cartPage.expectCartItemsCount(1);
    await cartPage.expectProductVisible(backpack);
  });

  test('should add multiple products to cart @cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addProductToCart(backpack);
    await inventoryPage.addProductToCart(bikeLight);
    await inventoryPage.expectCartBadgeCount(2);

    await inventoryPage.openCart();
    await cartPage.expectOpened();
    await cartPage.expectCartItemsCount(2);
    await cartPage.expectProductsVisible([backpack, bikeLight]);
  });

  test('should remove product from cart @cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addProductToCart(backpack);
    await inventoryPage.openCart();
    await cartPage.expectOpened();

    await cartPage.removeProduct(backpack);

    await cartPage.expectProductNotVisible(backpack);
    await cartPage.expectEmpty();
  });

  test('should hide cart badge after removing all products from inventory page @cart', async ({
    inventoryPage,
  }) => {
    await inventoryPage.addProductToCart(backpack);
    await inventoryPage.expectCartBadgeCount(1);

    await inventoryPage.removeProductFromCart(backpack);

    await inventoryPage.expectCartBadgeHidden();
  });

  test('should display correct product names and prices in cart @cart', async ({
    inventoryPage,
    cartPage,
  }) => {
    const expectedProducts = [backpack, bikeLight, boltTShirt];
    const expectedPrices = await Promise.all(
      expectedProducts.map((productName) => inventoryPage.getProductPrice(productName)),
    );

    for (const productName of expectedProducts) {
      await inventoryPage.addProductToCart(productName);
    }

    await inventoryPage.openCart();
    await cartPage.expectOpened();

    await expect(await cartPage.getProductNames()).toEqual(expectedProducts);
    await expect(await cartPage.getProductPrices()).toEqual(expectedPrices);
  });

  test('should keep cart empty after removing all products from cart page @cart', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addProductToCart(backpack);
    await inventoryPage.addProductToCart(bikeLight);
    await inventoryPage.expectCartBadgeCount(2);
    await inventoryPage.openCart();
    await cartPage.expectOpened();

    await cartPage.removeProduct(backpack);
    await cartPage.removeProduct(bikeLight);

    await cartPage.expectEmpty();
  });
});
