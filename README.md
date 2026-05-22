# dmbiel-saucedemo-e2e

[![Playwright Tests](https://github.com/dmbiel/dmbiel-saucedemo-e2e/actions/workflows/playwright.yml/badge.svg)](https://github.com/dmbiel/dmbiel-saucedemo-e2e/actions/workflows/playwright.yml)

End-to-End test automation framework for SauceDemo built with Playwright and TypeScript.

## Purpose

This repository demonstrates a production-style UI E2E automation approach for a demo
e-commerce checkout flow.

The goal is not just to test SauceDemo, but to show a maintainable automation framework with
clear test architecture, typed data, reusable fixtures, stable selectors, cross-browser
configuration, CI execution, and useful failure artifacts.

Covered areas:

- Login
- Inventory
- Cart
- Checkout
- Order completion
- Product sorting
- Negative validation scenarios

## Tech Stack

- Playwright
- TypeScript
- Page Object Model
- Custom Playwright fixtures
- ESLint
- Prettier
- GitHub Actions
- HTML reports
- Trace viewer
- Screenshots and videos on failure

## Application Under Test

SauceDemo / Swag Labs:

https://www.saucedemo.com

Test credentials:

| User                      | Purpose                                 |
| ------------------------- | --------------------------------------- |
| `standard_user`           | Normal happy-path user                  |
| `locked_out_user`         | Negative login scenario                 |
| `problem_user`            | User with known UI issues               |
| `performance_glitch_user` | User with artificial performance delays |
| `error_user`              | User with known interaction errors      |
| `visual_user`             | User with visual issues                 |

Password for all users:

```text
secret_sauce
```

## Test Coverage

### Login

- Successful login
- Locked-out user validation
- Invalid credentials validation
- Empty username validation
- Empty password validation
- Logout

### Cart

- Product list visibility after login
- Add single product
- Add multiple products
- Remove product
- Validate cart badge
- Validate product names and prices in cart
- Validate empty cart after removing all products

### Checkout

- Complete order with one product
- Complete order with multiple products
- Validate required checkout fields
- Validate order summary item total
- Validate tax and total values
- Validate successful order confirmation
- Navigate back to products after order completion

### Inventory Sorting

- Name A-Z
- Name Z-A
- Price low-high
- Price high-low

## Project Structure

```text
.github/
  workflows/
    playwright.yml
src/
  config/
    environment.ts
  fixtures/
    test.ts
  pages/
    base.page.ts
    login.page.ts
    inventory.page.ts
    cart.page.ts
    checkout.page.ts
    checkout-complete.page.ts
  test-data/
    users.ts
    checkout-data.ts
  utils/
    assertions.ts
    price.utils.ts
tests/
  login.spec.ts
  cart.spec.ts
  inventory-sorting.spec.ts
  checkout.spec.ts
```

## Installation

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

Optional local environment override:

```bash
BASE_URL=https://www.saucedemo.com
```

## Run Tests

Run all tests across configured browsers:

```bash
npm test
```

Run Chromium only:

```bash
npm run test:chromium
```

Run Firefox only:

```bash
npm run test:firefox
```

Run WebKit only:

```bash
npm run test:webkit
```

Run headed mode:

```bash
npm run test:headed
```

Run debug mode:

```bash
npm run test:debug
```

Open the HTML report:

```bash
npm run report
```

## CI

Tests are executed in GitHub Actions on:

- Push to `main`
- Pull request to `main`
- Manual workflow dispatch

The CI pipeline includes:

- Dependency installation with `npm ci`
- Playwright browser installation
- ESLint validation
- Playwright test execution
- HTML report artifact upload
- Test results artifact upload

## Quality Practices

This framework applies:

- Page Object Model
- Typed test data
- Reusable fixtures
- Stable `data-test` locators
- Clear test isolation
- No hard waits
- No XPath selectors
- No hardcoded base URL in tests
- Trace, video, and screenshot collection on failure
- Cross-browser execution
- GitHub Actions CI with artifacts

## Author

Dmytro Bieliaiev  
Senior Automation QA Engineer
