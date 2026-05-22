import { expect, test } from '../src/fixtures/test';
import type { CartPage } from '../src/pages/cart.page';
import type { CheckoutPage } from '../src/pages/checkout.page';
import type { InventoryPage } from '../src/pages/inventory.page';
import { checkoutData } from '../src/test-data/checkout-data';
import { users } from '../src/test-data/users';
import { calculateTotalWithTax } from '../src/utils/price.utils';

const backpack = 'Sauce Labs Backpack';
const bikeLight = 'Sauce Labs Bike Light';
const boltTShirt = 'Sauce Labs Bolt T-Shirt';

type CheckoutFlowPages = {
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

async function openCheckoutWithProducts(
  { inventoryPage, cartPage, checkoutPage }: CheckoutFlowPages,
  productNames: readonly string[],
): Promise<void> {
  for (const productName of productNames) {
    await inventoryPage.addProductToCart(productName);
  }

  await inventoryPage.expectCartBadgeCount(productNames.length);
  await inventoryPage.openCart();
  await cartPage.expectOpened();
  await cartPage.expectProductsVisible(productNames);
  await cartPage.checkout();
  await checkoutPage.expectInformationStepOpened();
}

async function continueToOverview(checkoutPage: CheckoutPage): Promise<void> {
  await checkoutPage.fillCustomerInformation(checkoutData.validCustomer);
  await checkoutPage.continue();
  await checkoutPage.expectOverviewStepOpened();
}

async function expectOrderTotalMatchesItemTotalAndTax(checkoutPage: CheckoutPage): Promise<void> {
  const itemTotal = await checkoutPage.getItemTotalAmount();
  const tax = await checkoutPage.getTaxAmount();
  const total = await checkoutPage.getTotalAmount();

  expect(total).toBeCloseTo(calculateTotalWithTax(itemTotal, tax), 2);
}

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.openLoginPage();
    await loginPage.loginAs(users.standard);
    await inventoryPage.expectOpened();
  });

  test('should complete order with one product @smoke @checkout', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    checkoutCompletePage,
  }) => {
    await openCheckoutWithProducts({ inventoryPage, cartPage, checkoutPage }, [backpack]);
    await continueToOverview(checkoutPage);

    expect(await checkoutPage.getOverviewProductNames()).toEqual([backpack]);
    await checkoutPage.expectSummaryVisible();
    await checkoutPage.expectItemTotalMatchesOverviewItems();
    await expectOrderTotalMatchesItemTotalAndTax(checkoutPage);
    await checkoutPage.finish();

    await checkoutCompletePage.expectOrderCompleted();
  });

  test('should complete order with multiple products @checkout', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    checkoutCompletePage,
  }) => {
    const products = [backpack, bikeLight, boltTShirt];

    await openCheckoutWithProducts({ inventoryPage, cartPage, checkoutPage }, products);
    await continueToOverview(checkoutPage);

    expect(await checkoutPage.getOverviewProductNames()).toEqual(products);
    await checkoutPage.expectSummaryVisible();
    await checkoutPage.expectItemTotalMatchesOverviewItems();
    await expectOrderTotalMatchesItemTotalAndTax(checkoutPage);
    await checkoutPage.finish();

    await checkoutCompletePage.expectOrderCompleted();
  });

  test('should validate required first name field @checkout', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await openCheckoutWithProducts({ inventoryPage, cartPage, checkoutPage }, [backpack]);
    await checkoutPage.fillCustomerInformation(checkoutData.emptyFirstName);
    await checkoutPage.continue();

    await checkoutPage.expectValidationError('Error: First Name is required');
  });

  test('should validate required last name field @checkout', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await openCheckoutWithProducts({ inventoryPage, cartPage, checkoutPage }, [backpack]);
    await checkoutPage.fillCustomerInformation(checkoutData.emptyLastName);
    await checkoutPage.continue();

    await checkoutPage.expectValidationError('Error: Last Name is required');
  });

  test('should validate required postal code field @checkout', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await openCheckoutWithProducts({ inventoryPage, cartPage, checkoutPage }, [backpack]);
    await checkoutPage.fillCustomerInformation(checkoutData.emptyPostalCode);
    await checkoutPage.continue();

    await checkoutPage.expectValidationError('Error: Postal Code is required');
  });

  test('should allow user to go back to products after order completion @checkout', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    checkoutCompletePage,
  }) => {
    await openCheckoutWithProducts({ inventoryPage, cartPage, checkoutPage }, [backpack]);
    await continueToOverview(checkoutPage);
    await checkoutPage.finish();
    await checkoutCompletePage.expectOrderCompleted();

    await checkoutCompletePage.backHome();

    await inventoryPage.expectOpened();
  });
});
