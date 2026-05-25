import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { VALID_CREDENTIALS } from '../test-data/login.data';
import { PRODUCTS } from '../test-data/products.data';
import { step, tag, severity, feature, story, epic, layer } from '../utils/allure.helpers';

test.describe('Add to Cart Functionality', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  // Shared login fixture — avoids repeating login in every test
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    epic('Shopping Cart');
    feature('Cart');
    layer('e2e');

    await loginPage.goto();
    await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
    await expect(page).toHaveURL('/inventory.html');
  });

  // ─────────────────────────────────────────────
  //  ADD TO CART
  // ─────────────────────────────────────────────

  test.describe('Adding Products', () => {
    test('@smoke - should add a single product and update cart badge', async ({ page }) => {
      tag('smoke', 'regression');
      severity('blocker');
      story('Add Single Product');

      await step('Verify cart badge is not visible initially', async () => {
        expect(await inventoryPage.isCartBadgeVisible()).toBe(false);
      });

      await step(`Add "${PRODUCTS.backpack.name}" to cart`, async () => {
        await inventoryPage.addProductToCart(PRODUCTS.backpack.name);
      });

      await step('Verify cart badge shows count = 1', async () => {
        const count = await inventoryPage.getCartBadgeCount();
        expect(count).toBe(1);
      });

      await step('Verify Add button changed to Remove button', async () => {
        expect(await inventoryPage.isRemoveButtonVisible(PRODUCTS.backpack.name)).toBe(true);
      });
    });

    test('@regression - should add multiple products and update badge count', async ({ page }) => {
      tag('regression');
      severity('critical');
      story('Add Multiple Products');

      const productsToAdd = [
        PRODUCTS.backpack.name,
        PRODUCTS.bikeLight.name,
        PRODUCTS.boltTShirt.name,
      ];

      for (let i = 0; i < productsToAdd.length; i++) {
        await step(`Add product ${i + 1}: ${productsToAdd[i]}`, async () => {
          await inventoryPage.addProductToCart(productsToAdd[i]);
        });

        await step(`Verify badge count = ${i + 1}`, async () => {
          const count = await inventoryPage.getCartBadgeCount();
          expect(count).toBe(i + 1);
        });
      }
    });

    test('@regression - should show Remove button after adding product', async ({ page }) => {
      tag('regression');
      severity('normal');
      story('Add to Cart Button State');

      await step('Add backpack to cart', async () => {
        await inventoryPage.addProductToCart(PRODUCTS.backpack.name);
      });

      await step('Verify Remove button is visible', async () => {
        expect(await inventoryPage.isRemoveButtonVisible(PRODUCTS.backpack.name)).toBe(true);
      });

      await step('Verify Add-to-cart button is gone', async () => {
        expect(await inventoryPage.isAddToCartButtonVisible(PRODUCTS.backpack.name)).toBe(false);
      });
    });
  });

  // ─────────────────────────────────────────────
  //  CART PAGE VALIDATION
  // ─────────────────────────────────────────────

  test.describe('Cart Page Validation', () => {
    test('@smoke - should navigate to cart and validate product details', async ({ page }) => {
      tag('smoke', 'regression');
      severity('blocker');
      story('Cart Page Navigation');

      await step('Add backpack to cart', async () => {
        await inventoryPage.addProductToCart(PRODUCTS.backpack.name);
      });

      await step('Navigate to cart', async () => {
        await inventoryPage.navigateToCart();
      });

      await step('Verify URL is /cart.html', async () => {
        expect(await cartPage.isOnCartPage()).toBe(true);
        await expect(page).toHaveURL('/cart.html');
      });

      await step('Verify cart page title', async () => {
        const title = await cartPage.getPageTitle();
        expect(title).toBe('Your Cart');
      });

      await step('Verify cart contains 1 item', async () => {
        const count = await cartPage.getCartItemCount();
        expect(count).toBe(1);
      });

      await step('Verify product name in cart', async () => {
        const isPresent = await cartPage.isProductInCart(PRODUCTS.backpack.name);
        expect(isPresent).toBe(true);
      });

      await step('Verify product price in cart', async () => {
        const prices = await cartPage.getItemPrices();
        expect(prices[0]).toBe(PRODUCTS.backpack.price);
      });
    });

    test('@regression - should display correct products when multiple items added', async ({ page }) => {
      tag('regression');
      severity('critical');
      story('Multi-Product Cart Validation');

      const productsToAdd = [PRODUCTS.backpack, PRODUCTS.bikeLight];

      for (const product of productsToAdd) {
        await step(`Add ${product.name} to cart`, async () => {
          await inventoryPage.addProductToCart(product.name);
        });
      }

      await step('Navigate to cart', async () => {
        await inventoryPage.navigateToCart();
      });

      await step('Verify cart has 2 items', async () => {
        expect(await cartPage.getCartItemCount()).toBe(2);
      });

      for (const product of productsToAdd) {
        await step(`Verify ${product.name} is in cart`, async () => {
          expect(await cartPage.isProductInCart(product.name)).toBe(true);
        });
      }

      await step('Verify all prices are correct', async () => {
        const prices = await cartPage.getItemPrices();
        for (const product of productsToAdd) {
          expect(prices).toContain(product.price);
        }
      });
    });
  });

  // ─────────────────────────────────────────────
  //  REMOVE FROM CART
  // ─────────────────────────────────────────────

  test.describe('Removing Products', () => {
    test('@smoke - should remove a product from inventory page and update badge', async ({ page }) => {
      tag('smoke', 'regression');
      severity('critical');
      story('Remove From Inventory');

      await step('Add backpack to cart', async () => {
        await inventoryPage.addProductToCart(PRODUCTS.backpack.name);
      });

      await step('Verify badge count is 1', async () => {
        expect(await inventoryPage.getCartBadgeCount()).toBe(1);
      });

      await step('Remove backpack from cart via inventory page', async () => {
        await inventoryPage.removeProductFromCart(PRODUCTS.backpack.name);
      });

      await step('Verify cart badge disappears', async () => {
        expect(await inventoryPage.isCartBadgeVisible()).toBe(false);
      });

      await step('Verify Add-to-cart button returns', async () => {
        expect(await inventoryPage.isAddToCartButtonVisible(PRODUCTS.backpack.name)).toBe(true);
      });
    });

    test('@regression - should remove a product from cart page and update cart', async ({ page }) => {
      tag('regression');
      severity('critical');
      story('Remove From Cart Page');

      await step('Add backpack to cart', async () => {
        await inventoryPage.addProductToCart(PRODUCTS.backpack.name);
      });

      await step('Navigate to cart', async () => {
        await inventoryPage.navigateToCart();
      });

      await step('Verify backpack is in cart', async () => {
        expect(await cartPage.isProductInCart(PRODUCTS.backpack.name)).toBe(true);
      });

      await step('Remove backpack from cart', async () => {
        await cartPage.removeItemByName(PRODUCTS.backpack.name);
      });

      await step('Verify cart is now empty', async () => {
        expect(await cartPage.isCartEmpty()).toBe(true);
      });
    });

    test('@regression - should remove one of multiple items and preserve others', async ({ page }) => {
      tag('regression');
      severity('normal');
      story('Partial Cart Removal');

      await step('Add backpack and bike light to cart', async () => {
        await inventoryPage.addProductToCart(PRODUCTS.backpack.name);
        await inventoryPage.addProductToCart(PRODUCTS.bikeLight.name);
      });

      await step('Navigate to cart', async () => {
        await inventoryPage.navigateToCart();
      });

      await step('Remove only the backpack', async () => {
        await cartPage.removeItemByName(PRODUCTS.backpack.name);
      });

      await step('Verify only 1 item remains', async () => {
        expect(await cartPage.getCartItemCount()).toBe(1);
      });

      await step('Verify bike light is still in cart', async () => {
        expect(await cartPage.isProductInCart(PRODUCTS.bikeLight.name)).toBe(true);
      });

      await step('Verify backpack is gone from cart', async () => {
        expect(await cartPage.isProductInCart(PRODUCTS.backpack.name)).toBe(false);
      });
    });

    test('@regression - should continue shopping after viewing cart', async ({ page }) => {
      tag('regression');
      severity('minor');
      story('Continue Shopping');

      await step('Add a product and go to cart', async () => {
        await inventoryPage.addProductToCart(PRODUCTS.backpack.name);
        await inventoryPage.navigateToCart();
      });

      await step('Click Continue Shopping', async () => {
        await cartPage.continueShopping();
      });

      await step('Verify navigation back to inventory page', async () => {
        await expect(page).toHaveURL('/inventory.html');
      });

      await step('Verify cart badge still shows previous items', async () => {
        expect(await inventoryPage.getCartBadgeCount()).toBe(1);
      });
    });
  });

  // ─────────────────────────────────────────────
  //  CART BADGE EDGE CASES
  // ─────────────────────────────────────────────

  test.describe('Cart Badge Edge Cases', () => {
    test('@regression - cart badge should not appear when cart is empty', async ({ page }) => {
      tag('regression');
      severity('minor');
      story('Empty Cart Badge');

      await step('Verify no badge is shown on inventory page without adding items', async () => {
        expect(await inventoryPage.isCartBadgeVisible()).toBe(false);
      });
    });

    test('@regression - cart badge should disappear after removing all items', async ({ page }) => {
      tag('regression');
      severity('normal');
      story('Badge Reset');

      await step('Add 2 products', async () => {
        await inventoryPage.addProductToCart(PRODUCTS.backpack.name);
        await inventoryPage.addProductToCart(PRODUCTS.bikeLight.name);
      });

      await step('Verify badge count is 2', async () => {
        expect(await inventoryPage.getCartBadgeCount()).toBe(2);
      });

      await step('Remove both products', async () => {
        await inventoryPage.removeProductFromCart(PRODUCTS.backpack.name);
        await inventoryPage.removeProductFromCart(PRODUCTS.bikeLight.name);
      });

      await step('Verify badge is gone', async () => {
        expect(await inventoryPage.isCartBadgeVisible()).toBe(false);
      });
    });
  });
});
